"""
tests/test_data_quality.py
Automated Quality Assurance & Data Integrity Tests for AgriResilience Rwanda

Validates:
1. Schema & non-nullness of primary keys.
2. Official 30 Rwanda district nomenclature.
3. Agronomic feasibility (positive areas, biological yield ranges).
4. Physical weather bounds (precipitation, temperature).
5. Satellite NDVI spectral bounds.
6. Market price positivity and non-inversion.
"""

import pytest
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"

RWANDA_30_DISTRICTS = {
    # Eastern
    "Nyagatare", "Gatsibo", "Kayonza", "Rwamagana", "Kirehe", "Ngoma", "Bugesera",
    # Northern
    "Musanze", "Burera", "Gicumbi", "Rulindo", "Gakenke",
    # Southern
    "Huye", "Nyanza", "Gisagara", "Ruhango", "Muhanga", "Kamonyi", "Nyamagabe", "Nyaruguru",
    # Western
    "Rubavu", "Nyabihu", "Rutsiro", "Karongi", "Ngororero", "Nyamasheke", "Rusizi",
    # Kigali
    "Gasabo", "Kicukiro", "Nyarugenge"
}

VALID_CROPS = {"Maize", "Beans", "Irish Potato", "Cassava", "Rice"}
VALID_SEASONS = {"Season A", "Season B"}


@pytest.fixture(scope="module")
def processed_data():
    """Loads all cleaned datasets for quality assertions."""
    from src.clean_data import run_data_cleaning
    return run_data_cleaning()


def test_nisr_primary_keys_and_districts(processed_data):
    """Verifies that NISR records have valid keys and official district names."""
    df = processed_data["nisr"]
    
    # Assert essential columns have no nulls
    for col in ["record_id", "district", "province", "year", "season", "crop"]:
        assert df[col].isnull().sum() == 0, f"Null values found in primary column: {col}"
    
    # Check all districts belong to Rwanda 30
    districts_in_data = set(df["district"].unique())
    unknown_districts = districts_in_data - RWANDA_30_DISTRICTS
    assert len(unknown_districts) == 0, f"Unknown districts detected: {unknown_districts}"
    
    # Check seasons and crops
    assert set(df["season"].unique()).issubset(VALID_SEASONS)
    assert set(df["crop"].unique()).issubset(VALID_CROPS)


def test_nisr_agronomic_feasibility(processed_data):
    """Verifies area, yields, and harvest disposition bounds."""
    df = processed_data["nisr"]

    # Cultivated area must be strictly positive
    assert (df["cultivated_area_ha"] > 0).all(), "Cultivated area must be > 0"
    assert (df["total_production_kg"] >= 0).all(), "Production must be non-negative"
    assert (df["yield_kg_per_ha"] >= 10.0).all(), "Derived yield should be >= 10 kg/ha"
    
    # Biological maximums per crop
    for crop in ["Maize", "Beans", "Irish Potato", "Cassava", "Rice"]:
        crop_yields = df[df["crop"] == crop]["yield_kg_per_ha"]
        if not crop_yields.empty:
            assert crop_yields.max() <= 45000.0, f"Unrealistic biological yield in {crop}: {crop_yields.max()}"


def test_weather_physical_ranges(processed_data):
    """Verifies precipitation, temperature, and dry spell plausibility."""
    df = processed_data["weather"]

    # No negative rainfall
    assert (df["seasonal_rainfall_mm"] >= 0).all(), "Rainfall cannot be negative"
    assert (df["seasonal_rainfall_mm"] <= 2500).all(), "Rainfall exceeds realistic seasonal ceiling"

    # Temperatures in Celsius
    assert (df["avg_temperature_c"] >= 10.0).all(), "Average temperature unusually cold for Rwanda"
    assert (df["avg_temperature_c"] <= 38.0).all(), "Average temperature exceeds Rwandan maximum"

    # Consecutive dry days
    assert (df["consecutive_dry_days"] >= 0).all()
    assert (df["consecutive_dry_days"] <= 60).all()


def test_satellite_ndvi_ranges(processed_data):
    """Verifies that Sentinel-2 NDVI metrics adhere to physical spectral bounds."""
    df = processed_data["satellite"]

    for col in ["ndvi_early_season", "ndvi_mid_season", "ndvi_harvest", "ndvi_seasonal_mean"]:
        if col in df.columns:
            assert (df[col] >= 0.05).all(), f"NDVI in {col} below vegetative floor"
            assert (df[col] <= 1.0).all(), f"NDVI in {col} above theoretical maximum 1.0"


def test_market_prices_sanity(processed_data):
    """Verifies positive commodity prices and healthy farmgate margins."""
    df = processed_data["market"]

    assert (df["farmgate_price_per_kg_rwf"] > 0).all(), "Farmgate prices must be strictly positive"
    assert (df["wholesale_price_per_kg_rwf"] > 0).all(), "Wholesale prices must be strictly positive"

    # Farmgate price shouldn't wildly exceed wholesale price
    diff = df["farmgate_price_per_kg_rwf"] - df["wholesale_price_per_kg_rwf"]
    assert (diff <= 1.0).all(), "Anomalous condition: farm-gate price significantly exceeds wholesale price"
