import json
import re
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"
RAW_DIR = BASE_DIR / "data" / "raw"

def get_historical_district_season_records():
    df_path = DATA_DIR / "integrated_agricultural_dataset.csv"
    if not df_path.exists():
        return {}
    df = pd.read_csv(df_path)
    records = {}
    for (dist, yr, seas), group in df.groupby(['district', 'year', 'season']):
        season_code = f"{yr}{seas[-1]}"
        if dist not in records:
            records[dist] = {}
        first = group.iloc[0]
        rec = {
            "year": int(yr),
            "season": seas,
            "season_code": season_code,
            "gross_rainfall_mm": round(float(first["seasonal_rainfall_mm"]), 1),
            "effective_rainfall_mm": round(float(first["seasonal_effective_rainfall_mm"]), 1),
            "rainy_days_count": round(float(first["rainy_days_count"]), 1),
            "consecutive_dry_days": round(float(first["consecutive_dry_days"]), 1),
            "extreme_rainfall_days": round(float(first["extreme_rainfall_days"]), 1),
            "avg_temperature_c": round(float(first["avg_temperature_c"]), 1),
            "crops": {}
        }
        for cname, r in group.groupby("crop").first().iterrows():
            is_rice = (cname == "Rice")
            rec["crops"][cname] = {
                "crop": cname,
                "is_available": True,
                "is_suspended": is_rice,
                "suspension_reason": "Survey does not record marshland irrigation; moisture deficit omitted" if is_rice else None,
                "rain_deficit_pct": None if is_rice or pd.isna(r["rain_deficit_pct"]) else round(float(r["rain_deficit_pct"]), 1),
                "moisture_defense": None if is_rice or pd.isna(r["moisture_deficit_defense"]) else round(float(r["moisture_deficit_defense"]), 1),
                "deluge_defense": round(float(r["excess_deluge_defense"]), 1),
                "thermal_defense": round(float(r["thermal_envelope_defense"]), 1),
                "regularity_defense": round(float(r["rainfall_regularity_defense"]), 1),
                "climate_defense_score": round(float(r["climate_defense_score"]), 1)
            }
        records[dist][season_code] = rec
    return records

def get_current_observations():
    precip_csv = RAW_DIR / "nasa_power_monthly_precip.csv"
    if not precip_csv.exists():
        return {}
    df = pd.read_csv(precip_csv)
    # Latest closed month in dataset is 202609
    sep_all = df[df["month"] == 9]
    norm = sep_all[sep_all["year"] < 2026].groupby("district")["monthly_rainfall_mm"].mean().round(1).to_dict()
    latest = sep_all[sep_all["year"] == 2026].set_index("district")["monthly_rainfall_mm"].round(1).to_dict()
    
    dist_map = {}
    for d, val in latest.items():
        hist_norm = norm.get(d, 85.0)
        anom = round(((val - hist_norm) / hist_norm * 100), 1) if hist_norm > 0 else 0.0
        # FAO/AGLW effective rainfall for the month
        if val <= 70.0:
            eff = max(0.0, round(0.6 * val - 10.0, 1))
        else:
            eff = max(0.0, round(0.8 * val - 24.0, 1))
        dist_map[d] = {
            "district": d,
            "latest_monthly_rainfall_mm": val,
            "historical_norm_mm": hist_norm,
            "anomaly_pct": anom,
            "anomaly_category": "Below Climatological Normal" if anom < -15 else ("Above Normal" if anom > 15 else "Near Normal"),
            "estimated_effective_rainfall_mm": eff
        }
    
    return {
        "latest_observation_period": "September 2026",
        "latest_observation_date": "2026-09-30",
        "data_currency_status": "Latest Closed Monthly Telemetry",
        "primary_source": "NASA POWER Agroclimatology (Monthly Global Precipitation Release v2.0)",
        "ground_station_telemetry": "Disconnected / Awaiting Meteo Rwanda live API webhook for October 2026",
        "districts": dist_map
    }

def get_forecast_vs_actual_records():
    sf_path = DATA_DIR / "climate" / "seasonal_forecasts.json"
    cw_path = DATA_DIR / "clean_weather.csv"
    eff_path = DATA_DIR / "district_effective_rainfall.csv"
    int_path = DATA_DIR / "integrated_agricultural_dataset.csv"
    
    if not sf_path.exists() or not cw_path.exists():
        return {}
    
    with open(sf_path, "r", encoding="utf-8") as f:
        fc = json.load(f)
    
    cw = pd.read_csv(cw_path)
    eff = pd.read_csv(eff_path)
    df_int = pd.read_csv(int_path)
    
    cw_25 = cw[(cw["year"] == 2025) & (cw["season"] == "Season A")].set_index("district")
    eff_25 = eff[(eff["year"] == 2025) & (eff["season"] == "Season A")].set_index("district")
    int_25 = df_int[(df_int["year"] == 2025) & (df_int["season"] == "Season A")]
    
    comparisons = {}
    for dist, f_data in fc.get("districts", {}).items():
        if dist in cw_25.index:
            obs_gross = round(float(cw_25.loc[dist, "seasonal_rainfall_mm"]), 1)
            obs_eff = round(float(eff_25.loc[dist, "seasonal_effective_rainfall_mm"]), 1)
            rng_str = f_data.get("expected_rainfall_range_mm", "")
            nums = [float(x.replace(",", "")) for x in re.findall(r"[\d,]+", rng_str)]
            in_range = False
            if len(nums) >= 2:
                in_range = (nums[0] <= obs_gross <= nums[1])
            
            # Post-season realized climate defense scores by crop
            crop_scores = {}
            dist_int = int_25[int_25["district"] == dist]
            for cname, cr in dist_int.groupby("crop").first().iterrows():
                crop_scores[cname] = round(float(cr["climate_defense_score"]), 1)
                
            comparisons[dist] = {
                "district": dist,
                "forecast_season": "Season 2025A",
                "forecast_category": f_data.get("rainfall_outlook"),
                "forecast_range_mm": rng_str,
                "tercile_probabilities": f_data.get("rainfall_terciles"),
                "observed_gross_mm": obs_gross,
                "observed_effective_mm": obs_eff,
                "is_within_forecast_range": in_range,
                "variance_mm": round(obs_gross - (sum(nums[:2])/2 if len(nums)>=2 else obs_gross), 1),
                "post_season_realized_scores": crop_scores,
                "verification_verdict": "Within Forecast Range" if in_range else "Divergent from Interval"
            }
            
    return {
        "verified_seasons": ["2025A"],
        "unarchived_seasons_note": "Original forecast bulletins were not archived for seasons prior to 2025A.",
        "forecast_metadata_2025a": {
            "bulletin_reference": fc.get("bulletin_reference"),
            "issuing_authority": fc.get("forecast_authority"),
            "issue_date": fc.get("forecast_issue_date"),
            "valid_horizon": f"{fc.get('valid_from')} to {fc.get('valid_to')}",
            "methodology": fc.get("forecast_methodology")
        },
        "comparisons_2025a": comparisons
    }

if __name__ == "__main__":
    h = get_historical_district_season_records()
    c = get_current_observations()
    f = get_forecast_vs_actual_records()
    print(f"Historical records: {len(h)} districts")
    print(f"Current observations: {len(c.get('districts', {}))} districts")
    print(f"Forecast comparisons: {len(f.get('comparisons_2025a', {}))} districts")

