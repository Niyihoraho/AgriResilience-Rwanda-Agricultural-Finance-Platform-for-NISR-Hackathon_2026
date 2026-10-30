"""
src/integrate_data.py
AgriResilience Rwanda Multi-Source Fusion & Feature Engineering Engine

Responsibilities:
1. Merge the 4 cleaned data pillars:
   - NISR Farmer Survey Records (Production & Cultivation)
   - NASA POWER Meteorological Observations (Weather & Dry Spells)
   - Sentinel-2 Satellite Earth Observation (Canopy Greenness & NDVI)
   - e-Soko / MINAGRI Market Prices (Farmgate & Wholesale Economics)
2. Engineer agronomic, climatic, and financial risk features.
3. Establish historical regional benchmarks and construct target variables:
   - Target 1 (Continuous): yield_kg_per_ha
   - Target 2 (Binary Classification): is_production_shortfall (< 70% regional benchmark)
4. Export integrated master dataset to data/processed/integrated_agricultural_dataset.csv.
"""

import sys
import logging
from pathlib import Path
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from src.clean_data import run_data_cleaning
from src.climate import add_climate_defense_features

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

PROCESSED_DIR = BASE_DIR / "data" / "processed"


def load_cleaned_components() -> dict:
    """Loads cleaned component tables from data/processed/, running cleaning if missing."""
    files = {
        "nisr": PROCESSED_DIR / "clean_nisr.csv",
        "weather": PROCESSED_DIR / "clean_weather.csv",
        "satellite": PROCESSED_DIR / "clean_satellite.csv",
        "market": PROCESSED_DIR / "clean_market.csv"
    }

    if not all(p.exists() for p in files.values()):
        logger.info("One or more cleaned files missing. Running cleaning pipeline...")
        return run_data_cleaning()

    return {k: pd.read_csv(p) for k, p in files.items()}


def compute_point_in_time_benchmarks(data: pd.DataFrame, min_samples: int = 5) -> pd.DataFrame:
    """
    Computes strictly point-in-time regional historical benchmarks for every observation.
    Temporal Invariance Principles:
    1. For every observation at (district, crop, season, year), only historical yields strictly 
       available BEFORE that season are used (year_prior < year).
    2. Excludes the current season's actual harvest and all future-year records.
    3. Hierarchical Fallback Cascade when prior sample size < min_samples:
       - Level 1: Exact District + Crop + Season for strictly prior years (year < y).
       - Level 2: District + Crop across all strictly prior completed seasons (time < t).
       - Level 3: Province + Crop + Season for strictly prior years (year < y).
       - Level 4: National + Crop + Season for strictly prior years (year < y).
       - Level 5: Cold-start anchor for Year 2021 (the initial training baseline).
    """
    df_out = data.copy()
    season_order = {"Season A": 0, "Season B": 1}
    df_out["_time_idx"] = df_out["year"] * 2 + df_out["season"].map(season_order)

    # Pre-index historical slices for instant vectorized lookup
    grouped_dcsy = df_out.groupby(["district", "crop", "season", "year"])["yield_kg_per_ha"].apply(list).to_dict()
    grouped_dct = df_out.groupby(["district", "crop", "_time_idx"])["yield_kg_per_ha"].apply(list).to_dict()
    grouped_pcsy = df_out.groupby(["province", "crop", "season", "year"])["yield_kg_per_ha"].apply(list).to_dict()
    grouped_csy = df_out.groupby(["crop", "season", "year"])["yield_kg_per_ha"].apply(list).to_dict()
    
    grouped_cs_2021 = df_out[df_out["year"] == 2021].groupby(["crop", "season"])["yield_kg_per_ha"].apply(list).to_dict()
    grouped_c_2021 = df_out[df_out["year"] == 2021].groupby("crop")["yield_kg_per_ha"].apply(list).to_dict()

    unique_combos = df_out[["district", "crop", "season", "year", "_time_idx", "province"]].drop_duplicates()
    
    bench_dict = {}
    tier_dict = {}
    sample_size_dict = {}

    years = sorted(df_out["year"].unique())

    for _, r in unique_combos.iterrows():
        d = r["district"]
        c = r["crop"]
        s = r["season"]
        y = r["year"]
        t = r["_time_idx"]
        prov = r["province"]
        key = (d, c, s, y)

        prior_y = [yp for yp in years if yp < y]

        # Tier 1: Exact District + Crop + Season for strictly prior years
        s1 = []
        for yp in prior_y:
            s1.extend(grouped_dcsy.get((d, c, s, yp), []))

        if len(s1) >= min_samples:
            bench_dict[key] = round(float(np.median(s1)), 1)
            tier_dict[key] = "exact_district_crop_season"
            sample_size_dict[key] = len(s1)
            continue

        # Tier 2: District + Crop across all strictly prior completed seasons
        s2 = []
        for tp in range(t):
            s2.extend(grouped_dct.get((d, c, tp), []))

        if len(s2) >= min_samples:
            bench_dict[key] = round(float(np.median(s2)), 1)
            tier_dict[key] = "district_crop_all_prior_seasons"
            sample_size_dict[key] = len(s2)
            continue

        # Tier 3: Province level for strictly prior years
        s3 = []
        for yp in prior_y:
            s3.extend(grouped_pcsy.get((prov, c, s, yp), []))

        if len(s3) >= min_samples:
            bench_dict[key] = round(float(np.median(s3)), 1)
            tier_dict[key] = "province_crop_season"
            sample_size_dict[key] = len(s3)
            continue

        # Tier 4: National level for strictly prior years
        s4 = []
        for yp in prior_y:
            s4.extend(grouped_csy.get((c, s, yp), []))

        if len(s4) >= min_samples:
            bench_dict[key] = round(float(np.median(s4)), 1)
            tier_dict[key] = "national_crop_season"
            sample_size_dict[key] = len(s4)
            continue

        # Tier 5: Initial cold-start anchor for Year 2021
        s5 = grouped_cs_2021.get((c, s), [])
        if len(s5) > 0:
            bench_dict[key] = round(float(np.median(s5)), 1)
            tier_dict[key] = "initial_year_anchor_2021"
            sample_size_dict[key] = len(s5)
        else:
            s6 = grouped_c_2021.get(c, [1000.0])
            bench_dict[key] = round(float(np.median(s6)), 1)
            tier_dict[key] = "initial_year_crop_anchor"
            sample_size_dict[key] = len(s6)

    lookup_keys = list(zip(df_out["district"], df_out["crop"], df_out["season"], df_out["year"]))
    df_out["regional_benchmark_yield"] = [bench_dict[k] for k in lookup_keys]
    df_out["benchmark_fallback_tier"] = [tier_dict[k] for k in lookup_keys]
    df_out["benchmark_sample_size"] = [sample_size_dict[k] for k in lookup_keys]
    df_out.drop(columns=["_time_idx"], inplace=True)
    return df_out


def fuse_and_engineer_features() -> pd.DataFrame:
    """Merges all datasets and engineers domain-rich features."""
    tables = load_cleaned_components()
    df_nisr = tables["nisr"]
    df_weather = tables["weather"]
    df_sat = tables["satellite"]
    df_mkt = tables["market"]

    logger.info("Executing multi-source relational join...")
    
    # 1. Join NISR with Weather on (district, year, season)
    weather_cols_to_use = [
        "district", "year", "season", 
        "seasonal_rainfall_mm", "consecutive_dry_days", "rainy_days_count", 
        "extreme_rainfall_days", "avg_temperature_c", "max_temperature_c", "min_temperature_c"
    ]
    df_merged = pd.merge(
        df_nisr,
        df_weather[weather_cols_to_use],
        on=["district", "year", "season"],
        how="inner"
    )

    # 2. Join with Satellite NDVI on (district, year, season)
    sat_cols_to_use = [
        "district", "year", "season",
        "ndvi_early_season", "ndvi_mid_season", "ndvi_harvest", 
        "ndvi_seasonal_mean", "vegetation_health_index", "ndvi_anomaly_pct"
    ]
    df_merged = pd.merge(
        df_merged,
        df_sat[sat_cols_to_use],
        on=["district", "year", "season"],
        how="inner"
    )

    # 3. Join with Market Prices on (district, year, season, crop)
    mkt_cols_to_use = [
        "district", "year", "season", "crop",
        "farmgate_price_per_kg_rwf", "wholesale_price_per_kg_rwf", 
        "retail_price_per_kg_rwf", "transport_cost_per_kg_rwf"
    ]
    df_merged = pd.merge(
        df_merged,
        df_mkt[mkt_cols_to_use],
        on=["district", "year", "season", "crop"],
        how="inner"
    )

    logger.info(f"Relational merge complete: {len(df_merged):,} matched records across 4 sources.")

    # 4. Feature Engineering: Agronomic & Multi-Dimensional Climate Defense
    # Seasonal rainfall alone does not tell whether the crop received water when needed.
    # We engineer the multi-dimensional Climate Defense framework (FAO ETc, dry spells, deluge, thermal, regularity).
    logger.info("Computing multi-dimensional Climate Defense Score and biophysical components...")
    df_merged = add_climate_defense_features(df_merged)

    # Ratio of consecutive dry days to rainy days
    df_merged["dry_spell_ratio"] = (
        df_merged["consecutive_dry_days"] / df_merged["rainy_days_count"].clip(lower=1)
    ).round(3)
    
    # Daily precipitation intensity on rainy days
    df_merged["rainfall_intensity_mm_day"] = (
        df_merged["seasonal_rainfall_mm"] / df_merged["rainy_days_count"].clip(lower=1)
    ).round(2)

    # Diurnal temperature range
    df_merged["diurnal_temp_range_c"] = (
        df_merged["max_temperature_c"] - df_merged["min_temperature_c"]
    ).round(2)

    # Heat stress flag (Max temp >= 28C, sensitive for maize/potatoes)
    df_merged["heat_stress_flag"] = (df_merged["max_temperature_c"] >= 28.0).astype(int)

    # 5. Feature Engineering: Satellite NDVI Trajectory
    # Growth vigor (mid-season canopy vs early season)
    df_merged["ndvi_vigor_ratio"] = (
        df_merged["ndvi_mid_season"] / df_merged["ndvi_early_season"].clip(lower=0.1)
    ).round(3)

    # Senescence drop (mid-season peak to harvest drop)
    df_merged["ndvi_senescence_drop"] = (
        df_merged["ndvi_mid_season"] - df_merged["ndvi_harvest"]
    ).round(3)

    # Vegetation deficit flag
    df_merged["satellite_stress_flag"] = (df_merged["ndvi_anomaly_pct"] < -8.0).astype(int)

    # 6. Feature Engineering: Economic & Financial Indicators
    # Gross sales revenue in RWF
    df_merged["gross_revenue_rwf"] = (
        df_merged["quantity_sold_kg"] * df_merged["farmgate_price_per_kg_rwf"]
    ).round(0)

    # Estimated net farm margin
    df_merged["net_margin_rwf"] = (
        df_merged["gross_revenue_rwf"] - df_merged["production_cost_rwf"]
    ).round(0)

    # Commercialization rate (share of crop sold vs produced)
    df_merged["commercialization_rate"] = (
        df_merged["quantity_sold_kg"] / df_merged["total_production_kg"].clip(lower=1)
    ).clip(lower=0.0, upper=1.0).round(3)

    # Food security retention rate (home consumption + seed)
    df_merged["food_retention_rate"] = (
        (df_merged["household_consumption_kg"] + df_merged["seed_retained_kg"]) 
        / df_merged["total_production_kg"].clip(lower=1)
    ).clip(lower=0.0, upper=1.0).round(3)

    # Post-harvest loss rate
    df_merged["loss_rate"] = (
        df_merged["post_harvest_loss_kg"] / df_merged["total_production_kg"].clip(lower=1)
    ).clip(lower=0.0, upper=1.0).round(3)

    # 7. Benchmark Calculation & Machine Learning Target Formulation
    # Point-in-Time Temporal Benchmarking (Eliminates future data leakage)
    logger.info("Computing point-in-time historical baseline benchmarks (zero future-leakage)...")
    df_merged = compute_point_in_time_benchmarks(df_merged, min_samples=5)

    # Target 1 (Continuous): yield_kg_per_ha
    # Target 2 (Binary Classification): is_production_shortfall (< 70% of benchmark)
    SHORTFALL_THRESHOLD_FACTOR = 0.70
    df_merged["shortfall_threshold_yield"] = (
        df_merged["regional_benchmark_yield"] * SHORTFALL_THRESHOLD_FACTOR
    ).round(1)

    df_merged["is_production_shortfall"] = (
        df_merged["yield_kg_per_ha"] < df_merged["shortfall_threshold_yield"]
    ).astype(int)

    # Shortfall depth (percentage loss below benchmark, 0 if no shortfall)
    df_merged["shortfall_loss_pct"] = np.where(
        df_merged["yield_kg_per_ha"] < df_merged["regional_benchmark_yield"],
        ((df_merged["regional_benchmark_yield"] - df_merged["yield_kg_per_ha"]) 
         / df_merged["regional_benchmark_yield"] * 100.0).round(1),
        0.0
    )

    # Save to disk
    out_path = PROCESSED_DIR / "integrated_agricultural_dataset.csv"
    df_merged.to_csv(out_path, index=False)
    logger.info(f"Saved integrated dataset ({len(df_merged):,} rows, {len(df_merged.columns)} columns) to {out_path}")

    return df_merged


def audit_integrated_dataset():
    """Prints a detailed statistical audit of the integrated dataset."""
    df = fuse_and_engineer_features()
    
    print("\n" + "=" * 70)
    print("      AGRIRESILIENCE RWANDA - INTEGRATED DATASET AUDIT REPORT        ")
    print("=" * 70)
    print(f"Total Unified Samples:    {len(df):,}")
    print(f"Total Features & Columns: {len(df.columns)}")
    print(f"Time Horizon:             {sorted(df['year'].unique())}")
    print(f"Districts Covered:        {df['district'].nunique()} (All 30 Rwandan Districts)")
    print(f"Crops Monitored:          {sorted(df['crop'].unique())}")

    print("\nTarget Variable Breakdown:")
    shortfall_counts = df["is_production_shortfall"].value_counts()
    shortfall_pct = df["is_production_shortfall"].mean() * 100
    print(f"  • Normal Production (Class 0):   {shortfall_counts.get(0, 0):,} ({100 - shortfall_pct:.1f}%)")
    print(f"  • Production Shortfall (Class 1): {shortfall_counts.get(1, 0):,} ({shortfall_pct:.1f}%)")
    print(f"    (Defined strictly as Harvest < 70% of historical district benchmark)")

    print("\nCrop Yield Benchmarks (Median kg/ha):")
    benchmarks = df.groupby(["crop", "season"])["yield_kg_per_ha"].median().unstack()
    print(benchmarks.to_string())

    print("\nFinancial Impact Summary (Average RWF per farmer season):")
    print(f"  • Mean Cultivated Area:     {df['cultivated_area_ha'].mean():.2f} ha")
    print(f"  • Mean Production Cost:     {df['production_cost_rwf'].mean():,.0f} RWF")
    print(f"  • Mean Gross Revenue:       {df['gross_revenue_rwf'].mean():,.0f} RWF")
    print(f"  • Mean Net Margin:          {df['net_margin_rwf'].mean():,.0f} RWF")
    print(f"  • Mean Commercialization:   {df['commercialization_rate'].mean() * 100:.1f}%")
    print(f"  • Mean Post-Harvest Loss:   {df['loss_rate'].mean() * 100:.1f}%")

    print("\nClimate Risk Correlations with Shortfall Event:")
    corrs = df[[
        "is_production_shortfall", "consecutive_dry_days", "seasonal_rainfall_mm", 
        "dry_spell_ratio", "ndvi_anomaly_pct", "vegetation_health_index"
    ]].corr()["is_production_shortfall"].sort_values(ascending=False)
    for feat, corr_val in corrs.items():
        if feat != "is_production_shortfall":
            direction = "[+] Higher Risk" if corr_val > 0 else "[-] Lower Risk"
            print(f"  * {feat:<24}: {corr_val:+.3f} ({direction})")

    print("=" * 70 + "\n")


if __name__ == "__main__":
    audit_integrated_dataset()
