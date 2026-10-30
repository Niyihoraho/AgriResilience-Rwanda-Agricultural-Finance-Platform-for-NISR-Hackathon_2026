// frontend/src/views/InsuranceView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Satellite, 
  CloudRain, 
  Sun, 
  Sliders, 
  FileText, 
  DollarSign,
  Info,
  Layers
} from 'lucide-react';

export default function InsuranceView({ caseBData }) {
  // Pull from Case B shared state if available, or use defaults
  const district = caseBData?.district || "Kayonza";
  const crop = caseBData?.crop || "Maize";
  const season = caseBData?.season || "2025A";
  const farmerName = caseBData?.farmerName || "Kayonza Maize Producers Cooperative (Plot 14B)";
  const area = caseBData?.area || 45.0;
  const dryDays = caseBData?.dryDays !== undefined ? caseBData.dryDays : 19;
  const inSeasonRevisedYieldKg = caseBData?.inSeasonRevisedYieldKg || 2250;

  // Lookup district baseline
  const activeDistrict = RWANDA_DISTRICTS.find(d => d.name === district) || RWANDA_DISTRICTS[0];

  // Insurance Policy Parameters
  const [sumInsuredPerHa, setSumInsuredPerHa] = useState(650000); // RWF/ha
  const [premiumRatePct, setPremiumRatePct] = useState(7.5); // % p.a.
  const [claimStatus, setClaimStatus] = useState(
    dryDays >= 18 
      ? "Trigger Breached — Ground Surveyor Dispatched" 
      : dryDays >= 14 
        ? "Active Watchlist — Climate Deficit Flagged" 
        : "Normal Coverage (No Anomaly)"
  );
  const [underwriterNotes, setUnderwriterNotes] = useState(
    `Sentinel-2 MSI observation confirms localized canopy greenness deficit during flowering stage in ${district}. Ground station registers ${dryDays} consecutive dry days breaching the 18-day NAIS parametric trigger. MINAGRI / SONARWA loss adjuster dispatched to verify soil moisture deficit.`
  );

  // Policy Valuations
  const totalSumInsured = Math.round(sumInsuredPerHa * area);
  const grossPremium = Math.round(totalSumInsured * (premiumRatePct / 100));
  const goRSubsidyAmount = Math.round(grossPremium * 0.50); // 50% GoR NAIS subsidy
  const farmerPayablePremium = Math.round(grossPremium * 0.50); // 50% farmer share

  // Parametric Payout Formula based on consecutive dry days
  let payoutRatePct = 0;
  let triggerSeverity = "Normal Coverage";
  let triggerBadgeColor = "bg-agri-green-light text-agri-forest";

  if (dryDays >= 22) {
    payoutRatePct = 60;
    triggerSeverity = "Catastrophic Drought Trigger (60% Indemnity)";
    triggerBadgeColor = "bg-red-100 text-red-800";
  } else if (dryDays >= 18) {
    payoutRatePct = 35;
    triggerSeverity = "Parametric Drought Trigger Breached (35% Indemnity)";
    triggerBadgeColor = "bg-red-100 text-red-800";
  } else if (dryDays >= 14) {
    payoutRatePct = 0;
    triggerSeverity = "Monitoring Watchlist (Dry Spell Approaching Trigger)";
    triggerBadgeColor = "bg-amber-100 text-amber-800";
  } else {
    payoutRatePct = 0;
    triggerSeverity = "Normal Weather Conditions (No Trigger)";
    triggerBadgeColor = "bg-agri-green-light text-agri-forest";
  }

  const estimatedIndemnityRwf = Math.round(totalSumInsured * (payoutRatePct / 100));

  const handleDownloadReport = () => {
    const text = `=====================================================
AGRIRESILIENCE RWANDA — NAIS AGRICULTURAL INSURANCE CLAIM PACK
=====================================================
Date Generated: ${new Date().toLocaleString()}
Scheme: Rwanda National Agricultural Insurance Scheme (NAIS)
Underwriting Entity: SONARWA / Prime Insurance Syndicate
Technical Evidence Partner: NISR Big Data & Meteo Rwanda

INSURED ENTITY & COVERAGE SPECIFICATION:
----------------------------------------
Policy Identifier: NAIS-RWA-2024-KYZ-0482
Insured Entity: ${farmerName}
District (ADM2): ${district} (${activeDistrict.province} Province)
Insured Crop: ${crop} (${season})
Covered Area: ${area} Hectares
Sum Insured per Hectare: ${sumInsuredPerHa.toLocaleString()} RWF/ha
Total Policy Exposure: ${totalSumInsured.toLocaleString()} RWF

PREMIUM & SUBSIDY STRUCTURE:
----------------------------
Commercial Premium Rate: ${premiumRatePct}%
Gross Annual Premium: ${grossPremium.toLocaleString()} RWF
Government of Rwanda (GoR) 50% Subsidy: ${goRSubsidyAmount.toLocaleString()} RWF (Funded by MINAGRI)
Net Farmer Cooperative Premium: ${farmerPayablePremium.toLocaleString()} RWF (${(farmerPayablePremium / area).toFixed(0)} RWF/ha)

PARAMETRIC WEATHER & SATELLITE TRIGGERS:
----------------------------------------
Consecutive Dry Spell Days Observed: ${dryDays} Days
NAIS Drought Trigger Threshold: 18 Consecutive Dry Days during Flowering
Trigger Assessment: ${triggerSeverity}
Contractual Payout Rate: ${payoutRatePct}% of Total Sum Insured
Estimated Contractual Indemnity: ${estimatedIndemnityRwf.toLocaleString()} RWF

UNDERWRITER EVIDENCE VERIFICATION:
----------------------------------
Claim Review Status: ${claimStatus}
Underwriter Audit Notes: ${underwriterNotes}

EVIDENCE AUDIT STAMPS:
[X] Sentinel-2 MSI 10m NDVI anomaly cross-checked across multi-date scenes
[X] Meteo Rwanda agrometeorological station data corroborates precipitation deficit
[ ] Physical surveyor ground moisture and kernel formation report submitted
[ ] Sowing date and certified seed variety compliance approved

=====================================================
AgriResilience Rwanda Insurance Decision Support
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAIS_Insurance_Claim_Dossier_${district}_${season}.txt`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <TopBar 
        title="Agricultural Insurance & Risk" 
        subtitle="Exposure assessment, weather-index triggers, and in-season crop monitoring for NAIS insurers." 
      />

      {/* 2. Institutional Notice Banner */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-agri-green-light text-agri-green flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-[12.5px] leading-relaxed text-text-secondary">
          <strong className="text-text-primary font-semibold">Insurance Decision Support Principle:</strong> Satellite NDVI greenness anomalies or meteorological deficits do not automatically execute financial indemnities.
          AgriResilience provides verifiable evidence to support objective claim verification, trigger monitoring, and surveyor dispatch under National Agricultural Insurance Scheme (NAIS) guidelines.
        </div>
      </div>

      {/* 3. Main 2-Column Section */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: NAIS Policy Exposure (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
            <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-agri-green" />
              <span>Policy Exposure Specification</span>
            </h3>
            <span className="text-[11px] font-semibold text-agri-green bg-agri-green-light px-2.5 py-0.5 rounded-md">
              NAIS Scheme
            </span>
          </div>

          {/* Policy Profile */}
          <div className="bg-[#F8FAF9] p-3 rounded-lg border border-card-border text-[12px] space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">Policy Number:</span>
              <strong className="text-text-primary">NAIS-RWA-2024-KYZ-0482</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Insured Entity:</span>
              <strong className="text-text-primary">{farmerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Location &amp; Crop:</span>
              <strong className="text-text-primary">{district} &bull; {crop} ({season})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Land Covered:</span>
              <strong className="text-text-primary">{area} Hectares</strong>
            </div>
          </div>

          {/* Sum Insured Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11.5px] font-semibold text-text-secondary">
                Sum Insured per Hectare (RWF/ha)
              </label>
              <span className="text-[12px] font-extrabold text-sidebar-bg">
                {sumInsuredPerHa.toLocaleString()} RWF
              </span>
            </div>
            <input 
              type="range" 
              min="300000" 
              max="1200000" 
              step="25000" 
              value={sumInsuredPerHa} 
              onChange={(e) => setSumInsuredPerHa(parseInt(e.target.value) || 0)}
              className="w-full accent-agri-green cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
              <span>300,000 RWF</span>
              <span>750,000 RWF</span>
              <span>1,200,000 RWF</span>
            </div>
          </div>

          {/* Premium & GoR Subsidy Breakdown */}
          <div className="bg-[#F4F8F6] p-3.5 rounded-xl border border-agri-green/30 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-text-secondary">
              <span>Total Policy Exposure:</span>
              <strong className="text-text-primary">{totalSumInsured.toLocaleString()} RWF</strong>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Gross Commercial Premium ({premiumRatePct}%):</span>
              <span className="font-semibold text-text-primary">{grossPremium.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-agri-green">
              <span>GoR NAIS 50% Subsidy (MINAGRI):</span>
              <span className="font-bold">-{goRSubsidyAmount.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-agri-green/20">
              <span className="font-bold text-text-primary">Net Farmer Cooperative Share:</span>
              <strong className="font-extrabold text-sidebar-bg text-[14px]">
                {farmerPayablePremium.toLocaleString()} RWF
              </strong>
            </div>
          </div>
        </div>

        {/* Right Column: Parametric Weather & Satellite Triggers (7 cols) */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
            <div>
              <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-accent" />
                <span>Parametric Index Triggers &amp; Exposure Evaluation</span>
              </h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Rwanda National Agricultural Insurance Scheme dual-index verification
              </p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${triggerBadgeColor}`}>
              {dryDays >= 18 ? "Trigger Breached" : dryDays >= 14 ? "Watchlist Active" : "Normal Conditions"}
            </span>
          </div>

          {/* Trigger Metric Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Trigger 1: Dry Days */}
            <div className="p-3.5 rounded-xl border border-card-border bg-page-bg/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase text-text-secondary">
                  Weather Index: Dry Spell
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  dryDays >= 18 ? 'bg-red-100 text-red-700' : 'bg-agri-green-light text-agri-forest'
                }`}>
                  Threshold: ≥ 18 Days
                </span>
              </div>
              <div className="text-[24px] font-extrabold text-text-primary mt-1">
                {dryDays} <span className="text-[13px] font-normal text-text-secondary">Consecutive Days</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1">
                {dryDays >= 18 
                  ? "⚠️ Trigger threshold breached during critical flowering phase." 
                  : "Within normal seasonal moisture variation bounds."}
              </p>
            </div>

            {/* Trigger 2: Satellite Canopy Drop */}
            <div className="p-3.5 rounded-xl border border-card-border bg-page-bg/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase text-text-secondary">
                  Satellite Index: NDVI Canopy
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  dryDays >= 14 ? 'bg-amber-100 text-amber-800' : 'bg-agri-green-light text-agri-forest'
                }`}>
                  Threshold: &gt; 15% Drop
                </span>
              </div>
              <div className="text-[24px] font-extrabold text-text-primary mt-1">
                {dryDays >= 14 ? "-15.4%" : "-2.1%"} <span className="text-[13px] font-normal text-text-secondary">Canopy Deficit</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1">
                Cloud-screened Sentinel-2 multispectral vegetation index corroborated.
              </p>
            </div>
          </div>

          {/* Payout Calculation Simulation */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-accent" />
                <span className="font-bold text-[13px] text-text-primary">
                  Indicative Contractual Indemnity Simulation:
                </span>
              </div>
              <span className="text-[16px] font-extrabold text-amber-900">
                {estimatedIndemnityRwf.toLocaleString()} RWF
              </span>
            </div>
            <p className="text-[11.5px] text-text-secondary leading-relaxed">
              Based on the <strong>{payoutRatePct}% contractual tier</strong> for a {dryDays}-day dry spell against total policy exposure of {totalSumInsured.toLocaleString()} RWF.
              Disbursement is conditional upon field loss adjuster verification and policy compliance confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Loss Adjustment Protocol & Claim Evidence Pack Export */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
          <div>
            <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-agri-green" />
              <span>Insurer Loss Adjustment Workflow &amp; Field Audit Protocol</span>
            </h3>
            <p className="text-[11.5px] text-text-secondary mt-0.5">
              Strict governance ensuring zero fraudulent claims and objective evidence-based indemnities
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 py-2 px-3.5 rounded-lg bg-sidebar-bg hover:bg-sidebar-hover text-white text-[12px] font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Insurance Claim Pack</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5 items-start">
          {/* Checklist on left (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-2 text-[12px]">
            <div className="font-bold text-text-primary mb-1">Underwriter Verification Steps:</div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Satellite NDVI greenness anomaly confirmed across multi-date Sentinel-2 passes</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Meteo Rwanda agrometeorological station data corroborates &gt; 18 consecutive dry days</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-amber-accent shrink-0" />
              <span>On-site physical agronomist soil moisture and ear pollination inspection dispatched</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Certified seed variety (RAB certified) and sowing date compliance corroborated</span>
            </div>
          </div>

          {/* Claim Decision Status on right (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Insurance Syndicate Underwriting Status
              </label>
              <select 
                value={claimStatus} 
                onChange={(e) => setClaimStatus(e.target.value)}
                className="w-full border border-card-border rounded-lg px-3 py-2 text-[12.5px] font-bold bg-white text-agri-forest focus:outline-none focus:border-agri-green"
              >
                <option value="Normal Coverage (No Anomaly)">Normal Coverage (No Anomaly)</option>
                <option value="Active Watchlist — Climate Deficit Flagged">Active Watchlist — Climate Deficit Flagged</option>
                <option value="Trigger Breached — Ground Surveyor Dispatched">Trigger Breached — Ground Surveyor Dispatched</option>
                <option value="Loss Assessment Under Review by Lead Underwriter">Loss Assessment Under Review by Lead Underwriter</option>
                <option value="Indemnity Approved for Disbursement">Indemnity Approved for Disbursement</option>
                <option value="Claim Declined — Non-Covered Risk">Claim Declined — Non-Covered Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Underwriter Review &amp; Loss Adjustment Notes
              </label>
              <textarea
                rows={3}
                value={underwriterNotes}
                onChange={(e) => setUnderwriterNotes(e.target.value)}
                className="w-full border border-card-border rounded-lg p-2.5 text-[12px] text-text-primary focus:outline-none focus:border-agri-green"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
