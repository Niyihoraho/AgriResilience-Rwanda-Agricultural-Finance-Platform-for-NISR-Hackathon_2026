// frontend/src/components/climate/CurrentClimateTab.jsx
import React from 'react';
import { 
  CloudRain, 
  Satellite, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calendar, 
  Clock, 
  Activity,
  Radio
} from 'lucide-react';
import { CURRENT_CLIMATE_OBSERVATIONS } from '../../data/climateData';

export default function CurrentClimateTab({ district = "Gasabo" }) {
  const currentObs = CURRENT_CLIMATE_OBSERVATIONS || {};
  const districtData = currentObs.districts?.[district];
  const allDistricts = Object.values(currentObs.districts || {});

  return (
    <div className="space-y-4">
      {/* 1. Honest Currency & Telemetry Status Banner (Strictly Addressing Corrections A & E) */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-weather-blue-light text-weather-blue flex items-center justify-center shrink-0 mt-0.5">
            <Radio className="w-4 h-4 text-weather-blue" />
          </div>
          <div className="space-y-1 text-[12px] leading-relaxed">
            <div className="flex items-center gap-2">
              <strong className="text-text-primary font-bold">
                Data Currency &amp; Telemetry Lineage
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {currentObs.data_currency_status || "Latest Verified Telemetry"}
              </span>
            </div>
            <p className="text-text-secondary">
              <strong>Observation Period:</strong> {currentObs.latest_observation_period || "September 2026"} (Closed month) &bull; 
              <strong> Source:</strong> {currentObs.primary_source || "NASA POWER Agroclimatology (Monthly API v2.0)"}.
            </p>
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong>In-Situ Ground Sensor Status:</strong> Live daily automated weather station (AWS) telemetry is currently disconnected pending Meteo Rwanda API integration for October 2026. Displaying the latest closed monthly satellite reanalysis.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. District Latest Condition Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Latest Monthly Rainfall */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
            <span>Latest Month Rain</span>
            <span className="text-[10px] text-weather-blue font-bold">Sep 2026</span>
          </div>
          <div className="text-[26px] font-extrabold text-sidebar-bg mt-1 tracking-tight">
            {districtData ? `${districtData.latest_monthly_rainfall_mm}` : "–"} <span className="text-[13px] font-normal text-text-secondary">mm</span>
          </div>
          <div className="text-[10px] text-text-muted mt-1">
            Est. Effective: <strong>{districtData ? `${districtData.estimated_effective_rainfall_mm} mm` : "–"}</strong> (FAO/AGLW)
          </div>
        </div>

        {/* Metric 2: Historical September Norm */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
            <span>Historical Sep Norm</span>
            <span className="text-[10px] text-text-muted font-bold">2020–2025</span>
          </div>
          <div className="text-[26px] font-extrabold text-text-primary mt-1 tracking-tight">
            {districtData ? `${districtData.historical_norm_mm}` : "–"} <span className="text-[13px] font-normal text-text-secondary">mm</span>
          </div>
          <div className="text-[10px] text-text-muted mt-1">
            6-year climatological September average
          </div>
        </div>

        {/* Metric 3: Precipitation Anomaly */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
            <span>Monthly Anomaly</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              districtData?.anomaly_pct < -20 ? "bg-amber-100 text-amber-800" : "bg-agri-green-light text-agri-forest"
            }`}>
              {districtData?.anomaly_category || "Normal"}
            </span>
          </div>
          <div className={`text-[26px] font-extrabold mt-1 tracking-tight ${
            districtData?.anomaly_pct < 0 ? "text-amber-accent" : "text-agri-green"
          }`}>
            {districtData ? `${districtData.anomaly_pct >= 0 ? `+${districtData.anomaly_pct}` : districtData.anomaly_pct}%` : "–"}
          </div>
          <div className="text-[10px] text-text-muted mt-1">
            Relative to district long-term September baseline
          </div>
        </div>

        {/* Metric 4: Verified Currency Timestamp */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
            <span>Observation Date</span>
            <span className="text-[10px] text-agri-green font-bold">Closed</span>
          </div>
          <div className="text-[18px] font-extrabold text-sidebar-bg mt-1 tracking-tight">
            {currentObs.latest_observation_date || "2026-09-30"}
          </div>
          <div className="text-[10px] text-text-muted mt-1">
            Next observation closed at month-end
          </div>
        </div>
      </div>

      {/* 3. National Synthesis Table of Latest Verified Observations */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-card-border/60 pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-text-primary">
              National District Precipitation Telemetry ({currentObs.latest_observation_period || "September 2026"})
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Verified monthly satellite reanalysis across all 30 districts of Rwanda (NASA POWER v2.0)
            </p>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2 py-0.5 rounded">
            30 Districts Reported
          </span>
        </div>

        <div className="overflow-x-auto border border-card-border/80 rounded-lg max-h-[300px]">
          <table className="w-full text-[12px] border-collapse bg-white">
            <thead className="sticky top-0 bg-page-bg/95 backdrop-blur-xs border-b border-card-border">
              <tr className="text-text-secondary font-semibold text-left">
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">District</th>
                <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Gross Rain (mm)</th>
                <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Est. Eff Rain (mm)</th>
                <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Hist. Norm (mm)</th>
                <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Anomaly (%)</th>
                <th className="py-2 px-3 text-left uppercase tracking-wider text-[11px]">Anomaly Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F2]">
              {allDistricts.map((d) => (
                <tr 
                  key={d.district} 
                  className={`hover:bg-page-bg/50 transition-colors ${
                    d.district === district ? "bg-emerald-50/60 font-semibold" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-text-primary flex items-center gap-1.5">
                    {d.district === district && <CheckCircle2 className="w-3.5 h-3.5 text-agri-green" />}
                    <span>{d.district}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-weather-blue font-medium">
                    {d.latest_monthly_rainfall_mm} mm
                  </td>
                  <td className="py-2 px-3 text-right text-blue-700 font-bold">
                    {d.estimated_effective_rainfall_mm} mm
                  </td>
                  <td className="py-2 px-3 text-right text-text-muted">
                    {d.historical_norm_mm} mm
                  </td>
                  <td className={`py-2 px-3 text-right font-bold ${
                    d.anomaly_pct < 0 ? "text-amber-accent" : "text-agri-green"
                  }`}>
                    {d.anomaly_pct >= 0 ? `+${d.anomaly_pct}` : d.anomaly_pct}%
                  </td>
                  <td className="py-2 px-3 text-left">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      d.anomaly_pct < -20 
                        ? "bg-amber-100 text-amber-900" 
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {d.anomaly_category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

