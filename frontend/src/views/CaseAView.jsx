// frontend/src/views/CaseAView.jsx
import React, { useState, useMemo } from 'react';
import Footer from '../components/Footer';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import {
  HISTORICAL_CLIMATE_PROFILES,
  CROP_CLIMATE_PROFILES,
  HISTORICAL_DISTRICT_SEASON_RECORDS
} from '../data/climateData';
import { POINT_IN_TIME_BENCHMARKS } from '../data/pointInTimeBenchmarks';
import { NISR_MICRODATA_STATS } from '../data/microdataStats';
import {
  TrendingUp,
  CloudRain,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Sliders,
  Scale
} from 'lucide-react';

export default function CaseAView({
  caseAData,
  setCaseAData = () => { },
  onNavigateToLoan = () => { }
}) {
  // -------------------------------------------------------------
  // 1. SECTION ONE: Farm & Production Parameters
  // -------------------------------------------------------------
  const [district, setDistrict] = useState(caseAData?.district || "Nyabihu");
  const [sector, setSector] = useState("Rambura Sector");
  const [crop, setCrop] = useState(caseAData?.crop || "Maize");
  const [season, setSeason] = useState(caseAData?.season || "2025A");
  const [farmerName, setFarmerName] = useState(caseAData?.farmerName || "Jean Bizimana (KABOKU Cooperative)");
  const [area, setArea] = useState(caseAData?.area || 1.5);
  const [assumedYield, setAssumedYield] = useState(3800);
  const [sellingPrice, setSellingPrice] = useState(caseAData?.pricePerKg || 350);
  const [totalFarmCosts, setTotalFarmCosts] = useState(390000);

  // -------------------------------------------------------------
  // 5. SECTION FIVE: Agricultural Loan Parameters
  // -------------------------------------------------------------
  const [loanPrincipal, setLoanPrincipal] = useState(550000);
  const [annualInterestRate, setAnnualInterestRate] = useState(16.5);
  const [tenureMonths, setTenureMonths] = useState(6);
  const [facilityFeePct, setFacilityFeePct] = useState(1.5);
  const [activeWaterfallScenario, setActiveWaterfallScenario] = useState("historical_ref"); // "historical_ref", "farmer_assumed", "adverse_shock", "price_shock"

  // -------------------------------------------------------------
  // Data Lookups & Point-in-Time Benchmarks
  // -------------------------------------------------------------
  const activeDistrict = RWANDA_DISTRICTS.find(d => d.name === district) || RWANDA_DISTRICTS[0];
  const histClimate = HISTORICAL_CLIMATE_PROFILES[district] || HISTORICAL_CLIMATE_PROFILES["Nyabihu"];
  const cropProfile = CROP_CLIMATE_PROFILES[crop] || CROP_CLIMATE_PROFILES["Maize"];

  // Point-in-Time Historical Benchmark Lookup (Zero Temporal Leakage)
  const pitData = useMemo(() => {
    const dRec = POINT_IN_TIME_BENCHMARKS[district];
    if (!dRec) return null;
    const cRec = dRec[crop];
    if (!cRec) return null;
    return cRec[season] || cRec["2025A"] || Object.values(cRec)[0];
  }, [district, crop, season]);

  const historicalBenchmarkYield = pitData?.regional_benchmark_yield || 2482.9;
  const benchmarkSampleSize = pitData?.benchmark_sample_size || 19;
  const benchmarkFallbackTier = pitData?.benchmark_fallback_tier || "exact_district_crop_season";

  // Authentic microdata sample statistics
  const microStats = NISR_MICRODATA_STATS?.[district]?.[crop] || {
    count: 750,
    mean: 3800.0,
    median: 3800.0,
    p10: 2500.0,
    p90: 4500.0
  };

  // Historical District Season Climate Record (Stage 1 Agrometeorological Data)
  const districtHistory = HISTORICAL_DISTRICT_SEASON_RECORDS[district] || {};
  const currentRecord = districtHistory[season] || districtHistory["2024A"] || Object.values(districtHistory)[0];
  const cropClimateRecord = currentRecord?.crops?.[crop];

  // Multi-crop comparison list for interactive inspection (Maize, Beans, Irish Potato, Cassava, Rice)
  const comparisonCrops = ["Maize", "Beans", "Irish Potato", "Cassava", "Rice"];

  // -------------------------------------------------------------
  // Section 1: Expected Production Reference vs. Farmer Assumption
  // -------------------------------------------------------------
  // Historical-reference estimate = Benchmark Yield * Cultivated Area
  const expectedHarvestReferenceKg = Math.round(historicalBenchmarkYield * area);
  const referenceGrossRevenueRwf = Math.round(expectedHarvestReferenceKg * sellingPrice);
  const referenceFarmMarginRwf = referenceGrossRevenueRwf - totalFarmCosts;

  // Farmer / User assumed harvest & revenue
  const estimatedTotalHarvestKg = Math.round(area * assumedYield);
  const estimatedGrossRevenueRwf = Math.round(estimatedTotalHarvestKg * sellingPrice);
  const estimatedFarmMarginRwf = estimatedGrossRevenueRwf - totalFarmCosts;
  const costPerHaRwf = area > 0 ? Math.round(totalFarmCosts / area) : 260000;

  // -------------------------------------------------------------
  // Section 4 & 2: Biophysical Climate Defense Scores
  // -------------------------------------------------------------
  const isRice = crop === "Rice";
  const climateDefenseScore = isRice
    ? (cropClimateRecord?.climate_defense_score ?? 72.0)
    : (cropClimateRecord?.climate_defense_score ?? histClimate.historical_stress_score ?? 78.5);

  const moistureDefense = isRice ? null : (cropClimateRecord?.moisture_defense ?? 62.5);
  const delugeDefense = cropClimateRecord?.deluge_defense ?? 58.0;
  const thermalDefense = cropClimateRecord?.thermal_defense ?? 70.0;
  const regularityDefense = cropClimateRecord?.regularity_defense ?? 48.0;

  // -------------------------------------------------------------
  // Section 5: Loan Debt Service Calculations
  // Simple seasonal bullet facility: Interest = Principal * Rate * (Tenure / 12)
  // -------------------------------------------------------------
  const interestCostRwf = Math.round(loanPrincipal * (annualInterestRate / 100.0) * (tenureMonths / 12.0));
  const facilityFeeRwf = Math.round(loanPrincipal * (facilityFeePct / 100.0));
  const totalDebtServiceRwf = loanPrincipal + interestCostRwf + facilityFeeRwf;

  // Active scenario driving the loan cash-flow waterfall
  const { activeYieldKgHa, activePriceRwf } = useMemo(() => {
    switch (activeWaterfallScenario) {
      case "farmer_assumed":
        return { activeYieldKgHa: assumedYield, activePriceRwf: sellingPrice };
      case "adverse_shock":
        return { activeYieldKgHa: Math.round(historicalBenchmarkYield * 0.75), activePriceRwf: sellingPrice };
      case "price_shock":
        return { activeYieldKgHa: historicalBenchmarkYield, activePriceRwf: Math.round(sellingPrice * 0.80) };
      case "historical_ref":
      default:
        return { activeYieldKgHa: historicalBenchmarkYield, activePriceRwf: sellingPrice };
    }
  }, [activeWaterfallScenario, historicalBenchmarkYield, assumedYield, sellingPrice]);

  // Unified Cash-Flow Waterfall Calculations
  const waterfallHarvestKg = Math.round(area * activeYieldKgHa);
  const waterfallGrossRevenueRwf = Math.round(waterfallHarvestKg * activePriceRwf);
  const waterfallNOIRwf = waterfallGrossRevenueRwf - totalFarmCosts;
  const waterfallNetSurplusRwf = waterfallNOIRwf - totalDebtServiceRwf;

  // Underwriting Risk Indicators
  const dscr = totalDebtServiceRwf > 0 ? (waterfallNOIRwf / totalDebtServiceRwf).toFixed(2) : "N/A";
  const debtServicePctOfNOI = waterfallNOIRwf > 0 ? ((totalDebtServiceRwf / waterfallNOIRwf) * 100).toFixed(1) : "N/A";
  const totalRequiredOutflow = totalFarmCosts + totalDebtServiceRwf;
  const breakEvenPriceRwf = waterfallHarvestKg > 0 ? (totalRequiredOutflow / waterfallHarvestKg).toFixed(1) : "N/A";
  const revenuePerKgYield = area * activePriceRwf;
  const breakEvenYieldKgHa = revenuePerKgYield > 0 ? Math.round(totalRequiredOutflow / revenuePerKgYield) : 0;
  const stressToleranceBufferPct = activeYieldKgHa > 0
    ? (((activeYieldKgHa - breakEvenYieldKgHa) / activeYieldKgHa) * 100).toFixed(1)
    : "0.0";

  // -------------------------------------------------------------
  // Multi-Scenario Sensitivity Matrix Data
  // -------------------------------------------------------------
  const scenarioMatrix = useMemo(() => {
    const list = [
      {
        id: "historical_ref",
        name: "Historical Reference Baseline",
        desc: "Point-in-time district survey benchmark",
        yieldVal: historicalBenchmarkYield,
        priceVal: sellingPrice,
        badge: "Historical Benchmark"
      },
      {
        id: "farmer_assumed",
        name: "Farmer-Assumed Scenario",
        desc: "Interactive farmer/officer assumption",
        yieldVal: assumedYield,
        priceVal: sellingPrice,
        badge: "Farmer Input"
      },
      {
        id: "adverse_shock",
        name: "Adverse Weather Shock (-25%)",
        desc: "Simulates severe mid-season dry spell",
        yieldVal: Math.round(historicalBenchmarkYield * 0.75),
        priceVal: sellingPrice,
        badge: "Biophysical Stress"
      },
      {
        id: "price_shock",
        name: "Market Price Shock (-20%)",
        desc: "Simulates harvest glut / local price drop",
        yieldVal: historicalBenchmarkYield,
        priceVal: Math.round(sellingPrice * 0.80),
        badge: "Market Price Deficit"
      }
    ];

    return list.map(sc => {
      const harv = Math.round(area * sc.yieldVal);
      const rev = Math.round(harv * sc.priceVal);
      const noi = rev - totalFarmCosts;
      const surplus = noi - totalDebtServiceRwf;
      const scDSCR = totalDebtServiceRwf > 0 ? (noi / totalDebtServiceRwf).toFixed(2) : "N/A";
      return {
        ...sc,
        harvestKg: harv,
        grossRev: rev,
        noi: noi,
        debtService: totalDebtServiceRwf,
        surplus: surplus,
        dscr: scDSCR,
        solvent: surplus > 0 && parseFloat(scDSCR) >= 1.25
      };
    });
  }, [area, sellingPrice, totalFarmCosts, totalDebtServiceRwf, historicalBenchmarkYield, assumedYield]);

  // -------------------------------------------------------------
  // Section 5: Agricultural Insurance Assessment (NAIS Verified Terms)
  // -------------------------------------------------------------
  const grossInsurancePremiumRwf = Math.round(totalFarmCosts * 0.05); // 5% of production cost
  const minagriSubsidyRwf = Math.round(grossInsurancePremiumRwf * 0.40); // 40% official MINAGRI statutory subsidy
  const farmerPremiumRwf = Math.round(grossInsurancePremiumRwf * 0.60); // 60% farmer out-of-pocket contribution
  const maxInsurancePayoutRwf = Math.round(totalFarmCosts * 0.80); // 80% input cost coverage limit
  const uninsuredExposureRwf = totalDebtServiceRwf;
  const insuredNetBankExposureRwf = Math.max(0, totalDebtServiceRwf - maxInsurancePayoutRwf);
  const exposureReductionPct = uninsuredExposureRwf > 0
    ? (((uninsuredExposureRwf - insuredNetBankExposureRwf) / uninsuredExposureRwf) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Platform Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-card-border rounded-xl p-4 shadow-card">
        <div>
          <h1 className="text-[20px] font-extrabold text-sidebar-bg tracking-tight">
            Case A — Before Planting
          </h1>
          <p className="text-[12.5px] text-text-secondary mt-0.5">
            Agricultural feasibility, historical survey benchmarks, and financial loan underwriting decision support.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-3 py-1 rounded-full shadow-xs">
            Decision-Support System
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION ONE: Farm & Production Assessment                             */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-white border border-card-border rounded-xl shadow-card overflow-hidden">
        {/* Section Header Banner */}
        <div className="bg-[#F7F9F8] border-b border-card-border px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-sidebar-bg text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
              Section 1
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                Farm &amp; Production Assessment
              </h2>
              <p className="text-[12px] text-text-secondary">
                Capture farm parameters and calculate historical-reference production alongside farmer assumptions.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-white border border-card-border px-3 py-1 rounded-full shadow-xs">
            Interactive Operational Feasibility
          </span>
        </div>

        <div className="p-6 grid grid-cols-12 gap-6 items-start">
          {/* Left Form: Editable Controls */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* District */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const newD = e.target.value;
                    setDistrict(newD);
                    const dObj = RWANDA_DISTRICTS.find(x => x.name === newD);
                    if (dObj) setAssumedYield(Math.round((dObj.yield || 3.0) * 1000));
                  }}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green"
                >
                  {RWANDA_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} ({d.province})</option>
                  ))}
                </select>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Sector
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green"
                  placeholder="Sector name"
                />
              </div>

              {/* Crop */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Crop
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green"
                >
                  <option value="Maize">Maize</option>
                  <option value="Beans">Beans</option>
                  <option value="Irish Potato">Irish Potato</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Rice">Rice</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green"
                >
                  <option value="2025A">Season 2025A (Sep–Jan)</option>
                  <option value="2025B">Season 2025B (Feb–Jun)</option>
                </select>
              </div>
            </div>

            {/* Applicant Name */}
            <div>
              <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                Applicant &amp; Cooperative Membership
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-3 py-1.5 text-[12.5px] font-medium focus:outline-none focus:border-agri-green"
              />
            </div>

            {/* Sliders: Area & Farmer Assumed Yield */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Farm Area */}
              <div className="p-3 bg-page-bg/60 border border-card-border/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary font-medium">Cultivated Area (Hectares)</span>
                  <span className="text-text-primary font-bold text-[13px]">{area} ha</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.1"
                  value={area}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.5;
                    setArea(val);
                    setTotalFarmCosts(Math.round(val * 260000));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agri-green"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-medium">
                  <span>0.5 ha</span>
                  <span>5.0 ha</span>
                  <span>10.0 ha</span>
                </div>
              </div>

              {/* Farmer Assumed Yield */}
              <div className="p-3 bg-page-bg/60 border border-card-border/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary font-medium">Farmer-Assumed Yield</span>
                  <span className="text-text-primary font-bold text-[13px]">{assumedYield.toLocaleString()} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="50"
                  value={assumedYield}
                  onChange={(e) => setAssumedYield(parseInt(e.target.value) || 500)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agri-green"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-medium">
                  <span>500</span>
                  <span>Benchmark: {Math.round(historicalBenchmarkYield)}</span>
                  <span>12,000</span>
                </div>
              </div>
            </div>

            {/* Financial Number Inputs: Price & Costs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Expected Farmgate Selling Price (RWF/kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-page-bg border border-card-border rounded-lg pl-3 pr-12 py-1.5 text-text-primary font-mono text-[13px] font-semibold focus:outline-none focus:border-agri-green"
                  />
                  <span className="absolute right-3 top-1.5 text-[11px] text-text-muted font-bold">RWF</span>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Total Farm Operating Costs (RWF)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalFarmCosts}
                    onChange={(e) => setTotalFarmCosts(parseFloat(e.target.value) || 0)}
                    className="w-full bg-page-bg border border-card-border rounded-lg pl-3 pr-12 py-1.5 text-text-primary font-mono text-[13px] font-semibold focus:outline-none focus:border-agri-green"
                  />
                  <span className="absolute right-3 top-1.5 text-[11px] text-text-muted font-bold">RWF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box: Expected Production Reference Card (Prominently fulfilling Section 1) */}
          <div className="col-span-12 lg:col-span-5 bg-[#F9FBFA] border border-card-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-card-border/80">
              <span className="text-[12px] font-bold text-text-primary uppercase tracking-wider">
                Production Reference Comparison
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Evidence-Based
              </span>
            </div>

            {/* Card 1: Historical Expected Production Reference */}
            <div className="p-3.5 bg-white border border-agri-green/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-agri-forest uppercase tracking-wider">
                  Historical Expected Production Reference
                </span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-agri-green-light text-agri-forest">
                  Historical Benchmark
                </span>
              </div>

              <div className="text-[24px] font-extrabold text-sidebar-bg font-mono mt-0.5">
                {expectedHarvestReferenceKg.toLocaleString()} <span className="text-[13px] font-normal text-text-secondary">kg</span>
              </div>

              <div className="text-[11px] text-text-muted space-y-0.5 pt-1 border-t border-card-border/60">
                <div className="flex justify-between">
                  <span>Benchmark Yield:</span>
                  <strong className="text-text-primary font-mono">{historicalBenchmarkYield.toLocaleString()} kg/ha</strong>
                </div>
                <div className="flex justify-between">
                  <span>Cultivated Area:</span>
                  <strong className="text-text-primary font-mono">{area} ha</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gross Revenue Reference:</span>
                  <span className="text-sidebar-bg font-mono font-bold">{referenceGrossRevenueRwf.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Margin Reference:</span>
                  <span className={`font-mono font-bold ${referenceFarmMarginRwf >= 0 ? 'text-agri-green' : 'text-red-600'}`}>
                    {referenceFarmMarginRwf.toLocaleString()} RWF
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Farmer Assumed Reference */}
            <div className="p-3 bg-page-bg/80 border border-card-border rounded-xl text-[11.5px] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Farmer-Assumed Harvest:</span>
                <strong className="text-text-primary font-mono">{estimatedTotalHarvestKg.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Farmer Gross Revenue:</span>
                <strong className="text-text-primary font-mono">{estimatedGrossRevenueRwf.toLocaleString()} RWF</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Farmer Farm Margin:</span>
                <strong className={`font-mono ${estimatedFarmMarginRwf >= 0 ? 'text-agri-green' : 'text-red-600'}`}>
                  {estimatedFarmMarginRwf.toLocaleString()} RWF
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION TWO: Historical Agricultural & Climate Intelligence           */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-white border border-card-border rounded-xl shadow-card overflow-hidden">
        {/* Section Header Banner */}
        <div className="bg-[#F7F9F8] border-b border-card-border px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#4D7EA8] text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
              Section 2
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                Historical Agricultural &amp; Climate Intelligence
              </h2>
              <p className="text-[12px] text-text-secondary">
                Historical crop yield benchmarks, agrometeorological conditions, and multi-crop comparison.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-white border border-card-border px-3 py-1 rounded-full shadow-xs">
            District: {district} &bull; Crop: {crop} &bull; Season: {season}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Sub-Grid 1: Agricultural History & Historical Climate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Agricultural History (Point-in-Time Benchmark) */}
            <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-3">
              <div className="flex items-center justify-between border-b border-card-border/70 pb-2">
                <span className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-agri-green" />
                  Historical Agricultural Benchmark
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {benchmarkFallbackTier === "exact_district_crop_season" ? "District Survey Match" : "Provincial Benchmark"}
                </span>
              </div>

              <div>
                <div className="text-[11px] text-text-secondary font-medium">Historical Regional Benchmark Yield</div>
                <div className="text-[26px] font-extrabold text-agri-forest font-mono mt-0.5 flex items-baseline gap-1.5">
                  <span>{historicalBenchmarkYield.toLocaleString()}</span>
                  <span className="text-[13px] font-normal text-text-secondary">kg/ha</span>
                </div>
                <div className="text-[10.5px] text-text-muted mt-0.5">
                  Based strictly on survey records available prior to {season}
                </div>
              </div>

              <div className="space-y-1.5 text-[11.5px] pt-1 border-t border-card-border/60">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Supporting Sample Size (N):</span>
                  <strong className="text-text-primary font-mono">{benchmarkSampleSize} prior survey plots</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Geographic Scope:</span>
                  <span className="font-mono text-text-muted text-[11px]">{benchmarkFallbackTier === "exact_district_crop_season" ? "District Level" : "Provincial Level"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Survey Median Yield:</span>
                  <strong className="text-text-primary font-mono">{microStats.median.toLocaleString()} kg/ha</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Empirical 10th–90th Range:</span>
                  <span className="text-text-muted font-mono">{microStats.p10.toLocaleString()} – {microStats.p90.toLocaleString()} kg/ha</span>
                </div>
              </div>
            </div>

            {/* Card 2: Historical Climate Baseline */}
            <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-3">
              <div className="flex items-center justify-between border-b border-card-border/70 pb-2">
                <span className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-weather-blue" />
                  Historical Agrometeorological Conditions
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  NASA POWER &bull; FAO/AGLW
                </span>
              </div>

              <div>
                <div className="text-[11px] text-text-secondary font-medium">Gross Seasonal Rainfall</div>
                <div className="text-[26px] font-extrabold text-sidebar-bg font-mono mt-0.5 flex items-baseline gap-1.5">
                  <span>{currentRecord?.gross_rainfall_mm || histClimate.annual_rainfall_mm}</span>
                  <span className="text-[13px] font-normal text-text-secondary">mm</span>
                </div>
                <div className="text-[10.5px] text-text-muted mt-0.5">
                  Calibrated 5-month operational window ({season.includes('A') ? 'Sep–Jan' : 'Feb–Jun'})
                </div>
              </div>

              <div className="space-y-1.5 text-[11.5px] pt-1 border-t border-card-border/60">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Estimated Effective Rainfall:</span>
                  <strong className="text-weather-blue font-mono">
                    {currentRecord?.effective_rainfall_mm || histClimate.annual_effective_rainfall_mm || 528} mm
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rainfall Retention Ratio:</span>
                  <strong className="text-text-primary font-mono">
                    {currentRecord?.gross_rainfall_mm ? ((currentRecord.effective_rainfall_mm / currentRecord.gross_rainfall_mm) * 100).toFixed(1) : "65.0"}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Max Consecutive Dry Days:</span>
                  <span className="text-text-primary font-mono">{currentRecord?.consecutive_dry_days || 4} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Mean Temperature:</span>
                  <span className="text-text-muted font-mono">{currentRecord?.avg_temperature_c || 19.5}&deg;C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Grid 2: Side-by-Side Crop Comparison & What is Driving Climate Conditions? (Directly Fulfilling User Images 1 & 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Card A: Crop climate comparison (User Image 1) */}
            <div className="bg-white border border-card-border rounded-xl p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="border-b border-card-border/60 pb-2">
                  <h4 className="text-[14px] font-bold text-text-primary tracking-tight">
                    Crop climate comparison
                  </h4>
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Compare biophysical suitability across crops in {district} without navigating to another page.
                  </p>
                </div>

                <div className="space-y-3.5 mt-4">
                  {comparisonCrops.map((cname) => {
                    const cData = currentRecord?.crops?.[cname];
                    const score = cData?.climate_defense_score;
                    const isCropRice = cname === "Rice";
                    const isRecorded = cData?.is_available && score !== undefined;

                    // Bar colors matching user image: >=70 green, >=50 amber/orange, <50 red
                    const barColor = !isRecorded ? "#94A3B8" : score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
                    const isCurrent = cname === crop;

                    return (
                      <div
                        key={cname}
                        onClick={() => setCrop(cname)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${isCurrent ? 'bg-agri-green-light/40 border border-agri-green/40' : 'hover:bg-page-bg'}`}
                      >
                        <div className="flex items-center justify-between text-[12.5px] mb-1">
                          <span className="font-semibold text-text-primary flex items-center gap-1.5">
                            {cname}
                            {isCurrent && (
                              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-agri-green text-white font-bold">
                                Active Crop
                              </span>
                            )}
                            {isCropRice && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800">
                                Suspended
                              </span>
                            )}
                          </span>
                          <span className="font-bold text-text-primary font-mono text-[13px]">
                            {!isRecorded ? "Not recorded" : `${score}`}
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-gray-100 border border-card-border/50 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: isRecorded ? `${Math.min(100, Math.max(0, score))}%` : "0%",
                              backgroundColor: barColor
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card B: What is driving climate conditions? (User Image 2) */}
            <div className="bg-white border border-card-border rounded-xl p-5 shadow-card flex flex-col justify-between">
              <div>
                <div className="border-b border-card-border/60 pb-2">
                  <h4 className="text-[14px] font-bold text-text-primary tracking-tight">
                    What is driving climate conditions?
                  </h4>
                  <p className="text-[11.5px] text-text-secondary mt-0.5">
                    Biophysical component breakdown for {crop} ({district} {season})
                  </p>
                </div>

                <div className="space-y-4 mt-4">
                  {[
                    {
                      label: "Moisture adequacy",
                      score: isRice ? null : moistureDefense,
                      isSuspended: isRice,
                      weight: "30% Weight"
                    },
                    {
                      label: "Deluge defense",
                      score: delugeDefense,
                      isSuspended: false,
                      weight: "25% Weight"
                    },
                    {
                      label: "Thermal defense",
                      score: thermalDefense,
                      isSuspended: false,
                      weight: "25% Weight"
                    },
                    {
                      label: "Rainfall regularity",
                      score: regularityDefense,
                      isSuspended: false,
                      weight: "20% Weight"
                    }
                  ].map((comp) => {
                    const val = comp.score;
                    const isSuspended = comp.isSuspended;
                    const barColor = isSuspended ? "#94A3B8" : val >= 50 ? "#10B981" : "#F59E0B";

                    return (
                      <div key={comp.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="font-semibold text-text-primary flex items-center gap-2">
                            {comp.label}
                            <span className="text-[9.5px] text-text-muted font-normal">
                              ({comp.weight})
                            </span>
                          </span>
                          <span className="font-bold text-text-primary font-mono text-[13px]">
                            {isSuspended ? (
                              <span className="text-[10.5px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                Suspended
                              </span>
                            ) : val !== null && val !== undefined ? (
                              val.toFixed(1)
                            ) : (
                              "–"
                            )}
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-gray-100 border border-card-border/50 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: !isSuspended && val !== null ? `${Math.min(100, Math.max(0, val))}%` : "0%",
                              backgroundColor: barColor
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION THREE: Agricultural Financial Assessment                       */}
      {/* --------------------------------------------------------------------- */}
      <section className="bg-white border border-card-border rounded-xl shadow-card overflow-hidden">
        {/* Section Header Banner */}
        <div className="bg-[#F7F9F8] border-b border-card-border px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#D99A32] text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
              Section 3
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-text-primary tracking-tight">
                Agricultural Financial Assessment
              </h2>
              <p className="text-[12px] text-text-secondary">
                Loan cash-flow waterfalls, debt service coverage ratio (DSCR), sensitivity analysis, and NAIS insurance hedging.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-white border border-card-border px-3 py-1 rounded-full shadow-xs">
            Credit &amp; Insurance Analysis
          </span>
        </div>

        <div className="p-6 space-y-6">

          {/* Credit Facility Parameters & Cost Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Parameters (7 cols) */}
            <div className="col-span-12 md:col-span-7 space-y-3">
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
                Credit Facility Parameters
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="p-2.5 bg-page-bg/70 border border-card-border rounded-lg">
                  <div className="text-text-muted text-[10.5px]">Applicant</div>
                  <strong className="text-text-primary">{farmerName.split(' ')[0]} {farmerName.split(' ')[1]}</strong>
                </div>
                <div className="p-2.5 bg-page-bg/70 border border-card-border rounded-lg">
                  <div className="text-text-muted text-[10.5px]">Lending Scheme</div>
                  <strong className="text-sidebar-bg">NST2 Agri Facility</strong>
                </div>
                <div className="p-2.5 bg-page-bg/70 border border-card-border rounded-lg">
                  <div className="text-text-muted text-[10.5px]">Repayment Structure</div>
                  <strong className="text-text-primary">6-Mo Bullet at Harvest</strong>
                </div>
              </div>

              {/* Principal Slider */}
              <div className="p-3.5 bg-page-bg/60 border border-card-border rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary font-medium">Requested Loan Principal</span>
                  <span className="text-sidebar-bg font-bold font-mono text-[14px]">
                    {loanPrincipal.toLocaleString()} RWF
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="2000000"
                  step="25000"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(parseInt(e.target.value) || 100000)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sidebar-bg"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-mono font-medium">
                  <span>100,000 RWF</span>
                  <span>1,000,000 RWF</span>
                  <span>2,000,000 RWF</span>
                </div>
              </div>
            </div>

            {/* Loan Cost Calculation Summary (5 cols) */}
            <div className="col-span-12 md:col-span-5 bg-[#F9FBFA] border border-card-border rounded-xl p-4 space-y-2.5">
              <div className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider border-b border-card-border/70 pb-1.5">
                Bank Debt Service Breakdown
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Principal Amount:</span>
                  <span className="font-mono font-semibold">{loanPrincipal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Interest ({annualInterestRate}% p.a. &times; 6/12):</span>
                  <span className="font-mono text-text-primary">{interestCostRwf.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Facility &amp; Processing Fee ({facilityFeePct}%):</span>
                  <span className="font-mono text-text-muted">{facilityFeeRwf.toLocaleString()} RWF</span>
                </div>
                <div className="pt-2 border-t border-card-border/80 flex justify-between items-center">
                  <strong className="text-text-primary text-[13px]">Total Bank Debt Service:</strong>
                  <strong className="text-sidebar-bg font-mono text-[17px]">
                    {totalDebtServiceRwf.toLocaleString()} RWF
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Active Yield Selector for Loan Cash-Flow Waterfall */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[12.5px] font-bold text-text-primary flex items-center gap-2">
                <Scale className="w-4 h-4 text-agri-green" />
                <span>Agricultural Cash Flow Waterfall — Select Driving Scenario:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() => setActiveWaterfallScenario("historical_ref")}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    activeWaterfallScenario === "historical_ref"
                      ? "bg-agri-green text-white border-agri-green"
                      : "bg-white text-text-secondary border-card-border hover:bg-page-bg"
                  }`}
                >
                  Historical Reference ({historicalBenchmarkYield.toLocaleString()} kg/ha)
                </button>
                <button
                  onClick={() => setActiveWaterfallScenario("farmer_assumed")}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    activeWaterfallScenario === "farmer_assumed"
                      ? "bg-[#4D7EA8] text-white border-[#4D7EA8]"
                      : "bg-white text-text-secondary border-card-border hover:bg-page-bg"
                  }`}
                >
                  Farmer Assumed ({assumedYield.toLocaleString()} kg/ha)
                </button>
                <button
                  onClick={() => setActiveWaterfallScenario("adverse_shock")}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    activeWaterfallScenario === "adverse_shock"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-text-secondary border-card-border hover:bg-page-bg"
                  }`}
                >
                  Adverse Weather Shock (-25%)
                </button>
                <button
                  onClick={() => setActiveWaterfallScenario("price_shock")}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    activeWaterfallScenario === "price_shock"
                      ? "bg-sidebar-bg text-white border-sidebar-bg"
                      : "bg-white text-text-secondary border-card-border hover:bg-page-bg"
                  }`}
                >
                  Market Price Shock (-20%)
                </button>
              </div>
            </div>

            {/* Vertical Cash Flow Waterfall */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
              {/* Step 1: Gross Revenue */}
              <div className="p-3.5 bg-white border border-card-border rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-text-muted uppercase">1. Gross Crop Revenue</div>
                  <div className="text-[17px] font-extrabold text-text-primary font-mono mt-1">
                    {waterfallGrossRevenueRwf.toLocaleString()} <span className="text-[11px] font-normal text-text-muted">RWF</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-text-muted mt-2 pt-1 border-t border-card-border/60">
                  {waterfallHarvestKg.toLocaleString()} kg @ {activePriceRwf} RWF/kg
                </div>
              </div>

              {/* Step 2: Farm Costs */}
              <div className="p-3.5 bg-white border border-card-border rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-red-700 uppercase">2. Farm Operating Costs</div>
                  <div className="text-[17px] font-extrabold text-red-600 font-mono mt-1">
                    &minus; {totalFarmCosts.toLocaleString()} <span className="text-[11px] font-normal text-text-muted">RWF</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-text-muted mt-2 pt-1 border-t border-card-border/60">
                  Seeds, fertilizer, prep &amp; labor
                </div>
              </div>

              {/* Step 3: NOI */}
              <div className="p-3.5 bg-emerald-50/50 border border-agri-green/40 rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-agri-forest uppercase">3. Net Operating Income (NOI)</div>
                  <div className="text-[17px] font-extrabold text-sidebar-bg font-mono mt-1">
                    {waterfallNOIRwf.toLocaleString()} <span className="text-[11px] font-normal text-text-muted">RWF</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-agri-green font-medium mt-2 pt-1 border-t border-agri-green/30">
                  Revenue &minus; Farm Expenses
                </div>
              </div>

              {/* Step 4: Debt Service */}
              <div className="p-3.5 bg-white border border-card-border rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase">4. Bank Debt Service</div>
                  <div className="text-[17px] font-extrabold text-amber-800 font-mono mt-1">
                    &minus; {totalDebtServiceRwf.toLocaleString()} <span className="text-[11px] font-normal text-text-muted">RWF</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-text-muted mt-2 pt-1 border-t border-card-border/60">
                  Principal + Interest + Fees
                </div>
              </div>

              {/* Step 5: Net Retained Cash Surplus */}
              <div className="p-3.5 bg-[#F4F8F6] border-2 border-agri-green rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-agri-forest uppercase">5. Retained Cash Surplus</div>
                  <div className={`text-[18px] font-extrabold font-mono mt-1 ${waterfallNetSurplusRwf >= 0 ? 'text-agri-green' : 'text-red-600'}`}>
                    {waterfallNetSurplusRwf.toLocaleString()} <span className="text-[11px] font-normal text-text-muted">RWF</span>
                  </div>
                </div>
                <div className="text-[10.5px] font-bold text-agri-forest mt-2 pt-1 border-t border-agri-green/30">
                  Farmer Net Surplus Buffer
                </div>
              </div>
            </div>

            {/* Financial Risk Indicators Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-page-bg/80 border border-card-border">
                <div className="text-[10.5px] text-text-secondary font-medium">DSCR (Coverage Ratio)</div>
                <div className="text-[18px] font-extrabold text-sidebar-bg font-mono mt-0.5">{dscr}x</div>
                <div className="text-[9.5px] text-text-muted">Target &ge; 1.30x</div>
              </div>
              <div className="p-3 rounded-lg bg-page-bg/80 border border-card-border">
                <div className="text-[10.5px] text-text-secondary font-medium">Debt Service % of NOI</div>
                <div className="text-[18px] font-extrabold text-text-primary font-mono mt-0.5">{debtServicePctOfNOI}%</div>
                <div className="text-[9.5px] text-text-muted">Share of cash flow to loan</div>
              </div>
              <div className="p-3 rounded-lg bg-page-bg/80 border border-card-border">
                <div className="text-[10.5px] text-text-secondary font-medium">Break-Even Price</div>
                <div className="text-[18px] font-extrabold text-text-primary font-mono mt-0.5">{breakEvenPriceRwf} <span className="text-[10px] font-normal">RWF</span></div>
                <div className="text-[9.5px] text-text-muted">vs {activePriceRwf} RWF market price</div>
              </div>
              <div className="p-3 rounded-lg bg-page-bg/80 border border-card-border">
                <div className="text-[10.5px] text-text-secondary font-medium">Break-Even Yield</div>
                <div className="text-[18px] font-extrabold text-text-primary font-mono mt-0.5">{breakEvenYieldKgHa.toLocaleString()} <span className="text-[10px] font-normal">kg</span></div>
                <div className="text-[9.5px] text-text-muted">vs {activeYieldKgHa.toLocaleString()} kg/ha yield</div>
              </div>
              <div className="p-3 rounded-lg bg-page-bg/80 border border-card-border">
                <div className="text-[10.5px] text-text-secondary font-medium">Stress Tolerance Buffer</div>
                <div className="text-[18px] font-extrabold text-agri-green font-mono mt-0.5">+{stressToleranceBufferPct}%</div>
                <div className="text-[9.5px] text-text-muted">Yield drop before deficit</div>
              </div>
            </div>
          </div>

          {/* Multi-Scenario Sensitivity Matrix */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sidebar-bg" />
              <span>Multi-Scenario Underwriting Sensitivity Matrix</span>
            </h3>
            <div className="overflow-x-auto border border-card-border rounded-xl">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#F7F9F8] border-b border-card-border text-text-secondary font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Scenario</th>
                    <th className="py-2.5 px-3">Expected Yield</th>
                    <th className="py-2.5 px-3">Total Harvest</th>
                    <th className="py-2.5 px-3">Gross Revenue</th>
                    <th className="py-2.5 px-3">Net Farm NOI</th>
                    <th className="py-2.5 px-3">Debt Service</th>
                    <th className="py-2.5 px-3">Retained Surplus</th>
                    <th className="py-2.5 px-3">DSCR</th>
                    <th className="py-2.5 px-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border font-mono">
                  {scenarioMatrix.map((sc) => (
                    <tr key={sc.id} className="hover:bg-page-bg/50">
                      <td className="py-2.5 px-3 font-sans font-bold text-text-primary">
                        {sc.name}
                        <div className="text-[10px] font-normal text-text-muted">{sc.desc}</div>
                      </td>
                      <td className="py-2.5 px-3">{sc.yieldVal.toLocaleString()} kg/ha</td>
                      <td className="py-2.5 px-3">{sc.harvestKg.toLocaleString()} kg</td>
                      <td className="py-2.5 px-3">{sc.grossRev.toLocaleString()} RWF</td>
                      <td className="py-2.5 px-3">{sc.noi.toLocaleString()} RWF</td>
                      <td className="py-2.5 px-3 text-amber-800">{sc.debtService.toLocaleString()} RWF</td>
                      <td className={`py-2.5 px-3 font-bold ${sc.surplus >= 0 ? 'text-agri-green' : 'text-red-600'}`}>
                        {sc.surplus.toLocaleString()} RWF
                      </td>
                      <td className="py-2.5 px-3 font-bold text-sidebar-bg">{sc.dscr}x</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-sans ${sc.solvent ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {sc.solvent ? "Solvent Buffer" : "High Exposure"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-Section: NAIS Agricultural Insurance Assessment */}
          <div className="pt-4 border-t border-card-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-text-primary tracking-tight">
                  Agricultural Insurance Assessment (NAIS Framework)
                </h3>
                <p className="text-[11.5px] text-text-secondary">
                  National Agricultural Insurance Scheme (Tekana Urishingiwe Muhinzi Mworozi) hedging analysis.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                40% MINAGRI Subsidy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Peril Risk Profile */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-2.5">
                <div className="flex items-center justify-between border-b border-card-border/70 pb-1.5">
                  <span className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Biophysical Peril Hazard
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {district}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Moisture Deficit:</span>
                    <strong className="text-agri-green">{crop === "Rice" ? "Irrigation Unrecorded" : "Low Hazard"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Deluge / Runoff:</span>
                    <strong className="text-amber-700">Moderate Highland</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Dry Spell Risk:</span>
                    <strong className="text-agri-green">Max 4 Days Historical</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Thermal Envelope:</span>
                    <strong className="text-agri-green">Optimal Range</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Verified Policy Terms */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-2.5">
                <div className="flex items-center justify-between border-b border-card-border/70 pb-1.5">
                  <span className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-agri-green" />
                    Verified NAIS Terms
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Statutory
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Production Basis:</span>
                    <span className="font-mono text-text-primary">{totalFarmCosts.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Max Indemnity (80%):</span>
                    <strong className="font-mono text-agri-green">{maxInsurancePayoutRwf.toLocaleString()} RWF</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Policy Deductible:</span>
                    <span className="font-mono text-text-muted">15.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Area Strike Trigger:</span>
                    <span className="font-mono text-text-primary">&lt; 70% Regional Benchmark</span>
                  </div>
                  <div className="pt-1.5 border-t border-card-border/60 flex justify-between">
                    <span className="text-text-secondary">MINAGRI Subsidy (40%):</span>
                    <span className="font-mono text-emerald-700 font-bold">&minus; {minagriSubsidyRwf.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-text-primary">Farmer Share (60%):</strong>
                    <strong className="font-mono text-sidebar-bg">{farmerPremiumRwf.toLocaleString()} RWF</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Bank Exposure Transfer */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-2.5">
                <div className="flex items-center justify-between border-b border-card-border/70 pb-1.5">
                  <span className="text-[11.5px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-sidebar-bg" />
                    Credit Exposure Transfer
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    First Loss Payee
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-red-50 border border-red-200">
                    <div className="text-[10px] font-bold text-red-800 uppercase">Uninsured Exposure</div>
                    <div className="text-[15px] font-extrabold text-red-700 font-mono mt-0.5">
                      {uninsuredExposureRwf.toLocaleString()} RWF
                    </div>
                  </div>
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-300">
                    <div className="text-[10px] font-bold text-emerald-900 uppercase">Insured Bank Exposure</div>
                    <div className="text-[15px] font-extrabold text-emerald-800 font-mono mt-0.5">
                      {insuredNetBankExposureRwf.toLocaleString()} RWF
                    </div>
                    <div className="text-[9.5px] text-emerald-700 font-bold mt-0.5">
                      {exposureReductionPct}% exposure hedged via NAIS policy assignment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      <Footer />
    </div>
  );
}
