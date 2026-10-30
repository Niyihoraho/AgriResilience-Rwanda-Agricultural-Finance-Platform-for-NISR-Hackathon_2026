// frontend/src/components/climate/ForecastVsActualTab.jsx
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  Info, 
  FileText, 
  Calendar,
  Lock,
  Layers,
  Clock
} from 'lucide-react';
import { FORECAST_VS_ACTUAL_RECORDS, CROP_CLIMATE_PROFILES } from '../../data/climateData';

export default function ForecastVsActualTab({ 
  district = "Gasabo", 
  crop = "Maize",
  selectedSeason = "2025A",
  onSelectSeason = () => {}
}) {
  const auditRecords = FORECAST_VS_ACTUAL_RECORDS || {};
  const meta2025a = auditRecords.forecast_metadata_2025a || {};
  const comparisons2025a = auditRecords.comparisons_2025a || {};
  const districtComp = comparisons2025a[district];
  const allComparisons = Object.values(comparisons2025a);

  // Check if selected season is verified in archive
  const isVerified = (selectedSeason === "2025A" || selectedSeason === "Season 2025A");

  return (
    <div className="space-y-4">
      {/* 1. Immutable Archival Standard Banner (Addressing Rule 5 & 6) */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-bg/10 text-sidebar-bg flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-sidebar-bg" />
          </div>
          <div className="space-y-1 text-[12px] leading-relaxed">
            <div className="flex items-center gap-2">
              <strong className="text-text-primary font-bold">
                Immutable Forecast Archive &amp; Verification Protocol
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sidebar-bg/10 text-sidebar-bg">
                Version Locked
              </span>
            </div>
            <p className="text-text-secondary">
              <strong>Core Governance Rule:</strong> Each seasonal forecast is preserved as an immutable snapshot with its original issue date, valid horizon, and predicted values. Post-season realized outcomes are recorded separately to enable objective verification without retroactively modifying original forecast records.
            </p>
          </div>
        </div>
      </div>

      {!isVerified ? (
        /* Honest Empty State for Unarchived Historical Seasons */
        <div className="p-8 bg-white border border-card-border rounded-xl text-center space-y-2">
          <Clock className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-[14px] font-bold text-text-primary">
            No Archived Forecast Snapshot for {selectedSeason}
          </h4>
          <p className="text-[12px] text-text-secondary max-w-md mx-auto">
            {auditRecords.unarchived_seasons_note || "Original forecast bulletins were not archived for seasons prior to 2025A."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectSeason("2025A")}
              className="py-1.5 px-4 bg-sidebar-bg hover:bg-sidebar-hover text-white text-[11.5px] font-bold rounded-lg cursor-pointer transition-all"
            >
              Inspect Verified Season 2025A Audit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Season 2025A Verified Comparison Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Forecast Category vs Realized */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Forecast Category</span>
                <span className="text-[10px] text-sidebar-bg font-bold">2025A</span>
              </div>
              <div className="text-[15px] font-extrabold text-sidebar-bg mt-1 tracking-tight leading-snug">
                {districtComp?.forecast_category || "Near Normal"}
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Issued: {meta2025a.issue_date || "2024-09-05"} &bull; Meteo Rwanda
              </div>
            </div>

            {/* Metric 2: Forecast Range vs Observed Total */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Precipitation Comparison</span>
                <span className="text-[10px] text-weather-blue font-bold">Range vs Actual</span>
              </div>
              <div className="text-[15px] font-extrabold text-weather-blue mt-1 tracking-tight">
                {districtComp ? `${districtComp.observed_gross_mm} mm` : "–"} <span className="text-[11.5px] font-normal text-text-secondary">observed</span>
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Forecast Range: <strong>{districtComp?.forecast_range_mm}</strong>
              </div>
            </div>

            {/* Metric 3: Interval Verification Verdict */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Verification Verdict</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  districtComp?.is_within_forecast_range ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                }`}>
                  {districtComp?.is_within_forecast_range ? "Aligned" : "Divergent"}
                </span>
              </div>
              <div className="text-[15px] font-extrabold mt-1 tracking-tight text-text-primary">
                {districtComp?.verification_verdict || "Evaluated"}
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Variance from midpoint: <strong>{districtComp ? `${districtComp.variance_mm} mm` : "–"}</strong>
              </div>
            </div>

            {/* Metric 4: Realized Post-Season Climate Score */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Realized Climate Score</span>
                <span className="text-[10px] text-agri-green font-bold">{crop}</span>
              </div>
              <div className="text-[20px] font-extrabold text-agri-green mt-1 tracking-tight">
                {districtComp?.post_season_realized_scores?.[crop] !== undefined
                  ? `${districtComp.post_season_realized_scores[crop]} / 100`
                  : "Not surveyed"}
              </div>
              <div className="text-[10px] text-text-muted mt-1">
                Calculated after season completion
              </div>
            </div>
          </div>

          {/* 3. National 30-District Forecast Verification Table (Season 2025A) */}
          <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-card-border/60 pb-2.5">
              <div>
                <h4 className="text-[14px] font-bold text-text-primary">
                  National Forecast Performance &amp; Realization Ledger (Season 2025A)
                </h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Comparison between pre-season Meteo Rwanda forecast bulletin ({meta2025a.bulletin_reference}) and realized NASA POWER totals
                </p>
              </div>
              <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2 py-0.5 rounded">
                30 Verified Districts
              </span>
            </div>

            <div className="overflow-x-auto border border-card-border/80 rounded-lg max-h-[320px]">
              <table className="w-full text-[12px] border-collapse bg-white">
                <thead className="sticky top-0 bg-page-bg/95 backdrop-blur-xs border-b border-card-border">
                  <tr className="text-text-secondary font-semibold text-left">
                    <th className="py-2 px-3 uppercase tracking-wider text-[11px]">District</th>
                    <th className="py-2 px-3 text-left uppercase tracking-wider text-[11px]">Forecast Category</th>
                    <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Forecast Range</th>
                    <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Realized Gross</th>
                    <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Realized Eff</th>
                    <th className="py-2 px-3 text-center uppercase tracking-wider text-[11px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F4F2]">
                  {allComparisons.map((c) => (
                    <tr 
                      key={c.district}
                      className={`hover:bg-page-bg/50 transition-colors ${
                        c.district === district ? "bg-emerald-50/60 font-semibold" : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-text-primary flex items-center gap-1.5">
                        {c.district === district && <CheckCircle2 className="w-3.5 h-3.5 text-agri-green" />}
                        <span>{c.district}</span>
                      </td>
                      <td className="py-2 px-3 text-text-secondary">
                        {c.forecast_category}
                      </td>
                      <td className="py-2 px-3 text-right text-text-muted font-mono">
                        {c.forecast_range_mm}
                      </td>
                      <td className="py-2 px-3 text-right text-weather-blue font-bold font-mono">
                        {c.observed_gross_mm} mm
                      </td>
                      <td className="py-2 px-3 text-right text-blue-700 font-bold font-mono">
                        {c.observed_effective_mm} mm
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          c.is_within_forecast_range 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {c.is_within_forecast_range ? "Within Range" : "Divergent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 4. Methodological Verification Note */}
      <div className="p-3 rounded-xl bg-page-bg border border-card-border text-[11px] text-text-secondary flex items-start gap-2">
        <Info className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-primary">Verification Caveat:</strong> A single season comparison does not establish statistical forecast skill or model precision. Forecast validation requires longitudinal tracking across multiple independent agricultural cycles to assess systematic bias and reliability.
        </div>
      </div>
    </div>
  );
}

