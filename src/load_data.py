"""
src/load_data.py
AgriResilience Rwanda Data Ingestion Engine

Loads and validates the 4 core pillars of Rwandan agricultural data:
1. NISR Agricultural Survey Records (Production, Cultivated Area, Harvest Disposition)
2. NASA POWER Agroclimatology (Seasonal Precipitation, Dry Spells, Extreme Rain, Temperatures)
3. Satellite Sentinel-2 Earth Observation (NDVI Trajectory, Health Index, Anomaly %)
4. Market Commodity Prices (e-Soko / MINAGRI farm-gate, wholesale, retail, transport)
5. Rwanda 30-District GeoJSON boundaries for spatial choropleths

Supports seamless drop-in replacement when new survey files are downloaded from NISR portal.
"""

import os
import json
import logging
from pathlib import Path
import pandas as pd
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# File paths
FILES = {
    "nisr": RAW_DIR / "nisr_agricultural_records.csv",
    "weather": RAW_DIR / "weather_nasa_power.csv",
    "satellite": RAW_DIR / "satellite_ndvi_sentinel.csv",
    "market": RAW_DIR / "market_prices_esoko.csv",
    "geojson": RAW_DIR / "rwanda_districts.geojson",
}


def load_rwanda_geojson() -> dict:
    """Loads official Rwanda 30-district boundaries GeoJSON."""
    geojson_path = FILES["geojson"]
    if not geojson_path.exists():
        logger.info("Rwanda GeoJSON not found locally. Downloading from geoBoundaries...")
        url = "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/RWA/ADM2/geoBoundaries-RWA-ADM2.geojson"
        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            with open(geojson_path, "w", encoding="utf-8") as f:
                f.write(resp.text)
            logger.info("Saved Rwanda GeoJSON.")
        except Exception as e:
            logger.warning(f"Could not download GeoJSON: {e}")
            return {}

    with open(geojson_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_nisr_records() -> pd.DataFrame:
    """
    Loads NISR seasonal production records.
    If custom/official microdata exists in 'data/raw/nisr_microdata/', it is prioritized.
    """
    custom_dir = RAW_DIR / "nisr_microdata"
    if custom_dir.exists():
        csv_files = list(custom_dir.glob("*.csv"))
        if csv_files:
            logger.info(f"Loading custom NISR microdata: {csv_files[0]}")
            return pd.read_csv(csv_files[0])

    path = FILES["nisr"]
    if not path.exists():
        raise FileNotFoundError(f"Missing NISR dataset at {path}")
    logger.info(f"Loaded NISR production records from {path.name}")
    return pd.read_csv(path)


def load_weather_records() -> pd.DataFrame:
    """Loads seasonal weather records (NASA POWER Agroclimatology)."""
    path = FILES["weather"]
    if not path.exists():
        raise FileNotFoundError(f"Missing weather dataset at {path}")
    logger.info(f"Loaded weather observations from {path.name}")
    return pd.read_csv(path)


def load_satellite_ndvi() -> pd.DataFrame:
    """Loads Sentinel-2 satellite vegetation canopy metrics."""
    path = FILES["satellite"]
    if not path.exists():
        raise FileNotFoundError(f"Missing satellite NDVI dataset at {path}")
    logger.info(f"Loaded satellite NDVI metrics from {path.name}")
    return pd.read_csv(path)


def load_market_prices() -> pd.DataFrame:
    """Loads commodity market and farmgate prices (e-Soko / MINAGRI)."""
    path = FILES["market"]
    if not path.exists():
        raise FileNotFoundError(f"Missing market prices dataset at {path}")
    logger.info(f"Loaded market prices from {path.name}")
    return pd.read_csv(path)


def load_all_raw_data() -> dict:
    """Loads all 4 raw datasets plus GeoJSON into a structured dictionary."""
    data = {
        "nisr": load_nisr_records(),
        "weather": load_weather_records(),
        "satellite": load_satellite_ndvi(),
        "market": load_market_prices(),
        "geojson": load_rwanda_geojson(),
    }
    return data


def audit_raw_data_summary():
    """Prints a clear inspection report of raw data for the team and judges."""
    data = load_all_raw_data()
    print("\n" + "=" * 65)
    print("        AGRIRESILIENCE RWANDA - RAW DATA AUDIT REPORT        ")
    print("=" * 65)
    
    nisr = data["nisr"]
    weather = data["weather"]
    sat = data["satellite"]
    mkt = data["market"]
    geo = data["geojson"]

    print(f"1. NISR Production Survey:")
    print(f"   • Rows: {len(nisr):,} | Columns: {list(nisr.columns)}")
    print(f"   • Years: {sorted(nisr['year'].unique())} | Seasons: {list(nisr['season'].unique())}")
    print(f"   • Crops: {list(nisr['crop'].unique())}")
    print(f"   • Districts: {nisr['district'].nunique()} districts across {nisr['province'].nunique()} provinces")

    print(f"\n2. NASA POWER Weather Grid:")
    print(f"   • Rows: {len(weather):,} | Columns: {list(weather.columns)}")
    print(f"   • Rainfall range: {weather['seasonal_rainfall_mm'].min():.1f}mm - {weather['seasonal_rainfall_mm'].max():.1f}mm")
    print(f"   • Consecutive dry days range: {weather['consecutive_dry_days'].min()} - {weather['consecutive_dry_days'].max()} days")

    print(f"\n3. Sentinel-2 Satellite NDVI:")
    print(f"   • Rows: {len(sat):,} | Columns: {list(sat.columns)}")
    print(f"   • Mean NDVI range: {sat['ndvi_seasonal_mean'].min():.3f} - {sat['ndvi_seasonal_mean'].max():.3f}")

    print(f"\n4. Market Commodity Prices (e-Soko):")
    print(f"   • Rows: {len(mkt):,} | Columns: {list(mkt.columns)}")
    print(f"   • Crops monitored: {list(mkt['crop'].unique())}")

    print(f"\n5. Spatial Boundaries:")
    features_count = len(geo.get("features", [])) if isinstance(geo, dict) else 0
    print(f"   • GeoJSON Districts Count: {features_count}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    audit_raw_data_summary()
