// frontend/src/components/climate/ClimateMethodologyDrawer.jsx
import React from 'react';
import { Info, X, ShieldAlert, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export default function ClimateMethodologyDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-card-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-card-border bg-page-bg/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-agri-green" />
            <h3 className="text-[15px] font-bold text-text-primary">
              Climate Intelligence Calculation Methodology &amp; Governance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-[14px] font-bold p-1 rounded-md cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[12px] leading-relaxed text-text-secondary">
          {/* Section 1: Provenance & Attribution */}
          <div className="p-3 rounded-xl bg-page-bg border border-card-border space-y-1.5">
            <h4 className="font-bold text-text-primary text-[12.5px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agri-green" />
              <span>1. Data Provenance &amp; Multi-Pillar Attribution</span>
            </h4>
            <p>
              AgriResilience strictly attributes each meteorological and agronomic indicator to its verified source:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-text-secondary">
              <li>
                <strong>Historical Precipitation &amp; Temperatures:</strong> NASA POWER Agroclimatology (PRECTOTCORR daily global reanalysis calibrated to NISR 5-month operational windows).
              </li>
              <li>
                <strong>Farm Records &amp; Local Yields:</strong> National Institute of Statistics of Rwanda (NISR) Seasonal Agricultural Surveys (2020–2024 microdata).
              </li>
              <li>
                <strong>Official Seasonal Forecasts:</strong> Rwanda Meteorology Agency (Meteo Rwanda) official agrometeorological outlook bulletins (e.g. Ref: MR/AGRO/2024/09).
              </li>
            </ul>
          </div>

          {/* Section 2: Stage 1 Effective Rainfall */}
          <div className="p-3 rounded-xl bg-page-bg border border-card-border space-y-1.5">
            <h4 className="font-bold text-text-primary text-[12.5px] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-agri-green" />
              <span>2. Stage 1 Estimated Effective Rainfall (FAO/AGLW)</span>
            </h4>
            <p>
              Calibrated 5-month seasonal rainfall totals (Season A: Sep–Jan; Season B: Feb–Jun) are disaggregated into monthly estimates using year-specific NASA POWER proportions (exact centesimal sum preservation). Monthly estimated effective rainfall is computed via the FAO/AGLW piecewise empirical regression:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-card-border font-mono text-[11px] text-sidebar-bg">
              If P_month &le; 70 mm: P_eff = max(0, 0.6 &times; P_month - 10)<br />
              If P_month &gt; 70 mm: P_eff = 0.8 &times; P_month - 24
            </div>
            <p className="text-[11px] text-text-muted">
              Note: The difference between gross and effective rainfall is an empirical mathematical deduction, not a physical sensor measurement of runoff or evaporation.
            </p>
          </div>

          {/* Section 3: Crop Water Demand (ETc) Constants */}
          <div className="p-3 rounded-xl bg-page-bg border border-card-border space-y-1.5">
            <h4 className="font-bold text-text-primary text-[12.5px]">
              3. Approved Stage 1 Crop Water Demand (FAO-56 ETc)
            </h4>
            <p>
              Seasonal water deficits are evaluated against approved crop-specific evapotranspiration baselines:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Maize (Zea mays):</strong> 520 mm
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Climbing Beans (Phaseolus v.):</strong> 380 mm
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Irish Potato (Solanum tub.):</strong> 440 mm
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Cassava (Manihot esculenta):</strong> 450 mm
              </div>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] mt-1">
              <strong>Paddy Rice (Oryza sativa — 950 mm):</strong> Moisture deficit scoring is suspended (<code className="bg-white px-1 py-0.2 rounded font-mono">NaN</code>) because NISR surveys do not record whether plots are irrigated marshlands. Climate Defense is re-normalized across Deluge (35.7%), Thermal (35.7%), and Regularity (28.6%).
            </div>
          </div>

          {/* Section 4: Component Weights */}
          <div className="p-3 rounded-xl bg-page-bg border border-card-border space-y-1.5">
            <h4 className="font-bold text-text-primary text-[12.5px]">
              4. Biophysical Defense Scoring Weights
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Moisture Adequacy:</strong> 30% weight
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Excess Deluge Defense:</strong> 25% weight
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Thermal Envelope Defense:</strong> 25% weight
              </div>
              <div className="p-2 bg-white rounded border border-card-border">
                <strong>Rainfall Regularity:</strong> 20% weight
              </div>
            </div>
          </div>

          {/* Section 5: Underwriting Disclaimers */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Underwriting &amp; Regulatory Standard Notice:</span>
            </div>
            <p>
              Climate indicators and weather anomalies are underwriting screening metrics to support loan officer and insurance decision-making. They are not direct probabilities of individual crop failure and do not represent guaranteed forecasts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-card-border bg-white flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-sidebar-bg hover:bg-sidebar-hover text-white text-[12px] font-bold rounded-lg cursor-pointer transition-all"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
}

