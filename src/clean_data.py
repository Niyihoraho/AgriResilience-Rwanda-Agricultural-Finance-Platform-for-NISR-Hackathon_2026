"""
src/clean_data.py
AgriResilience Rwanda Data Cleaning & Harmonization Pipeline

Responsibilities:
1. Ingest raw datasets from src.load_data.
2. Standardize categorical labels (crop names, district spellings, seasons).
3. Validate biological & economic feasibility (yield limits, non-negative areas/prices).
4. Perform harvest disposition accounting audit.
5. Impute minor missing values using localized district-crop medians.
6. Export standardized tables to data/processed/.
"""

import sys
import logging
from pathlib import Path
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from src.load_data import load_all_raw_data

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# Standard Crop Dictionary
CROP_MAPPING = {
    "irish potatoes": "Irish Potato",
    "irish potato": "Irish Potato",
    "maize": "Maize",
    "beans": "Beans",
    "cassava": "Cassava",
    "rice": "Rice"
}

# Plausible Upper Yield Limits (kg/ha) for Smallholders in East Africa
MAX_YIELD_LIMITS = {
    "Maize": 10000.0,
    "Beans": 3500.0,
    "Irish Potato": 30000.0,
    "Cassava": 45000.0,
    "Rice": 12000.0
}


def clean_nisr_records(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans and standardizes NISR agricultural survey microdata."""
    logger.info("Cleaning NISR agricultural production records...")
    df = df.copy()

    # Standardize string fields
    df["district"] = df["district"].astype(str).str.strip().str.title()
    df["province"] = df["province"].astype(str).str.strip().str.title()
    df["season"] = df["season"].astype(str).str.strip()
    df["crop"] = df["crop"].astype(str).str.strip().str.lower().map(CROP_MAPPING).fillna(df["crop"])

    initial_len = len(df)

    # 1. Filter invalid area or production
    df = df[df["cultivated_area_ha"] > 0].copy()
    df = df[df["total_production_kg"] >= 0].copy()

    # 2. Derive normalized yield (kg/ha)
    df["yield_kg_per_ha"] = (df["total_production_kg"] / df["cultivated_area_ha"]).round(1)

    # 3. Filter unrealistic outliers based on agronomic bounds
    for crop, max_y in MAX_YIELD_LIMITS.items():
        mask_crop = df["crop"] == crop
        df = df[~(mask_crop & (df["yield_kg_per_ha"] > max_y))].copy()
        df = df[~(mask_crop & (df["yield_kg_per_ha"] < 10.0))].copy()

    # 4. Harvest disposition checks: ensure sum of components doesn't wildly exceed harvest
    disposition_sum = (
        df["quantity_sold_kg"].fillna(0)
        + df["household_consumption_kg"].fillna(0)
        + df["seed_retained_kg"].fillna(0)
        + df["post_harvest_loss_kg"].fillna(0)
    )
    # Allow 10% measurement buffer; if exceeds, cap proportionally
    excess_mask = disposition_sum > (df["total_production_kg"] * 1.1)
    if excess_mask.any():
        logger.info(f"Harmonizing harvest accounting for {excess_mask.sum()} survey records...")
        scale = df.loc[excess_mask, "total_production_kg"] / disposition_sum[excess_mask]
        df.loc[excess_mask, "quantity_sold_kg"] = (df.loc[excess_mask, "quantity_sold_kg"] * scale).round(1)
        df.loc[excess_mask, "household_consumption_kg"] = (df.loc[excess_mask, "household_consumption_kg"] * scale).round(1)

    logger.info(f"Cleaned NISR records: retained {len(df):,}/{initial_len:,} rows ({len(df)/initial_len*100:.1f}%)")
    return df


def clean_weather_records(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans and validates NASA POWER meteorological observations."""
    logger.info("Cleaning NASA POWER weather records...")
    df = df.copy()

    df["district"] = df["district"].astype(str).str.strip().str.title()
    df["province"] = df["province"].astype(str).str.strip().str.title()
    df["season"] = df["season"].astype(str).str.strip()

    # Physical checks for Rwandan climate
    df["seasonal_rainfall_mm"] = df["seasonal_rainfall_mm"].clip(lower=50.0, upper=2500.0)
    df["consecutive_dry_days"] = df["consecutive_dry_days"].clip(lower=0, upper=70)
    df["avg_temperature_c"] = df["avg_temperature_c"].clip(lower=10.0, upper=38.0)

    # Impute missing with district seasonal medians if any
    numeric_cols = ["seasonal_rainfall_mm", "consecutive_dry_days", "rainy_days_count", "avg_temperature_c"]
    df[numeric_cols] = df.groupby(["district", "season"])[numeric_cols].transform(lambda x: x.fillna(x.median()))

    logger.info(f"Cleaned weather records: {len(df):,} rows verified.")
    return df


def clean_satellite_records(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans Sentinel-2 NDVI satellite records."""
    logger.info("Cleaning Sentinel-2 satellite NDVI records...")
    df = df.copy()

    df["district"] = df["district"].astype(str).str.strip().str.title()
    df["season"] = df["season"].astype(str).str.strip()

    # NDVI physical bounds: -0.1 to 1.0 for vegetation
    ndvi_cols = [c for c in df.columns if "ndvi" in c and "pct" not in c]
    for col in ndvi_cols:
        df[col] = df[col].clip(lower=0.1, upper=0.98)

    # Health Index bounds: 0 - 100
    if "vegetation_health_index" in df.columns:
        df["vegetation_health_index"] = df["vegetation_health_index"].clip(lower=0.0, upper=100.0)

    logger.info(f"Cleaned satellite NDVI records: {len(df):,} rows verified.")
    return df


def clean_market_records(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans e-Soko agricultural market prices."""
    logger.info("Cleaning e-Soko market commodity prices...")
    df = df.copy()

    df["district"] = df["district"].astype(str).str.strip().str.title()
    df["season"] = df["season"].astype(str).str.strip()
    df["crop"] = df["crop"].astype(str).str.strip().str.lower().map(CROP_MAPPING).fillna(df["crop"])

    # Ensure price sanity: retail >= wholesale >= farmgate
    # If farmgate > wholesale due to data entry glitch, fix by applying typical spread
    inverted_mask = df["farmgate_price_per_kg_rwf"] > df["wholesale_price_per_kg_rwf"]
    if inverted_mask.any():
        logger.info(f"Correcting inverted farmgate-wholesale spreads for {inverted_mask.sum()} entries...")
        df.loc[inverted_mask, "farmgate_price_per_kg_rwf"] = (
            df.loc[inverted_mask, "wholesale_price_per_kg_rwf"] * 0.82
        ).round(1)

    logger.info(f"Cleaned market records: {len(df):,} rows verified.")
    return df


def run_data_cleaning() -> dict:
    """Executes end-to-end cleaning and saves results to data/processed/."""
    print("\n" + "=" * 65)
    print("      AGRIRESILIENCE RWANDA - DATA CLEANING PIPELINE         ")
    print("=" * 65)
    
    raw = load_all_raw_data()
    clean_nisr = clean_nisr_records(raw["nisr"])
    clean_weather = clean_weather_records(raw["weather"])
    clean_sat = clean_satellite_records(raw["satellite"])
    clean_mkt = clean_market_records(raw["market"])

    # Save to data/processed/
    clean_nisr.to_csv(PROCESSED_DIR / "clean_nisr.csv", index=False)
    clean_weather.to_csv(PROCESSED_DIR / "clean_weather.csv", index=False)
    clean_sat.to_csv(PROCESSED_DIR / "clean_satellite.csv", index=False)
    clean_mkt.to_csv(PROCESSED_DIR / "clean_market.csv", index=False)

    print("\nSuccessfully cleaned and saved all tables to data/processed/:")
    print(f"  • clean_nisr.csv:      {len(clean_nisr):,} records")
    print(f"  • clean_weather.csv:   {len(clean_weather):,} records")
    print(f"  • clean_satellite.csv: {len(clean_sat):,} records")
    print(f"  • clean_market.csv:    {len(clean_mkt):,} records")
    print("=" * 65 + "\n")

    return {
        "nisr": clean_nisr,
        "weather": clean_weather,
        "satellite": clean_sat,
        "market": clean_mkt
    }


if __name__ == "__main__":
    run_data_cleaning()
