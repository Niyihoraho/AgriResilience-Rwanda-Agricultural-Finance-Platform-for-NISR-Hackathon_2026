// frontend/src/views/LoanView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { 
  Landmark, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  Info,
  TrendingDown,
  Layers
} from 'lucide-react';

export default function LoanView({ caseAData }) {
  // Pull from Case A shared state if available, or use defaults
  const district = caseAData?.district || "Nyabihu";
  const crop = caseAData?.crop || "Maize";
  const season = caseAData?.season || "2025A";
  const farmerName = caseAData?.farmerName || "Jean Bizimana (KABOKU Cooperative)";
  const area = caseAData?.area || 1.5;
  const costPerHa = caseAData?.costPerHa || 260000;
  const pricePerKg = caseAData?.pricePerKg || 350;
  const expectedYieldKg = caseAData?.expectedYieldKg || 3350;

  // Loan Facility State
  const [requestedPrincipal, setRequestedPrincipal] = useState(550000); // RWF
  const [tenureMonths, setTenureMonths] = useState(6); // 6 months bullet at harvest
  const [interestRatePct, setInterestRatePct] = useState(16.5); // % p.a.
  const [originationFeePct, setOriginationFeePct] = useState(1.5); // %
  const [committeeStatus, setCommitteeStatus] = useState("Evidence Complete — Recommend for Approval");
  const [officerNotes, setOfficerNotes] = useState(
    "Applicant demonstrates strong historical cooperative track record. Historical district benchmarks support expected harvest capacity. NAIS crop insurance participation recommended to hedge drought exposure."
  );

  // Financial Waterfall Calculations
  const expectedHarvestKg = Math.round(expectedYieldKg * area);
  const grossRevenue = Math.round(expectedHarvestKg * pricePerKg);
  const totalFarmCost = Math.round(costPerHa * area);
  const netOperatingIncome = Math.round(grossRevenue - totalFarmCost);

  // Debt Service: Principal + (Interest for tenure) + Processing fee
  const interestCost = Math.round(requestedPrincipal * (interestRatePct / 100) * (tenureMonths / 12));
  const originationFee = Math.round(requestedPrincipal * (originationFeePct / 100));
  const totalDebtService = Math.round(requestedPrincipal + interestCost + originationFee);

  // Debt Service Coverage Ratio (DSCR)
  const dscr = totalDebtService > 0 ? (netOperatingIncome / totalDebtService) : 0;
  const retainedSurplus = Math.round(netOperatingIncome - totalDebtService);

  // Break-even price and yield for debt service
  const requiredCashForSolvency = totalFarmCost + totalDebtService;
  const breakEvenPriceForSolvency = expectedHarvestKg > 0 ? Math.round(requiredCashForSolvency / expectedHarvestKg) : 0;
  const breakEvenYieldForSolvency = (area > 0 && pricePerKg > 0) ? Math.round(requiredCashForSolvency / (pricePerKg * area)) : 0;

  // Stress Scenarios
  const stressScenarios = [
    {
      name: "Base Case (Expected ML Yield)",
      yieldAdj: 1.0,
      priceAdj: 1.0,
      riskLabel: "Low Risk",
      riskBadge: "bg-agri-green-light text-agri-forest"
    },
    {
      name: "Climate Shock (-15% Yield Deficit)",
      yieldAdj: 0.85,
      priceAdj: 1.0,
      riskLabel: "Moderate Risk",
      riskBadge: "bg-emerald-100 text-emerald-800"
    },
    {
      name: "Market Slump (-20% Price Crash)",
      yieldAdj: 1.0,
      priceAdj: 0.80,
      riskLabel: "Cautious",
      riskBadge: "bg-amber-100 text-amber-800"
    },
    {
      name: "Combined Shock (-15% Yield & -15% Price)",
      yieldAdj: 0.85,
      priceAdj: 0.85,
      riskLabel: "Severe Stress",
      riskBadge: "bg-red-100 text-red-800"
    }
  ];

  const handleDownloadDossier = () => {
    const text = `=====================================================
AGRIRESILIENCE RWANDA — CREDIT COMMITTEE EVIDENCE DOSSIER
=====================================================
Date Generated: ${new Date().toLocaleString()}
National Strategy: Rwanda NST2 Agricultural Lending Initiative (10% Target)
Assessment Case: Pre-Financing Agricultural Appraisal

APPLICANT PROFILE:
------------------
Farmer / Entity: ${farmerName}
District (ADM2): ${district}
Target Crop: ${crop}
Season: ${season}
Cultivated Land: ${area} Hectares

AGRICULTURAL CASH FLOW WATERFALL:
---------------------------------
Expected Harvest: ${expectedHarvestKg.toLocaleString()} kg (@ ${expectedYieldKg.toLocaleString()} kg/ha)
Farmgate Price Benchmark: ${pricePerKg} RWF/kg (MINAGRI e-Soko)
Gross Crop Revenue: ${grossRevenue.toLocaleString()} RWF
(-) Farm Operating Costs: ${totalFarmCost.toLocaleString()} RWF (@ ${costPerHa.toLocaleString()} RWF/ha)
(=) Net Farm Operating Income: ${netOperatingIncome.toLocaleString()} RWF

PROPOSED CREDIT FACILITY:
-------------------------
Requested Principal: ${requestedPrincipal.toLocaleString()} RWF
Tenure: ${tenureMonths} Months (Bullet at Harvest)
Interest Rate: ${interestRatePct}% p.a.
Processing Fee: ${originationFeePct}% (${originationFee.toLocaleString()} RWF)
Total Debt Service: ${totalDebtService.toLocaleString()} RWF

SOLVENCY & COVERAGE BENCHMARKS:
-------------------------------
Debt Service Coverage Ratio (DSCR): ${dscr.toFixed(2)}x
Commercial Minimum Policy Requirement: 1.30x
Net Retained Cash Surplus (Farmer): ${retainedSurplus.toLocaleString()} RWF
Break-Even Solvency Price: ${breakEvenPriceForSolvency} RWF/kg (Buffer: -${(((pricePerKg - breakEvenPriceForSolvency) / pricePerKg) * 100).toFixed(0)}%)
Break-Even Solvency Yield: ${breakEvenYieldForSolvency} kg/ha (Buffer: -${(((expectedYieldKg - breakEvenYieldForSolvency) / expectedYieldKg) * 100).toFixed(0)}%)

COMMITTEE RECOMMENDATION:
-------------------------
Status: ${committeeStatus}
Officer Notes: ${officerNotes}

Verification Stamps:
[X] Land registry verified
[X] Multi-season NISR yield benchmark validated
[X] e-Soko market pricing corroborated
[X] NAIS subsidized crop insurance policy verified

=====================================================
AgriResilience Rwanda Decision-Support System
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan_Dossier_${farmerName.replace(/[^a-zA-Z0-9]/g, '_')}_${season}.txt`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <TopBar 
        title="Agricultural Loan Assessment" 
        subtitle="Connect verified agricultural evidence to commercial bank underwriting without replacing human loan officer review." 
      />


      {/* 3. 2-Column Main Section */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Loan Request & Applicant Profile (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
            <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-agri-green" />
              <span>Credit Facility Parameters</span>
            </h3>
            <span className="text-[11px] font-semibold text-sidebar-bg bg-[#E0EDE7] px-2.5 py-0.5 rounded-md">
              NST2 Lending Scheme
            </span>
          </div>

          {/* Applicant Summary */}
          <div className="bg-[#F8FAF9] p-3 rounded-lg border border-card-border text-[12px] space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">Applicant:</span>
              <strong className="text-text-primary">{farmerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">District &amp; Crop:</span>
              <strong className="text-text-primary">{district} &bull; {crop} ({season})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Cultivated Land:</span>
              <strong className="text-text-primary">{area} ha ({expectedHarvestKg.toLocaleString()} kg est.)</strong>
            </div>
          </div>

          {/* Requested Principal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11.5px] font-semibold text-text-secondary">
                Requested Loan Principal (RWF)
              </label>
              <span className="text-[12px] font-extrabold text-sidebar-bg">
                {requestedPrincipal.toLocaleString()} RWF
              </span>
            </div>
            <input 
              type="range" 
              min="200000" 
              max="2000000" 
              step="25000" 
              value={requestedPrincipal} 
              onChange={(e) => setRequestedPrincipal(parseInt(e.target.value) || 0)}
              className="w-full accent-agri-green cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
              <span>200,000 RWF</span>
              <span>1,000,000 RWF</span>
              <span>2,000,000 RWF</span>
            </div>
          </div>

          {/* Loan Facility Terms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Loan Tenure
              </label>
              <select 
                value={tenureMonths} 
                onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                className="w-full border border-card-border rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium bg-white"
              >
                <option value={6}>6 Months (Single Bullet at Harvest)</option>
                <option value={9}>9 Months (Extended Season)</option>
                <option value={12}>12 Months (Annual Facility)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Interest Rate (% p.a.)
              </label>
              <input 
                type="number" 
                step="0.5" 
                value={interestRatePct} 
                onChange={(e) => setInterestRatePct(parseFloat(e.target.value) || 0)}
                className="w-full border border-card-border rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium"
              />
            </div>
          </div>

          {/* Debt Service Summary Box */}
          <div className="bg-[#F4F8F6] p-3.5 rounded-xl border border-agri-green/30 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-text-secondary">
              <span>Principal Amount:</span>
              <span className="font-semibold text-text-primary">{requestedPrincipal.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Estimated Interest Cost ({tenureMonths} mos):</span>
              <span className="font-semibold text-text-primary">{interestCost.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Processing &amp; Insurance Fee ({originationFeePct}%):</span>
              <span className="font-semibold text-text-primary">{originationFee.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-agri-green/20">
              <span className="font-bold text-text-primary">Total Obligation (Debt Service):</span>
              <strong className="font-extrabold text-sidebar-bg text-[14px]">
                {totalDebtService.toLocaleString()} RWF
              </strong>
            </div>
          </div>
        </div>

        {/* Right Column: Agricultural Cash Flow Waterfall (7 cols) */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
            <div>
              <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-agri-green" />
                <span>Agricultural Cash Flow Waterfall</span>
              </h3>
              <p className="text-[11px] text-text-secondary mt-0.5">
                From farmgate harvest proceeds to net debt service solvency
              </p>
            </div>
            <span className="text-[11px] font-bold text-agri-green bg-agri-green-light px-2.5 py-0.5 rounded-md">
              Evidence-Linked
            </span>
          </div>

          {/* Waterfall Steps */}
          <div className="space-y-2 text-[12.5px]">
            {/* Step 1: Gross Harvest Revenue */}
            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border flex items-center justify-between">
              <div>
                <span className="font-bold text-text-primary">(+) Gross Crop Revenue</span>
                <span className="text-[11px] text-text-muted block">
                  {expectedHarvestKg.toLocaleString()} kg @ {pricePerKg} RWF/kg (e-Soko)
                </span>
              </div>
              <span className="text-[15px] font-extrabold text-text-primary">
                +{grossRevenue.toLocaleString()} RWF
              </span>
            </div>

            {/* Step 2: Farm Production Cost */}
            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border flex items-center justify-between">
              <div>
                <span className="font-bold text-text-secondary">(-) Farm Operating Expenses</span>
                <span className="text-[11px] text-text-muted block">
                  Seeds, inorganic fertilizer, tilling, labor ({area} ha)
                </span>
              </div>
              <span className="text-[15px] font-bold text-amber-accent">
                -{totalFarmCost.toLocaleString()} RWF
              </span>
            </div>

            {/* Step 3: Net Operating Income (NOI) */}
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-agri-green/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-agri-forest">(=) Net Farm Operating Income (NOI)</span>
                <span className="text-[11px] text-agri-forest/80 block">
                  Cash available before debt service
                </span>
              </div>
              <span className="text-[16px] font-extrabold text-agri-forest">
                {netOperatingIncome.toLocaleString()} RWF
              </span>
            </div>

            {/* Step 4: Debt Service */}
            <div className="p-3 rounded-lg bg-page-bg/70 border border-card-border flex items-center justify-between">
              <div>
                <span className="font-bold text-text-secondary">(-) Total Bank Debt Service</span>
                <span className="text-[11px] text-text-muted block">
                  Principal + {interestRatePct}% p.a. interest + fees
                </span>
              </div>
              <span className="text-[15px] font-bold text-red-600">
                -{totalDebtService.toLocaleString()} RWF
              </span>
            </div>

            {/* Step 5: Net Surplus */}
            <div className="p-3.5 rounded-xl bg-agri-green-light/60 border border-agri-green flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sidebar-bg text-[13px]">
                  (=) Net Retained Cash Surplus (Farmer)
                </span>
                <span className="text-[11px] text-text-secondary block">
                  Household food security, emergency savings, reinvestment
                </span>
              </div>
              <span className="text-[18px] font-extrabold text-sidebar-bg">
                {retainedSurplus.toLocaleString()} RWF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Solvency & Coverage Indicators (Row of 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: DSCR */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-wider">
            Debt Service Coverage Ratio (DSCR)
          </div>
          <div className="text-[28px] font-extrabold mt-1 tracking-tight text-sidebar-bg">
            {dscr.toFixed(2)}x
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              dscr >= 1.30 ? 'bg-agri-green-light text-agri-forest' : dscr >= 1.10 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {dscr >= 1.30 ? 'Strong Solvency (≥ 1.30x)' : dscr >= 1.10 ? 'Moderate (1.10–1.29x)' : 'High Credit Risk (< 1.10x)'}
            </span>
          </div>
          <p className="text-[10.5px] text-text-muted mt-2">
            Net operating income is {dscr.toFixed(2)} times the total debt obligation.
          </p>
        </div>

        {/* Metric 2: Break-Even Harvest Price */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-wider">
            Break-Even Solvency Price
          </div>
          <div className="text-[28px] font-extrabold mt-1 tracking-tight text-text-primary">
            {breakEvenPriceForSolvency} <span className="text-[14px] font-semibold text-text-secondary">RWF/kg</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-agri-green bg-agri-green-light px-2 py-0.5 rounded">
              -{(Math.max(0, ((pricePerKg - breakEvenPriceForSolvency) / pricePerKg) * 100)).toFixed(0)}% Price Cushion
            </span>
          </div>
          <p className="text-[10.5px] text-text-muted mt-2">
            Market price can fall from {pricePerKg} to {breakEvenPriceForSolvency} RWF/kg before default risk occurs.
          </p>
        </div>

        {/* Metric 3: Break-Even Harvest Yield */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-wider">
            Break-Even Solvency Yield
          </div>
          <div className="text-[28px] font-extrabold mt-1 tracking-tight text-text-primary">
            {breakEvenYieldForSolvency.toLocaleString()} <span className="text-[14px] font-semibold text-text-secondary">kg/ha</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-agri-green bg-agri-green-light px-2 py-0.5 rounded">
              -{(Math.max(0, ((expectedYieldKg - breakEvenYieldForSolvency) / expectedYieldKg) * 100)).toFixed(0)}% Yield Cushion
            </span>
          </div>
          <p className="text-[10.5px] text-text-muted mt-2">
            Harvest can drop from {expectedYieldKg.toLocaleString()} to {breakEvenYieldForSolvency.toLocaleString()} kg/ha before loan service is impaired.
          </p>
        </div>
      </div>

      {/* 5. Sensitivity & Stress Testing Analysis */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-accent" />
              <span>Credit Committee Sensitivity &amp; Stress Testing</span>
            </h4>
            <p className="text-[11.5px] text-text-secondary mt-0.5">
              Simulating simultaneous agro-climatic shortfalls and market price declines
            </p>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
            4 Scenarios Evaluated
          </span>
        </div>

        <div className="overflow-hidden border border-card-border/80 rounded-lg">
          <table className="w-full text-[12px] border-collapse bg-white">
            <thead>
              <tr className="bg-page-bg/80 border-b border-card-border text-text-secondary font-semibold text-left">
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Stress Scenario</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Harvest Yield</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Net Revenue</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Net Margin</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Stress DSCR</th>
                <th className="py-2.5 px-3 text-center uppercase tracking-wider text-[11px]">Solvency Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F2]">
              {stressScenarios.map((sc, i) => {
                const stressYield = Math.round(expectedYieldKg * sc.yieldAdj);
                const stressPrice = Math.round(pricePerKg * sc.priceAdj);
                const stressRev = Math.round(stressYield * area * stressPrice);
                const stressNOI = Math.round(stressRev - totalFarmCost);
                const stressDscr = totalDebtService > 0 ? (stressNOI / totalDebtService) : 0;

                return (
                  <tr key={i} className="hover:bg-page-bg/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text-primary">
                      {sc.name}
                    </td>
                    <td className="py-2.5 px-3 text-right text-text-secondary font-medium">
                      {stressYield.toLocaleString()} kg/ha
                    </td>
                    <td className="py-2.5 px-3 text-right text-text-secondary font-medium">
                      {stressRev.toLocaleString()} RWF
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-primary">
                      {stressNOI.toLocaleString()} RWF
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-sidebar-bg">
                      {stressDscr.toFixed(2)}x
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sc.riskBadge}`}>
                        {sc.riskLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Committee Review & Official Evidence Export */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-3">
          <div>
            <h3 className="text-[14.5px] font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agri-green" />
              <span>Credit Committee Determination &amp; Evidence Audit Pack</span>
            </h3>
            <p className="text-[11.5px] text-text-secondary mt-0.5">
              Formal record linking underwriting decisions directly to NISR SAS microdata and Meteo observations
            </p>
          </div>
          <button
            onClick={handleDownloadDossier}
            className="flex items-center gap-2 py-2 px-3.5 rounded-lg bg-sidebar-bg hover:bg-sidebar-hover text-white text-[12px] font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Committee Evidence Dossier</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5 items-start">
          {/* Checklist on left (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-2 text-[12px]">
            <div className="font-bold text-text-primary mb-1">Required Verification Checklist:</div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Land area verified with district land registry / cooperative register</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Multi-season NISR yield benchmark ({district}: {expectedYieldKg.toLocaleString()} kg/ha) validated</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>e-Soko market pricing benchmark ({pricePerKg} RWF/kg) corroborated</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>Debt Service Coverage Ratio ({dscr.toFixed(2)}x) exceeds bank threshold (1.30x)</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-agri-green shrink-0" />
              <span>NAIS subsidized crop insurance (50% Government subsidy) enrolled</span>
            </div>
          </div>

          {/* Decision Status & Officer Notes on right (6 cols) */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Loan Committee Underwriting Status
              </label>
              <select 
                value={committeeStatus} 
                onChange={(e) => setCommitteeStatus(e.target.value)}
                className="w-full border border-card-border rounded-lg px-3 py-2 text-[12.5px] font-bold bg-white text-agri-forest focus:outline-none focus:border-agri-green"
              >
                <option value="Evidence Complete — Recommend for Approval">Evidence Complete — Recommend for Approval</option>
                <option value="Under Review — Additional Verification">Under Review — Additional Verification</option>
                <option value="Conditional Approval (NAIS Crop Insurance Required)">Conditional Approval (NAIS Crop Insurance Required)</option>
                <option value="Additional Collateral / Guarantor Required">Additional Collateral / Guarantor Required</option>
                <option value="Decline — Insufficient Cash Flow Buffer">Decline — Insufficient Cash Flow Buffer</option>
              </select>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Loan Officer Audit &amp; Assessment Notes
              </label>
              <textarea
                rows={3}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
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
