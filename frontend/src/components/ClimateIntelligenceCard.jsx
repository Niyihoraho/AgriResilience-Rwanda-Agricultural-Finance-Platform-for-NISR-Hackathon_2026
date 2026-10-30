// frontend/src/components/ClimateIntelligenceCard.jsx
import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Wind,
  Droplets,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  HISTORICAL_CLIMATE_PROFILES,
  SEASONAL_CLIMATE_FORECASTS,
  CROP_CLIMATE_PROFILES
} from '../data/climateData';

export default function ClimateIntelligenceCard({
  district = "Nyabihu",
  crop = "Maize",
  selectedSeason = "2025A"
}) {
  const [activeTab, setActiveTab] = useState("historical"); // "historical" or "forecast"
  const [historySeasonView, setHistorySeasonView] = useState("season_a"); // "season_a" (regular) or "season_b" (front-heavy + dry tail)

  // Lookup data models
  const histProfile = HISTORICAL_CLIMATE_PROFILES[district] || HISTORICAL_CLIMATE_PROFILES["Nyabihu"];
  const forecastModel = SEASONAL_CLIMATE_FORECASTS;
  const districtForecast = forecastModel?.districts?.[district] || forecastModel?.districts?.["Nyabihu"];
  const cropProfile = CROP_CLIMATE_PROFILES[crop] || CROP_CLIMATE_PROFILES["Maize"];

  const activeSeasonData = historySeasonView === "season_a" ? histProfile.season_a : histProfile.season_b;

  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
      {/* 1. Header with Mode Selector (Historical vs Forecast) */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-card-border/70 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-weather-blue-light text-weather-blue flex items-center justify-center">
              <CloudRain className="w-4 h-4 text-weather-blue" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-bold text-text-primary tracking-tight">
                Climate Intelligence — {district} District
              </h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Two separate assessments: Historical multi-season climate stress vs. upcoming season forecast
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle: Historical Stress vs Forecast Risk */}
        <div className="flex items-center bg-page-bg p-1 rounded-lg border border-card-border">
          <button
            type="button"
            onClick={() => setActiveTab("historical")}
            className={`px-3 py-1.5 rounded-md text-[11.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "historical"
                ? "bg-white text-sidebar-bg shadow-xs border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-agri-green" />
            <span>Historical Climate Stress</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("forecast")}
            className={`px-3 py-1.5 rounded-md text-[11.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "forecast"
                ? "bg-white text-weather-blue shadow-xs border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-weather-blue" />
            <span>Forecast Climate Risk ({selectedSeason})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PERSPECTIVE A: HISTORICAL CLIMATE STRESS                 */}
      {/* ========================================================= */}
      {activeTab === "historical" && (
        <div className="space-y-4">
          {/* Top Metadata Bar & Provenance */}
          <div className="flex flex-wrap items-center justify-between text-[11px] bg-page-bg/70 p-2.5 rounded-lg border border-card-border gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">Source:</span>
              <span className="text-text-secondary">{histProfile.data_source}</span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-text-secondary">{histProfile.historical_period}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-agri-green font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {histProfile.data_coverage_status}
              </span>
            </div>
          </div>

          {/* Core Historical Score & Multi-Dimensional Indicators */}
          <div className="grid grid-cols-12 gap-4 items-stretch">
            {/* Left Score Tile: Multi-Dimensional Historical Climate Stress */}
            <div className="col-span-12 md:col-span-4 bg-[#F8FAF9] p-4 rounded-xl border border-card-border flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  Historical Climate Stress
                </div>
                <div className="text-[28px] font-extrabold text-sidebar-bg mt-0.5 tracking-tight flex items-baseline gap-2">
                  <span>{histProfile.historical_stress_score}</span>
                  <span className="text-[14px] text-text-muted font-normal">/ 100</span>
                </div>
                <div className="mt-1">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${histProfile.tier_badge}`}>
                    {histProfile.historical_stress_tier}
                  </span>
                </div>
                <p className="text-[10.5px] text-text-secondary mt-2.5 leading-snug">
                  Composite exposure index evaluated across moisture deficit, heavy deluge erosion, thermal limits, and rainfall regularity.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-card-border/70 text-[11px] space-y-1">
                <div className="flex justify-between text-text-secondary">
                  <span>Annual Mean Rainfall:</span>
                  <strong className="text-text-primary">{histProfile.annual_rainfall_mm} mm</strong>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Elevation Zone:</span>
                  <strong className="text-text-primary">Highland Pluvial</strong>
                </div>
              </div>
            </div>

            {/* Right: Rwandan Seasonal Pattern Selector (Season A vs Season B) */}
            <div className="col-span-12 md:col-span-8 bg-white border border-card-border rounded-xl p-4 space-y-3">
              {/* Season A vs Season B Switcher */}
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-card-border/70 gap-2">
                <span className="text-[12px] font-bold text-text-primary flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-agri-green" />
                  <span>Rwandan Agricultural Seasonal Dynamics:</span>
                </span>
                <div className="flex gap-1.5 bg-page-bg p-0.5 rounded-lg border border-card-border">
                  <button
                    type="button"
                    onClick={() => setHistorySeasonView("season_a")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      historySeasonView === "season_a"
                        ? "bg-sidebar-bg text-white shadow-xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Season A (Regular Rain)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistorySeasonView("season_b")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      historySeasonView === "season_b"
                        ? "bg-sidebar-bg text-white shadow-xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Season B (Heavy Rain + Dry Tail)
                  </button>
                </div>
              </div>

              {/* Seasonal Pattern Description */}
              <div className="p-2.5 rounded-lg bg-page-bg/80 border border-card-border text-[11px] leading-snug flex items-start gap-2">
                <Droplets className="w-4 h-4 text-weather-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary">{activeSeasonData.season_name}:</strong>{" "}
                  <span className="text-text-secondary">{activeSeasonData.rainfall_pattern}.</span>
                </div>
              </div>

              {/* 4 Quantitative Seasonal Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg bg-page-bg/60 border border-card-border">
                  <div className="text-[10px] text-text-secondary font-medium">Seasonal Rainfall</div>
                  <div className="text-[15px] font-extrabold text-weather-blue mt-0.5">
                    {activeSeasonData.mean_rainfall_mm} <span className="text-[10px] font-normal text-text-secondary">mm</span>
                  </div>
                  <div className="text-[9.5px] text-text-muted mt-0.5">{activeSeasonData.rainy_days_count} rainy days</div>
                </div>

                <div className="p-2.5 rounded-lg bg-page-bg/60 border border-card-border">
                  <div className="text-[10px] text-text-secondary font-medium">Max Dry Spell</div>
                  <div className="text-[15px] font-extrabold text-amber-accent mt-0.5">
                    {activeSeasonData.consecutive_dry_days} <span className="text-[10px] font-normal text-text-secondary">days</span>
                  </div>
                  <div className="text-[9.5px] text-text-muted mt-0.5">consecutive max</div>
                </div>

                <div className="p-2.5 rounded-lg bg-page-bg/60 border border-card-border">
                  <div className="text-[10px] text-text-secondary font-medium">Heavy Rain Days</div>
                  <div className="text-[15px] font-extrabold text-sidebar-bg mt-0.5">
                    {activeSeasonData.extreme_rainfall_days} <span className="text-[10px] font-normal text-text-secondary">days</span>
                  </div>
                  <div className="text-[9.5px] text-text-muted mt-0.5">&gt; 30mm deluge events</div>
                </div>

                <div className="p-2.5 rounded-lg bg-page-bg/60 border border-card-border">
                  <div className="text-[10px] text-text-secondary font-medium">Thermal Range</div>
                  <div className="text-[15px] font-extrabold text-text-primary mt-0.5">
                    {activeSeasonData.mean_temp_c}°C
                  </div>
                  <div className="text-[9.5px] text-text-muted mt-0.5">Min: {activeSeasonData.min_temp_c}°C | Max: {activeSeasonData.max_temp_c}°C</div>
                </div>
              </div>

              {/* Seasonal Risk Callout */}
              <div className="text-[11px] text-text-secondary pt-1 flex items-center justify-between border-t border-card-border/60">
                <span className="font-semibold text-text-primary">Observed Agronomic Risk:</span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10.5px] font-medium border border-amber-200">
                  {activeSeasonData.primary_risk}
                </span>
              </div>
            </div>
          </div>

          {/* Crop-Specific Sensitivity & Data Gaps */}
          <div className="grid grid-cols-12 gap-4">
            {/* Crop Sensitivity Context */}
            <div className="col-span-12 md:col-span-8 p-3 rounded-xl bg-page-bg/70 border border-card-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-text-primary flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-agri-green" />
                  <span>Crop Phenological Sensitivity — {crop}</span>
                </span>
                <span className="text-[10.5px] font-semibold text-agri-forest bg-agri-green-light px-2 py-0.5 rounded">
                  Critical: {cropProfile.critical_growth_stage}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {historySeasonView === "season_a" ? cropProfile.season_a_behavior : cropProfile.season_b_behavior}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[10.5px] pt-1 text-text-muted border-t border-card-border/60">
                <span>Water Requirement: <strong>{cropProfile.min_seasonal_water_mm}–{cropProfile.optimal_water_range_mm[1]} mm</strong></span>
                <span>&bull;</span>
                <span>Optimal Temp: <strong>{cropProfile.temp_optimal_range_c[0]}–{cropProfile.temp_optimal_range_c[1]}°C</strong></span>
                <span>&bull;</span>
                <span>Cold Threshold: <strong>&lt; {cropProfile.cold_stress_threshold_c}°C</strong></span>
              </div>
            </div>

            {/* Unmonitored Indicators & Technical Transparency */}
            <div className="col-span-12 md:col-span-4 p-3 rounded-xl bg-page-bg/70 border border-card-border space-y-1.5">
              <div className="text-[11.5px] font-bold text-text-primary flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-accent" />
                <span>Data Completeness Log</span>
              </div>
              <div className="space-y-1 text-[10.5px] text-text-secondary">
                {crop === "Rice" && (
                  <div className="flex justify-between text-amber-800 font-semibold bg-amber-50 p-1 rounded border border-amber-200">
                    <span>Rice Irrigation:</span>
                    <span>Suspended — Unrecorded</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Soil Moisture:</span>
                  <span className="text-text-muted italic">Sensor unavailable (VHI proxy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind / Gust Events:</span>
                  <span className="text-text-muted italic">Observation unavailable</span>
                </div>
                <div className="flex justify-between">
                  <span>Relative Humidity:</span>
                  <span className="text-text-muted italic">Not in baseline CSV</span>
                </div>
              </div>
              <div className="text-[9.5px] text-text-muted pt-1 border-t border-card-border/60">
                {crop === "Rice"
                  ? "Rice moisture defense is suspended due to unrecorded irrigation; score uses 3 active components."
                  : "Unmonitored indicators are excluded from scoring denominators to avoid false-zero bias."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PERSPECTIVE B: FORECAST CLIMATE RISK (UPCOMING SEASON)   */}
      {/* ========================================================= */}
      {activeTab === "forecast" && (
        <div className="space-y-4">
          {/* Top Metadata Bar & Official Outlook Authority */}
          <div className="flex flex-wrap items-center justify-between text-[11px] bg-weather-blue-light/50 p-2.5 rounded-lg border border-weather-blue/30 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-weather-blue">Authority:</span>
              <span className="text-text-primary font-semibold">{forecastModel.forecast_authority}</span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-text-secondary">Issued: {forecastModel.forecast_issue_date}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <span>Valid: <strong>{forecastModel.valid_from} to {forecastModel.valid_to}</strong></span>
              <span className="text-text-muted">&bull;</span>
              <span className="font-semibold text-weather-blue">{districtForecast.confidence_level}</span>
            </div>
          </div>

          {/* Probabilistic Rainfall Tercile Gauge & Hazard Outlook */}
          <div className="grid grid-cols-12 gap-4 items-stretch">
            {/* Left: Probabilistic Rainfall Forecast Terciles */}
            <div className="col-span-12 md:col-span-6 bg-white border border-card-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-card-border/70">
                <h4 className="text-[12.5px] font-bold text-text-primary flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-weather-blue" />
                  <span>Seasonal Precipitation Outlook ({selectedSeason})</span>
                </h4>
                <span className="text-[10.5px] font-bold text-weather-blue bg-weather-blue-light px-2 py-0.5 rounded">
                  {districtForecast.rainfall_outlook}
                </span>
              </div>

              {/* Tercile Probabilities (Above Normal, Normal, Below Normal) */}
              <div className="space-y-2">
                <div className="text-[11px] text-text-secondary flex justify-between font-medium">
                  <span>Probabilistic Forecast Distribution:</span>
                  <span className="text-text-muted">Consensus Terciles</span>
                </div>

                <div className="w-full h-4 rounded-full overflow-hidden flex bg-page-bg border border-card-border">
                  <div
                    style={{ width: `${districtForecast.rainfall_terciles.above_normal_pct}%` }}
                    className="bg-[#3D8C61] flex items-center justify-center text-[9px] font-bold text-white transition-all"
                    title={`Above Normal: ${districtForecast.rainfall_terciles.above_normal_pct}%`}
                  >
                    {districtForecast.rainfall_terciles.above_normal_pct}%
                  </div>
                  <div
                    style={{ width: `${districtForecast.rainfall_terciles.normal_pct}%` }}
                    className="bg-[#4D7EA8] flex items-center justify-center text-[9px] font-bold text-white transition-all"
                    title={`Near Normal: ${districtForecast.rainfall_terciles.normal_pct}%`}
                  >
                    {districtForecast.rainfall_terciles.normal_pct}%
                  </div>
                  <div
                    style={{ width: `${districtForecast.rainfall_terciles.below_normal_pct}%` }}
                    className="bg-[#D99A32] flex items-center justify-center text-[9px] font-bold text-white transition-all"
                    title={`Below Normal: ${districtForecast.rainfall_terciles.below_normal_pct}%`}
                  >
                    {districtForecast.rainfall_terciles.below_normal_pct}%
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-text-muted font-medium pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3D8C61]"></span> Above Normal ({districtForecast.rainfall_terciles.above_normal_pct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#4D7EA8]"></span> Near Normal ({districtForecast.rainfall_terciles.normal_pct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D99A32]"></span> Below Normal ({districtForecast.rainfall_terciles.below_normal_pct}%)
                  </span>
                </div>
              </div>

              {/* Quantitative Projected Bounds */}
              <div className="p-2.5 rounded-lg bg-page-bg border border-card-border flex items-center justify-between text-[11.5px]">
                <span className="text-text-secondary">Expected Seasonal Range:</span>
                <strong className="text-sidebar-bg font-extrabold text-[13.5px] font-mono">
                  {districtForecast.expected_rainfall_range_mm}
                </strong>
              </div>
            </div>

            {/* Right: Anticipated Hazards & Extreme Weather */}
            <div className="col-span-12 md:col-span-6 bg-white border border-card-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-card-border/70">
                <h4 className="text-[12.5px] font-bold text-text-primary flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-accent" />
                  <span>Anticipated Climate Hazards</span>
                </h4>
                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                  districtForecast.forecast_climate_risk_score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-agri-green-light text-agri-forest'
                }`}>
                  {districtForecast.forecast_risk_tier}
                </span>
              </div>

              <div className="space-y-2 text-[11.5px]">
                <div className="flex justify-between items-center p-2 rounded-lg bg-page-bg border border-card-border">
                  <span className="text-text-secondary">Drought / Dry Spell Risk:</span>
                  <span className="font-bold text-agri-forest">{districtForecast.drought_risk}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-page-bg border border-card-border">
                  <span className="text-text-secondary">Heavy Rainfall &amp; Erosion Hazard:</span>
                  <span className="font-bold text-amber-accent">{districtForecast.heavy_rainfall_risk}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-page-bg border border-card-border">
                  <span className="text-text-secondary">Temperature Anomaly Outlook:</span>
                  <span className="font-semibold text-text-primary">{districtForecast.temperature_outlook}</span>
                </div>
              </div>

              {/* Agronomic Advisory */}
              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[10.5px] text-emerald-950 leading-snug">
                <strong>Agronomic Advisory:</strong> {districtForecast.recommended_agronomic_action}
              </div>
            </div>
          </div>

          {/* Unmonitored Forecast Indicators (Required: Explicitly mark Forecast unavailable) */}
          <div className="p-3 rounded-xl bg-page-bg/80 border border-card-border flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">Unmonitored Variables:</span>
              <span className="text-text-secondary">Soil Moisture: <span className="text-text-muted italic font-medium">Forecast unavailable</span></span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-text-secondary">Wind Speed: <span className="text-text-muted italic font-medium">Forecast unavailable</span></span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-text-secondary">Evapotranspiration: <span className="text-text-muted italic font-medium">Forecast unavailable</span></span>
            </div>
            <span className="text-[10px] text-text-muted italic">
              Historical averages are never substituted into forecast fields.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

