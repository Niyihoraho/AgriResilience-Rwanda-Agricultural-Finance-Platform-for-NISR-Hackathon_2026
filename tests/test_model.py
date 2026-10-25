"""
tests/test_model.py
Unit & Integration Tests for AgriResilience ML Underwriting Engine
"""

import pytest
from pathlib import Path
from src.model import predict_farmer_resilience, MODELS_DIR

def test_models_exist():
    """Verify that both trained model joblib files exist on disk."""
    reg_path = MODELS_DIR / "yield_regressor.joblib"
    clf_path = MODELS_DIR / "shortfall_classifier.joblib"
    assert reg_path.exists(), "Yield regressor model file missing"
    assert clf_path.exists(), "Shortfall classifier model file missing"

def test_favorable_farmer_prediction():
    """Test a farmer in favorable agro-climatic conditions (low risk expected)."""
    profile = {
        "crop": "Irish Potato",
        "season": "Season A",
        "province": "Northern",
        "district": "Musanze",
        "cultivated_area_ha": 1.0,
        "seasonal_rainfall_mm": 840.0,
        "consecutive_dry_days": 6,
        "rainy_days_count": 65,
        "extreme_rainfall_days": 1,
        "avg_temperature_c": 19.5,
        "max_temperature_c": 25.0,
        "min_temperature_c": 13.0,
        "dry_spell_ratio": 0.09,
        "rainfall_intensity_mm_day": 12.9,
        "diurnal_temp_range_c": 12.0,
        "heat_stress_flag": 0,
        "ndvi_early_season": 0.45,
        "ndvi_mid_season": 0.78,
        "ndvi_harvest": 0.58,
        "ndvi_seasonal_mean": 0.65,
        "vegetation_health_index": 65.0,
        "ndvi_anomaly_pct": 5.0,
        "ndvi_vigor_ratio": 1.73,
        "ndvi_senescence_drop": 0.20,
        "satellite_stress_flag": 0,
        "regional_benchmark_yield": 12500.0
    }
    res = predict_farmer_resilience(profile)
    assert res["expected_yield_kg_ha"] > 5000.0
    assert res["shortfall_probability_pct"] < 30.0
    assert "Low" in res["risk_tier"] or "Moderate" in res["risk_tier"]
    assert "recommendation" in res

def test_drought_stress_farmer_prediction():
    """Test a farmer facing severe drought in Eastern savannah (high shortfall expected)."""
    profile = {
        "crop": "Maize",
        "season": "Season A",
        "province": "Eastern",
        "district": "Kayonza",
        "cultivated_area_ha": 1.0,
        "seasonal_rainfall_mm": 280.0,
        "consecutive_dry_days": 28,
        "rainy_days_count": 22,
        "extreme_rainfall_days": 0,
        "avg_temperature_c": 23.5,
        "max_temperature_c": 31.0,
        "min_temperature_c": 15.0,
        "dry_spell_ratio": 1.27,
        "rainfall_intensity_mm_day": 12.7,
        "diurnal_temp_range_c": 16.0,
        "heat_stress_flag": 1,
        "ndvi_early_season": 0.32,
        "ndvi_mid_season": 0.44,
        "ndvi_harvest": 0.35,
        "ndvi_seasonal_mean": 0.38,
        "vegetation_health_index": 38.0,
        "ndvi_anomaly_pct": -25.0,
        "ndvi_vigor_ratio": 1.37,
        "ndvi_senescence_drop": 0.09,
        "satellite_stress_flag": 1,
        "regional_benchmark_yield": 2400.0
    }
    res = predict_farmer_resilience(profile)
    assert res["shortfall_probability_pct"] > 30.0
    assert res["insurance_recommended"] is True
    assert "NAIS" in res["recommendation"]
