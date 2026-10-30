// frontend/src/views/RiskMapView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import RwandaMiniMap from '../components/RwandaMiniMap';
import HorizontalComparisonBar from '../components/HorizontalComparisonBar';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import {
  HISTORICAL_CLIMATE_PROFILES,
  SEASONAL_CLIMATE_FORECASTS
} from '../data/climateData';
import {
  Map as MapIcon,
  Layers,
  MapPin,
  ShieldCheck,
  TrendingUp,
  CloudRain,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const PROVINCIAL_SUMMARY = [
  { province: "Northern", districts: 5, meanYield: 3.2, meanRainfall: 890, meanEffectiveRainfall: 592, topCrop: "Irish Potato & Maize", resilienceTier: "High Resilience", color: "text-agri-green" },
  { province: "Western", districts: 7, meanYield: 3.1, meanRainfall: 885, meanEffectiveRainfall: 588, topCrop: "Maize, Tea & Beans", resilienceTier: "High Resilience", color: "text-agri-green" },
  { province: "Southern", districts: 8, meanYield: 2.6, meanRainfall: 820, meanEffectiveRainfall: 535, topCrop: "Cassava, Rice & Beans", resilienceTier: "Moderate Resilience", color: "text-agri-forest" },
  { province: "Eastern", districts: 7, meanYield: 2.7, meanRainfall: 740, meanEffectiveRainfall: 468, topCrop: "Maize, Bananas & Beans", resilienceTier: "Moderate / Drought Sensitive", color: "text-amber-accent" },
  { province: "Kigali City", districts: 3, meanYield: 1.8, meanRainfall: 790, meanEffectiveRainfall: 512, topCrop: "Vegetables & Peri-Urban", resilienceTier: "Moderate Resilience", color: "text-slate-600" },
];

export default function RiskMapView() {
  const [selectedLayer, setSelectedLayer] = useState("production");
  const [selectedDistrict, setSelectedDistrict] = useState("Nyabihu");

  // Lookup active district info and dedicated climate models
  const districtInfo = RWANDA_DISTRICTS.find(d => d.name === selectedDistrict) || RWANDA_DISTRICTS[0];
  const histClimate = HISTORICAL_CLIMATE_PROFILES[selectedDistrict] || HISTORICAL_CLIMATE_PROFILES["Nyabihu"];
  const districtForecast = SEASONAL_CLIMATE_FORECASTS?.districts?.[selectedDistrict] || SEASONAL_CLIMATE_FORECASTS?.districts?.["Nyabihu"];

  // Benchmark comparison items for this district vs national median
  const districtComparisonItems = [
    {
      label: "Crop Yield (t/ha)",
      value: Math.round(((districtInfo.yield || 2.5) / 3.8) * 100),
      formattedValue: `${districtInfo.yield ? districtInfo.yield.toFixed(1) : '–'} t/ha`,
      secondaryValue: "National median: 2.8 t/ha",
      pct: Math.min(100, Math.round(((districtInfo.yield || 2.5) / 4.0) * 100)),
      color: "#3D8C61"
    },
    {
      label: "Historical Climate Stress",
      value: Math.round(histClimate.historical_stress_score),
      formattedValue: `${histClimate.historical_stress_score} / 100`,
      secondaryValue: histClimate.historical_stress_tier,
      pct: Math.round(histClimate.historical_stress_score),
      color: histClimate.historical_stress_score > 55 ? "#D99A32" : "#3D8C61"
    },
    {
      label: "Forecast Climate Risk (2025A)",
      value: Math.round(districtForecast.forecast_climate_risk_score),
      formattedValue: districtForecast.forecast_risk_tier,
      secondaryValue: districtForecast.rainfall_outlook,
      pct: Math.round(districtForecast.forecast_climate_risk_score),
      color: districtForecast.forecast_climate_risk_score >= 60 ? "#D99A32" : "#3D8C61"
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Top Header */}
      <TopBar
        title="Agricultural Risk Map"
        subtitle="Geographic view of agricultural conditions, climate exposure, and verified evidence coverage across Rwanda's 30 districts."
      />

      {/* 2. Layer Control & Institutional Methodology Notice */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-agri-green" />
            <span>Spatial Agricultural &amp; Climate Exposure Atlas</span>
          </h3>
          <p className="text-[12px] text-text-secondary mt-0.5">
            Official ADM2 district boundaries fused with NISR Seasonal Agricultural Surveys, Meteo Rwanda grids, and Sentinel-2 EO
          </p>
        </div>

        {/* Dynamic Layer Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-text-secondary">Spatial Layer:</span>
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="border border-card-border rounded-lg px-3 py-1.5 text-[12.5px] font-bold bg-page-bg text-agri-forest focus:outline-none focus:border-agri-green cursor-pointer"
          >
            <option value="production">Crop Production Volume (Tonnes)</option>
            <option value="yield">Crop Productivity (Yield t/ha)</option>
            <option value="rainfall">Historical Climate Stress (Multi-Indicator)</option>
            <option value="resilience">Forecast Climate Risk (Upcoming Season)</option>
          </select>
        </div>
      </div>

      {/* 3. Main 2-Column GIS Layout */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Interactive Rwanda Map (7 cols) */}
        <div className="col-span-12 xl:col-span-7 bg-white border border-card-border rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-2.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-text-primary">Interactive Spatial View</span>
              <span className="text-[11px] font-medium text-text-muted">&bull; Click any district to inspect</span>
            </div>
            <span className="text-[11px] font-bold text-agri-green bg-agri-green-light px-2.5 py-0.5 rounded-md">
              30 Districts
            </span>
          </div>

          <div className="w-full flex-1 min-h-[380px] flex items-center justify-center">
            <RwandaMiniMap
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(name) => setSelectedDistrict(name)}
              layer={selectedLayer}
              heightClass="h-[380px]"
            />
          </div>

          <div className="pt-2 border-t border-card-border/60 text-[11px] text-text-muted flex justify-between">
            <span>Projection: WGS84 EPSG:4326 projected to Cartesian SVG</span>
            <span className="font-semibold text-agri-forest">Rwanda National Atlas</span>
          </div>
        </div>

        {/* Right Column: Selected District Deep Dive Card (5 cols) */}
        <div className="col-span-12 xl:col-span-5 bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-agri-green" />
              <h3 className="text-[16px] font-extrabold text-sidebar-bg">
                {districtInfo.name} District
              </h3>
            </div>
            <span className="text-[11px] font-bold text-agri-forest bg-agri-green-light px-2.5 py-1 rounded-md">
              {districtInfo.province} Province
            </span>
          </div>

          {/* 4 District Highlight Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border">
              <div className="text-[10.5px] font-semibold text-text-secondary uppercase">Production Output</div>
              <div className="text-[18px] font-extrabold text-sidebar-bg mt-0.5">
                {districtInfo.production ? `${districtInfo.production.toLocaleString()} t` : '– (Data Gap)'}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">Annual staple harvest</div>
            </div>

            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border">
              <div className="text-[10.5px] font-semibold text-text-secondary uppercase">Productivity (Yield)</div>
              <div className="text-[18px] font-extrabold text-agri-green mt-0.5">
                {districtInfo.yield ? `${districtInfo.yield} t/ha` : '–'}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">NISR survey median</div>
            </div>

            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border">
              <div className="text-[10.5px] font-semibold text-text-secondary uppercase">Seasonal Rainfall</div>
              <div className="text-[17px] font-extrabold text-weather-blue mt-0.5">
                {districtInfo.rainfall} mm <span className="text-[11px] font-bold text-blue-700">({districtInfo.effectiveRainfall || Math.round(districtInfo.rainfall * 0.65)} mm eff)</span>
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">Meteo &bull; FAO/AGLW Stage 1</div>
            </div>

            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border">
              <div className="text-[10.5px] font-semibold text-text-secondary uppercase">Resilience Tier</div>
              <div className={`text-[15px] font-bold mt-0.5 ${districtInfo.resilienceTier === 'High Resilience' ? 'text-agri-green' : 'text-amber-accent'
                }`}>
                {districtInfo.resilienceTier}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">Score: {districtInfo.resilienceScore}/100</div>
            </div>
          </div>

          {/* Horizontal Comparison Bar: District vs National Median */}
          <div className="pt-2 border-t border-card-border/70">
            <HorizontalComparisonBar
              title={`${districtInfo.name} vs. National Benchmarks`}
              subtitle="Relative performance across yield, rainfall, and resilience index:"
              items={districtComparisonItems}
              variant="light"
            />
          </div>

          {/* Financial Decision Support Suitability Box */}
          <div className="p-3.5 rounded-xl bg-[#F4F8F6] border border-agri-green/30 space-y-1.5 text-[11.5px]">
            <div className="font-bold text-sidebar-bg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-agri-green" />
              <span>Underwriting Feasibility Assessment:</span>
            </div>
            <div className="text-text-secondary leading-relaxed">
              {districtInfo.province === "Northern" || districtInfo.province === "Western" ? (
                <span>High-potential highland zone with fertile volcanic soil and stable precipitation. Strong suitability for commercial bank input loans with standard DSCR thresholds (&ge; 1.25x).</span>
              ) : districtInfo.province === "Eastern" ? (
                <span>Savannah drought-exposed corridor. Seasonal agricultural loans require mandatory NAIS parametric weather-index insurance enrollment to mitigate dry spell default risk.</span>
              ) : (
                <span>Central/Southern plateau with diversified multi-crop agroforestry. Standard collateral and cooperative delivery contract required for credit approvals.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Provincial Agricultural Resilience Summary Table */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-text-primary">
              Provincial Agricultural Synthesis &amp; Climate Exposure Overview
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Comparative synthesis across Rwanda's 4 provinces and the City of Kigali
            </p>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
            5 Administrative Regions
          </span>
        </div>

        <div className="overflow-x-auto border border-card-border/80 rounded-lg">
          <table className="w-full text-[12px] border-collapse bg-white">
            <thead>
              <tr className="bg-page-bg/80 border-b border-card-border text-text-secondary font-semibold text-left">
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Province</th>
                <th className="py-2.5 px-3 text-center uppercase tracking-wider text-[11px]">Districts</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Mean Yield</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Gross Rain</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Est. Eff Rain</th>
                <th className="py-2.5 px-3 text-left uppercase tracking-wider text-[11px]">Key Commodity Specialization</th>
                <th className="py-2.5 px-3 text-left uppercase tracking-wider text-[11px]">Resilience Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F2]">
              {PROVINCIAL_SUMMARY.map((p, i) => (
                <tr key={i} className="hover:bg-page-bg/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-sidebar-bg">
                    {p.province} Province
                  </td>
                  <td className="py-2.5 px-3 text-center text-text-secondary font-medium">
                    {p.districts}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-agri-forest">
                    {p.meanYield.toFixed(1)} t/ha
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-weather-blue">
                    {p.meanRainfall} mm
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-700">
                    {p.meanEffectiveRainfall} mm
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary font-medium">
                    {p.topCrop}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${p.color}`}>
                      {p.resilienceTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
