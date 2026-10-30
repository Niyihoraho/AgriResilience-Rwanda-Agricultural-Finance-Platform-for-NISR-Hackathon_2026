"""
src/ingest_sas_microdata.py
AgriResilience Rwanda — National Institute of Statistics of Rwanda (NISR)
Seasonal Agricultural Survey (SAS) Microdata Parser for 2019, 2024, and 2025.

Ingests and standardizes raw SPSS (.sav) and Stata/CSV microdata from:
- docs/Microdata for Rwanda Seasonal Agricultural Survey 2019
- docs/Microdata for Rwanda Seasonal Agricultural Survey 2024
- docs/Microdata for Rwanda Seasonal Agricultural Survey 2025

Extracts and harmonizes:
1. District & Province (mapped to official Rwanda 30-district administrative standard)
2. Stratum (Hillside vs Marshland vs Large-Scale Farmer / LSF)
3. Irrigation Status (Empirical question s4q15 / s4q14 / s4q13: Irrigated vs Rainfed vs Unknown)
4. Crop Identification (Maize, Beans, Irish Potato, Cassava, Rice)
5. Cultivated Area (ha), Total Production (kg), Derived Yield (kg/ha)
6. Harvest Disposition (Sold, Consumed, Seed Retained, Post-Harvest Loss)
7. Production Costs (RWF)
"""

import os
import sys
import logging
from pathlib import Path
import numpy as np
import pandas as pd
import pyreadstat

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = BASE_DIR / "docs"
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# Official Rwanda 30 Districts Map
DISTRICT_MAP = {
    11: "Nyarugenge", 12: "Gasabo", 13: "Kicukiro",
    21: "Nyanza", 22: "Gisagara", 23: "Nyaruguru", 24: "Huye", 25: "Nyamagabe",
    26: "Ruhango", 27: "Muhanga", 28: "Kamonyi",
    31: "Karongi", 32: "Rutsiro", 33: "Rubavu", 34: "Nyabihu", 35: "Ngororero",
    36: "Rusizi", 37: "Nyamasheke",
    41: "Rulindo", 42: "Gakenke", 43: "Musanze", 44: "Burera", 45: "Gicumbi",
    51: "Rwamagana", 52: "Nyagatare", 53: "Gatsibo", 54: "Kayonza", 55: "Kirehe",
    56: "Ngoma", 57: "Bugesera"
}

PROVINCE_MAP = {
    1: "Kigali", 2: "Southern", 3: "Western", 4: "Northern", 5: "Eastern"
}

# Standardized Crop Code Mapping across NISR SAS rounds
CROP_CODE_MAP = {
    101.0: "Maize",
    102.0: "Rice",
    106.0: "Beans",
    107.0: "Beans",
    141.0: "Beans",
    146.0: "Beans",
    110.0: "Irish Potato",
    111.0: "Irish Potato",
    310.0: "Cassava"
}

CROP_CATEGORY_MAP = {
    1.0: "Maize",
    3.0: "Rice",
    7.0: "Irish Potato",
    9.0: "Cassava",
    10.0: "Beans",
    11.0: "Beans"
}

# Agronomic boundaries for data cleaning
MAX_YIELD_LIMITS = {
    "Maize": 10000.0,
    "Beans": 3500.0,
    "Irish Potato": 30000.0,
    "Cassava": 45000.0,
    "Rice": 12000.0
}


def parse_2019_round(season_char: str) -> pd.DataFrame:
    """Parses NISR SAS 2019 microdata for Season A, B, or C."""
    folder = DOCS_DIR / "Microdata for Rwanda Seasonal Agricultural Survey 2019"
    f_prod = folder / f"rwa-sas-season{season_char}_Crop production.sav"
    f_prac = folder / f"rwa-sas-Season{season_char}_PartIV_Agricultural practice.sav"

    if not f_prod.exists():
        logger.warning(f"File not found: {f_prod}")
        return pd.DataFrame()

    logger.info(f"Parsing 2019 Season {season_char} microdata...")
    df_p, meta_p = pyreadstat.read_sav(str(f_prod))

    # Read agricultural practice for irrigation if available
    irrig_map = {}
    if f_prac.exists():
        try:
            df_pr, _ = pyreadstat.read_sav(str(f_prac))
            if "Segment_ID" in df_pr.columns and "s2q1" in df_pr.columns and "s4q13" in df_pr.columns:
                for _, r in df_pr[["Segment_ID", "s2q1", "s4q13"]].dropna().iterrows():
                    irrig_map[(r["Segment_ID"], r["s2q1"])] = "Irrigated" if r["s4q13"] == 1.0 else "Rainfed"
        except Exception as e:
            logger.warning(f"Could not parse 2019 practice file: {e}")

    # Map crop
    df_p["crop"] = df_p["s2q6"].map(CROP_CODE_MAP)
    df = df_p[df_p["crop"].notna()].copy()

    # District & Province
    df["district"] = df["s1q2"].map(DISTRICT_MAP).fillna(df["s1q2"].astype(str).str.title())
    df["province"] = df["s1q1"].map(PROVINCE_MAP).fillna("Rwanda")
    df["year"] = 2019
    df["season"] = f"Season {season_char}"

    # Stratum
    stratum_map = {11.0: "Hillside", 20.0: "Marshland", 30.0: "Rangeland", 40.0: "Mixed", 50.0: "LSF"}
    df["stratum"] = df["s1q3"].map(stratum_map).fillna("Hillside")

    # Cultivated Area (ha)
    area_series = df["Harvested_Area"].fillna(df.get("s2q7", np.nan))
    if "s2q2" in df.columns:
        area_series = area_series.fillna(df["s2q2"] / 10000.0)
    df["cultivated_area_ha"] = area_series.fillna(0.1).clip(lower=0.01)

    # Production & Harvest
    df["total_production_kg"] = df["s2q21"].fillna(0.0).clip(lower=0.0)
    df["quantity_sold_kg"] = df["s2q25"].fillna(0.0).clip(lower=0.0)
    df["household_consumption_kg"] = df["s2q28"].fillna(0.0).clip(lower=0.0)
    df["seed_retained_kg"] = df["s2q33"].fillna(0.0).clip(lower=0.0)
    df["post_harvest_loss_kg"] = df["s2q37"].fillna(0.0).clip(lower=0.0)

    # Derived Yield
    df["yield_kg_per_ha"] = (df["total_production_kg"] / df["cultivated_area_ha"]).round(1)

    # Cost
    cost_series = df.get("s2q13", pd.Series(0, index=df.index)).fillna(0) + df.get("s2q16", pd.Series(0, index=df.index)).fillna(0)
    df["production_cost_rwf"] = cost_series.clip(lower=25000.0)

    # Irrigation status
    def resolve_irrig(row):
        key = (row.get("Segment_ID"), row.get("s2q1"))
        if key in irrig_map:
            return irrig_map[key]
        if row.get("s1q3") == 20.0:
            return "Irrigated" if row["crop"] == "Rice" else "Marshland Rainfed"
        return "Unknown"

    df["irrigation_status"] = df.apply(resolve_irrig, axis=1)

    # Unique record_id
    df["record_id"] = [f"REC-NISR-2019{season_char}-{i:05d}" for i in range(1, len(df) + 1)]

    cols = [
        "record_id", "district", "province", "year", "season", "crop", "stratum",
        "cultivated_area_ha", "total_production_kg", "yield_kg_per_ha",
        "household_consumption_kg", "seed_retained_kg", "post_harvest_loss_kg",
        "quantity_sold_kg", "production_cost_rwf", "irrigation_status"
    ]
    return df[cols]


def parse_modern_round(year: int, season_char: str) -> pd.DataFrame:
    """Parses NISR SAS 2024 or 2025 microdata for Season A, B, or C."""
    folder = DOCS_DIR / f"Microdata for Rwanda Seasonal Agricultural Survey {year}" / f"Season {season_char}"
    f_prod = folder / f"Rwa_raw_Season{season_char}{year}_Production.sav"

    if not f_prod.exists():
        logger.warning(f"File not found: {f_prod}")
        return pd.DataFrame()

    logger.info(f"Parsing {year} Season {season_char} microdata...")
    df, _ = pyreadstat.read_sav(str(f_prod))

    # Crop
    df["crop"] = df["s2q4"].map(CROP_CODE_MAP)
    if "CropCategory" in df.columns:
        df["crop"] = df["crop"].fillna(df["CropCategory"].map(CROP_CATEGORY_MAP))

    df = df[df["crop"].notna()].copy()

    # District & Province
    df["district"] = df["s1q2"].map(DISTRICT_MAP).fillna(df["s1q2"].astype(str).str.title())
    df["province"] = df["s1q1"].map(PROVINCE_MAP).fillna("Rwanda")
    df["year"] = int(year)
    df["season"] = f"Season {season_char}"

    # Stratum
    stratum_map = {0.0: "LSF", 10.0: "Hillside", 20.0: "Marshland", 30.0: "Rangeland", 40.0: "Mixed", 90.0: "LSF"}
    df["stratum"] = df["s1q3"].map(stratum_map).fillna("Hillside")

    # Cultivated Area (ha)
    area_series = None
    for c in ["Crop_Area_ha", "crop_area", "Plot_area_ha", "Harvested_Crop_Area_ha", "Plot_size_ha"]:
        if c in df.columns:
            if area_series is None:
                area_series = df[c]
            else:
                area_series = area_series.fillna(df[c])

    if "s2q2" in df.columns:
        area_from_sqm = df["s2q2"] / 10000.0
        area_series = area_series.fillna(area_from_sqm) if area_series is not None else area_from_sqm

    df["cultivated_area_ha"] = area_series.fillna(0.1).clip(lower=0.01)

    # Total production (kg)
    df["total_production_kg"] = df["s2q21"].fillna(0.0).clip(lower=0.0)

    # Derived Yield
    df["yield_kg_per_ha"] = (df["total_production_kg"] / df["cultivated_area_ha"]).round(1)

    # Harvest disposition
    sold_col = "s2q26" if "s2q26" in df.columns else "s2q25"
    df["quantity_sold_kg"] = df[sold_col].fillna(0.0).clip(lower=0.0) if sold_col in df.columns else 0.0

    cons_col = "s2q29" if "s2q29" in df.columns else "s2q28"
    df["household_consumption_kg"] = df[cons_col].fillna(0.0).clip(lower=0.0) if cons_col in df.columns else 0.0

    seed_col = "s2q34" if "s2q34" in df.columns else "s2q33"
    df["seed_retained_kg"] = df[seed_col].fillna(0.0).clip(lower=0.0) if seed_col in df.columns else 0.0

    loss_cols = [c for c in ["s2q45", "s2q46", "s2q47", "s2q48", "s2q49", "s2q50"] if c in df.columns]
    if loss_cols:
        df["post_harvest_loss_kg"] = df[loss_cols].fillna(0.0).sum(axis=1).clip(lower=0.0)
    else:
        df["post_harvest_loss_kg"] = 0.0

    # Production cost
    cost_series = pd.Series(0.0, index=df.index)
    for c in ["s2q15", "s2q18", "s4q19", "s4q18"]:
        if c in df.columns:
            cost_series += df[c].fillna(0.0)
    df["production_cost_rwf"] = cost_series.clip(lower=35000.0)

    # Irrigation status: s4q15 in 2024, s4q14 in 2025
    irrig_col = "s4q15" if "s4q15" in df.columns else ("s4q14" if "s4q14" in df.columns else None)
    if irrig_col and irrig_col in df.columns:
        irrig_map = {1.0: "Irrigated", 2.0: "Rainfed"}
        df["irrigation_status"] = df[irrig_col].map(irrig_map).fillna("Unknown")
    else:
        df["irrigation_status"] = "Unknown"

    # Unique record_id
    df["record_id"] = [f"REC-NISR-{year}{season_char}-{i:05d}" for i in range(1, len(df) + 1)]

    cols = [
        "record_id", "district", "province", "year", "season", "crop", "stratum",
        "cultivated_area_ha", "total_production_kg", "yield_kg_per_ha",
        "household_consumption_kg", "seed_retained_kg", "post_harvest_loss_kg",
        "quantity_sold_kg", "production_cost_rwf", "irrigation_status"
    ]
    return df[cols]


def ingest_all_downloaded_microdata() -> pd.DataFrame:
    """Ingests, cleans, and merges all 2019, 2024, and 2025 SAS microdata rounds."""
    rounds = [
        (2019, "A"), (2019, "B"),
        (2024, "A"), (2024, "B"),
        (2025, "A"), (2025, "B"),
    ]

    dfs = []
    for yr, s in rounds:
        if yr == 2019:
            df_round = parse_2019_round(s)
        else:
            df_round = parse_modern_round(yr, s)
        if not df_round.empty:
            dfs.append(df_round)

    if not dfs:
        logger.error("No microdata files could be parsed!")
        return pd.DataFrame()

    df_all = pd.concat(dfs, ignore_index=True)
    logger.info(f"Total raw microdata extracted: {len(df_all):,} records.")

    # Quality and agronomic filters
    initial_len = len(df_all)
    df_all = df_all[df_all["cultivated_area_ha"] > 0].copy()
    df_all = df_all[df_all["total_production_kg"] >= 0].copy()
    df_all["yield_kg_per_ha"] = (df_all["total_production_kg"] / df_all["cultivated_area_ha"]).round(1)

    # Filter agronomic upper limits
    for crop, max_y in MAX_YIELD_LIMITS.items():
        mask_crop = df_all["crop"] == crop
        df_all = df_all[~(mask_crop & (df_all["yield_kg_per_ha"] > max_y))].copy()
        df_all = df_all[~(mask_crop & (df_all["yield_kg_per_ha"] < 5.0))].copy()

    logger.info(f"Retained {len(df_all):,}/{initial_len:,} microdata rows after quality filtering.")

    # Save to data/raw/nisr_microdata/
    microdata_dir = RAW_DIR / "nisr_microdata"
    microdata_dir.mkdir(parents=True, exist_ok=True)
    out_path = microdata_dir / "nisr_sas_2019_2025_microdata.csv"
    df_all.to_csv(out_path, index=False)
    logger.info(f"Saved standardized microdata to {out_path} ({out_path.stat().st_size:,} bytes)")

    return df_all


if __name__ == "__main__":
    df = ingest_all_downloaded_microdata()
    print("Ingestion complete. Summary:")
    print(df.groupby(["year", "season", "crop"]).size().unstack().fillna(0).astype(int))

