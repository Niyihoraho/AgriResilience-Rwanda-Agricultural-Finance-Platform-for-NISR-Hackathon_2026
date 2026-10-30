// frontend/src/views/CaseBView.jsx
import React, { useState, useMemo } from 'react';
import Footer from '../components/Footer';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import { CROP_CLIMATE_PROFILES } from '../data/climateData';
import { POINT_IN_TIME_BENCHMARKS } from '../data/pointInTimeBenchmarks';
import {
  Satellite,
  MapPin,
  X,
  HelpCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea
} from 'recharts';

export default function CaseBView({
  caseBData,
  setCaseBData = () => { },
  onNavigateToInsurance = () => { }
}) {
  // -------------------------------------------------------------
  // 1. SECTION ONE: Farm Profile State (Independent Demonstration)
  // -------------------------------------------------------------
  const [district, setDistrict] = useState(caseBData?.district || "Nyabihu");
  const [sector, setSector] = useState("Rambura Sector");
  const [crop, setCrop] = useState(caseBData?.crop || "Maize");
  const [season, setSeason] = useState(caseBData?.season || "2025A");
  const [farmerName, setFarmerName] = useState(caseBData?.farmerName || "Jean Bizimana (KABOKU Cooperative, Member #RW-882)");
  const [farmId] = useState("RWA-2025A-NYA-0428");
  const [area, setArea] = useState(caseBData?.area || 1.5);
  const [plantingDate, setPlantingDate] = useState("2024-09-18");
  const [currentGrowthStage, setCurrentGrowthStage] = useState(caseBData?.currentStage || "Grain Filling");
  const [selectedNdviSceneDate, setSelectedNdviSceneDate] = useState("2024-11-24");

  // In-Season Dry Spell Simulator (Interactive parameter driving demonstration alerts & curves)
  const [consecutiveDryDays, setConsecutiveDryDays] = useState(caseBData?.dryDays || 9);

  // -------------------------------------------------------------
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

  // -------------------------------------------------------------
  // Lookups & References
  // -------------------------------------------------------------
  const activeDistrict = RWANDA_DISTRICTS.find(d => d.name === district) || RWANDA_DISTRICTS[0];
  const cropProfile = CROP_CLIMATE_PROFILES[crop] || CROP_CLIMATE_PROFILES["Maize"];
  const isRice = crop === "Rice";

  // Point-in-time benchmark yield (Reference Baseline)
  const pitData = useMemo(() => {
    const dRec = POINT_IN_TIME_BENCHMARKS[district];
    if (!dRec) return null;
    const cRec = dRec[crop];
    if (!cRec) return null;
    return cRec[season] || cRec["2025A"] || Object.values(cRec)[0];
  }, [district, crop, season]);

  const historicalBenchmarkYield = pitData?.regional_benchmark_yield || 2482.9;

  // -------------------------------------------------------------
  // Section 2: Simulated Sentinel-2 NDVI Time-Series Data
  // Dynamically reacts to consecutiveDryDays:
  // If consecutiveDryDays > 7, NDVI trajectory dips below 5-year median during Flowering & Grain Filling
  // -------------------------------------------------------------
  const isWaterStressed = consecutiveDryDays >= 8;
  const isSevereDrought = consecutiveDryDays >= 15;

  const ndviTrajectoryData = useMemo(() => {
    // Stage baseline vs simulated current
    const stages = [
      { stage: "Emergence", day: 10, date: "Sep 28", baseline: 0.28, current: 0.29, status: "Normal" },
      { stage: "Early Vegetative", day: 25, date: "Oct 13", baseline: 0.44, current: 0.45, status: "Normal" },
      { stage: "Canopy Peak", day: 45, date: "Nov 02", baseline: 0.65, current: 0.64, status: "Normal" },
      {
        stage: "Flowering",
        day: 65,
        date: "Nov 22",
        baseline: 0.78,
        current: isSevereDrought ? 0.62 : isWaterStressed ? 0.69 : 0.77,
        status: isSevereDrought ? "Deficit" : isWaterStressed ? "Stressed" : "Normal"
      },
      {
        stage: "Grain Filling",
        day: 85,
        date: "Dec 12",
        baseline: 0.73,
        current: isSevereDrought ? 0.53 : isWaterStressed ? 0.64 : 0.72,
        status: isSevereDrought ? "Severe Stress" : isWaterStressed ? "Mild Deficit" : "Normal"
      },
      {
        stage: "Maturation",
        day: 105,
        date: "Jan 01",
        baseline: 0.52,
        current: isSevereDrought ? 0.40 : isWaterStressed ? 0.47 : 0.51,
        status: "Senescence"
      },
      {
        stage: "Harvest",
        day: 120,
        date: "Jan 16",
        baseline: 0.38,
        current: isSevereDrought ? 0.31 : isWaterStressed ? 0.35 : 0.37,
        status: "Maturity"
      }
    ];
    return stages;
  }, [isWaterStressed, isSevereDrought]);

  // Current Scene NDVI Snapshot (November 24, 2024 / Day 68)
  const currentNdviValue = isSevereDrought ? 0.59 : isWaterStressed ? 0.68 : 0.76;
  const baselineNdviExpected = 0.76;
  const ndviAnomalyPct = (((currentNdviValue - baselineNdviExpected) / baselineNdviExpected) * 100).toFixed(1);
  const vegetationConditionLabel = currentNdviValue >= 0.74
    ? "High Canopy Vigor (Optimal Chlorophyll)"
    : currentNdviValue >= 0.65
      ? "Moderate Canopy Vigor (Mild Moisture Stress)"
      : "Canopy Deficit Detected (Vegetative Retardation)";

  // Sub-parcel 5x5 Grid Pixel Simulation (1.5 ha parcel heterogeneity)
  const pixelGrid = useMemo(() => {
    const base = currentNdviValue;
    // 25 pixels across 1.5 ha with slight natural topographic variance
    const offsets = [
      0.02, 0.01, -0.01, 0.03, 0.01,
      -0.02, -0.04, -0.03, 0.00, 0.02,
      -0.03, -0.05, -0.06, -0.02, 0.01,
      0.01, -0.02, -0.04, -0.01, 0.03,
      0.02, 0.01, 0.00, 0.02, 0.04
    ];
    return offsets.map((off, idx) => {
      const val = Math.min(0.85, Math.max(0.35, parseFloat((base + off).toFixed(2))));
      return { id: idx, value: val };
    });
  }, [currentNdviValue]);

  // -------------------------------------------------------------
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header with Title & Provenance Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-card-border rounded-xl p-4 shadow-card">
        <div>
          <h1 className="text-[20px] font-extrabold text-sidebar-bg tracking-tight">
            Case B — After Planting
          </h1>
          <p className="text-[12.5px] text-text-secondary mt-0.5">
            In-season agricultural monitoring, satellite vegetation intelligence, weather tracking, and financial risk oversight.
          </p>
        </div>

        <button
          onClick={() => setIsRoadmapModalOpen(true)}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg border border-card-border bg-page-bg hover:bg-white text-text-primary text-[11.5px] font-semibold transition-all shadow-xs cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-agri-green" />
          <span>Data Provenance &amp; Satellite Roadmap</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION ONE: Farm Profile                                             */}
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
                Farm Profile &amp; Location Specification
              </h2>
              <p className="text-[12px] text-text-secondary">
                Monitored agricultural holding, geographic coordinates, and active crop phenology.
              </p>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-amber-800 bg-[#FEF3C7] border border-amber-200 px-3 py-1 rounded-full shadow-xs">
            Demonstration Record — Simulated Farm Profile
          </span>
        </div>

        <div className="p-6 grid grid-cols-12 gap-6 items-start">
          {/* Left Form: Field Metadata & Phenology Selectors */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* District */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  District (ADM2)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  {RWANDA_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} ({d.province})</option>
                  ))}
                </select>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Sector (ADM3)
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green"
                />
              </div>

              {/* Crop */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Monitored Crop
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  <option value="Maize">Maize (Zea mays)</option>
                  <option value="Beans">Beans (Phaseolus vulgaris)</option>
                  <option value="Irish Potato">Irish Potato (Solanum tuberosum)</option>
                  <option value="Cassava">Cassava (Manihot esculenta)</option>
                  <option value="Rice">Paddy Rice (Oryza sativa)</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Growing Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  <option value="2025A">Season 2025A (Sep 2024 – Jan 2025)</option>
                  <option value="2025B">Season 2025B (Feb 2025 – Jun 2025)</option>
                  <option value="2024A">Season 2024A</option>
                </select>
              </div>
            </div>

            {/* Holding Identification & Membership */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Farmer / Cooperative Producer
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-3 py-1.5 text-[12.5px] font-medium focus:outline-none focus:border-agri-green"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Cadastral Farm ID
                </label>
                <input
                  type="text"
                  value={farmId}
                  readOnly
                  className="w-full bg-page-bg/50 text-text-muted border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-mono"
                />
              </div>
            </div>

            {/* Growth Stage, Planting Date & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Planting Date
                </label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className="w-full bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-medium focus:outline-none focus:border-agri-green cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Current Growth Stage
                </label>
                <select
                  value={currentGrowthStage}
                  onChange={(e) => setCurrentGrowthStage(e.target.value)}
                  className="w-full bg-page-bg text-sidebar-bg font-bold border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  <option value="Emergence">Emergence (Day 10)</option>
                  <option value="Vegetative">Vegetative Vigor (Day 25)</option>
                  <option value="Canopy Peak">Canopy Peak (Day 45)</option>
                  <option value="Flowering & Tasseling">Flowering &amp; Tasseling (Day 65)</option>
                  <option value="Grain Filling">Grain Filling (Day 68 / 85)</option>
                  <option value="Maturation">Maturation (Day 105)</option>
                  <option value="Harvest">Maturity / Harvest (Day 120)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text-secondary mb-1">
                  Monitored Area (ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10.0"
                  value={area}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.5;
                    setArea(val);
                    setTotalFarmCosts(Math.round(val * 260000));
                  }}
                  className="w-full bg-page-bg text-text-primary font-mono font-bold border border-card-border rounded-lg px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:border-agri-green"
                />
              </div>
            </div>
          </div>

          {/* Right Box: Farm Location & Boundary Visualization */}
          <div className="col-span-12 lg:col-span-5 bg-[#F9FBFA] border border-card-border rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-card-border/80">
              <span className="text-[12px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-agri-green" />
                <span>Parcel Boundary &amp; Geolocation</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                1.5 ha Holding
              </span>
            </div>

            {/* SVG Visual Parcel Boundary Representation */}
            <div className="h-36 w-full rounded-xl bg-white border border-card-border/80 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-agri-green/5 to-transparent pointer-events-none" />

              {/* Mini SVG Boundary with vertices */}
              <svg className="w-full h-full" viewBox="0 0 260 90">
                {/* Simulated contour lines */}
                <path d="M 10 30 Q 130 15 250 35" fill="none" stroke="#E5E9E7" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 10 60 Q 130 45 250 65" fill="none" stroke="#E5E9E7" strokeWidth="1" strokeDasharray="3 3" />

                {/* Monitored Parcel Polygon */}
                <polygon
                  points="35,20 185,15 235,75 75,80"
                  fill="#EAF4EE"
                  stroke="#3D8C61"
                  strokeWidth="2"
                  strokeDasharray="none"
                />

                {/* Vertices */}
                <circle cx="35" cy="20" r="3.5" fill="#173D32" />
                <circle cx="185" cy="15" r="3.5" fill="#173D32" />
                <circle cx="235" cy="75" r="3.5" fill="#173D32" />
                <circle cx="75" cy="80" r="3.5" fill="#173D32" />

                {/* Parcel Center Label */}
                <text x="130" y="50" fill="#173D32" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Plot 14B ({area} ha)
                </text>
                <text x="130" y="62" fill="#6B7771" fontSize="8" textAnchor="middle">
                  {crop} &bull; {currentGrowthStage}
                </text>
              </svg>

              <div className="flex justify-between items-center text-[10px] text-text-muted pt-1 border-t border-card-border/60 z-10">
                <span>Lat: -1.6528&deg;, Lon: 29.5083&deg;</span>
                <span className="font-mono">Elevation: 2,240 m a.s.l.</span>
              </div>
            </div>

            {/* Geographical Summary Metadata */}
            <div className="space-y-1.5 text-[11.5px]">
              <div className="flex justify-between">
                <span className="text-text-secondary">Administrative Unit:</span>
                <strong className="text-text-primary">{district} &bull; {sector}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Soil Type / Topography:</span>
                <span className="text-text-muted">Andosol (Volcanic Ash) &bull; 14&deg; Terraced Slope</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Days Since Planting:</span>
                <strong className="text-sidebar-bg font-mono">68 Days Elapsed (of 120)</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION TWO: Satellite Vegetation Monitoring (NDVI)                   */}
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
                Satellite Vegetation Monitoring (NDVI)
              </h2>
              <p className="text-[12px] text-text-secondary">
                Sentinel-2 multispectral surface reflectance time-series, canopy chlorophyll absorption, and parcel vigor distribution.
              </p>
            </div>
          </div>
          <span className="text-[10.5px] font-bold text-blue-900 bg-blue-100 border border-blue-200 px-3 py-1 rounded-full shadow-xs">
            Demonstration Data — Simulated NDVI
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Top 4 KPI Observation Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Current Mean NDVI */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-xs">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Current Parcel NDVI</span>
                <span className="text-[10px] text-agri-green font-bold">Sentinel-2</span>
              </div>
              <div className="text-[26px] font-extrabold text-sidebar-bg font-mono mt-0.5">
                {currentNdviValue.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-text-muted mt-0.5">
                5-Yr Expected Baseline: <strong>{baselineNdviExpected.toFixed(2)}</strong>
              </div>
            </div>

            {/* KPI 2: Canopy Anomaly */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-xs">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Canopy Anomaly</span>
                <span className="text-[10px] text-text-muted font-bold">Deviation</span>
              </div>
              <div className={`text-[26px] font-extrabold font-mono mt-0.5 ${parseFloat(ndviAnomalyPct) < 0 ? 'text-amber-accent' : 'text-agri-green'}`}>
                {parseFloat(ndviAnomalyPct) > 0 ? `+${ndviAnomalyPct}%` : `${ndviAnomalyPct}%`}
              </div>
              <div className="text-[10.5px] text-text-muted mt-0.5">
                Relative to phenological norm
              </div>
            </div>

            {/* KPI 3: Vigor Classification */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-xs">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Canopy Condition</span>
                <span className="text-[10px] text-sidebar-bg font-bold">Status</span>
              </div>
              <div className="text-[14px] font-bold text-text-primary mt-1 tracking-tight leading-snug">
                {vegetationConditionLabel.split('(')[0]}
              </div>
              <div className="text-[10.5px] text-text-muted mt-0.5">
                {vegetationConditionLabel.includes('(') ? `(${vegetationConditionLabel.split('(')[1]}` : "Within tolerance"}
              </div>
            </div>

            {/* KPI 4: Acquisition Metadata */}
            <div className="bg-white border border-card-border rounded-xl p-4 shadow-xs">
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex justify-between">
                <span>Observation Date</span>
                <span className="text-[10px] text-agri-green font-bold">SCL Cloud-Free</span>
              </div>
              <div className="text-[15px] font-extrabold text-sidebar-bg mt-1">
                {selectedNdviSceneDate}
              </div>
              <div className="text-[10.5px] text-text-muted mt-0.5">
                Sensor: 10m Sentinel-2 MSI
              </div>
            </div>
          </div>

          {/* Sub-Grid: 5x5 Spatial Pixel Grid (Left) + Seasonal Trajectory Chart (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 5x5 Parcel Pixel Grid (5 cols) */}
            <div className="col-span-12 lg:col-span-5 bg-white border border-card-border rounded-xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-card-border/70 pb-2">
                <div>
                  <h4 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
                    Parcel Canopy Pixel Grid
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    10m x 10m multispectral pixel resolution across {area} ha holding
                  </p>
                </div>
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-page-bg border border-card-border text-text-muted">
                  25 Pixels
                </span>
              </div>

              {/* 5x5 Grid Display */}
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-page-bg rounded-xl border border-card-border">
                {pixelGrid.map((px) => {
                  const val = px.value;
                  const bgClass = val >= 0.72
                    ? "bg-[#3D8C61] text-white"
                    : val >= 0.65
                      ? "bg-[#86B49C] text-white"
                      : val >= 0.58
                        ? "bg-[#F59E0B] text-white"
                        : "bg-[#EF4444] text-white";

                  return (
                    <div
                      key={px.id}
                      className={`h-11 rounded-lg ${bgClass} flex flex-col items-center justify-center font-mono text-[10.5px] font-bold shadow-2xs transition-transform hover:scale-105 cursor-pointer`}
                      title={`Sub-pixel #${px.id + 1}: NDVI ${val}`}
                    >
                      <span>{val}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grid Legend */}
              <div className="flex items-center justify-between text-[10px] text-text-muted pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#3D8C61]" /> &ge; 0.72 Vigor
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#86B49C]" /> 0.65–0.71 Normal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]" /> 0.58–0.64 Stress
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" /> &lt; 0.58 Deficit
                </span>
              </div>

              <div className="pt-2 border-t border-card-border/60 text-[10.5px] text-text-muted leading-relaxed">
                Mean NDVI: <strong>{currentNdviValue.toFixed(2)}</strong> &bull; Spatial Std Dev: <strong>0.038</strong> &bull; Lowest vegetative vigor concentrated along western terraced shoulder.
              </div>
            </div>

            {/* Right Column: Seasonal Trajectory Chart (7 cols) */}
            <div className="col-span-12 lg:col-span-7 bg-white border border-card-border rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-card-border/70 pb-2">
                <div>
                  <h4 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
                    Seasonal NDVI Trajectory vs. 5-Year Regional Baseline
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Cloud-masked 10m multispectral normalized difference vegetation index
                  </p>
                </div>
                <span className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  5-Day Revisit
                </span>
              </div>

              {/* Recharts Canvas */}
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ndviTrajectoryData}
                    margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
                    <XAxis
                      dataKey="stage"
                      tick={{ fill: '#6B7771', fontSize: 10, fontWeight: 500 }}
                      axisLine={{ stroke: '#E5E9E7' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0.2, 0.9]}
                      ticks={[0.2, 0.4, 0.6, 0.8]}
                      tick={{ fill: '#6B7771', fontSize: 10 }}
                      axisLine={{ stroke: '#E5E9E7' }}
                      tickLine={false}
                      tickFormatter={(v) => v.toFixed(2)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E9E7',
                        borderRadius: '8px',
                        fontSize: '11.5px'
                      }}
                      formatter={(val, name) => [val.toFixed(2), name]}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ paddingBottom: '8px', fontSize: '10.5px' }}
                      iconType="circle"
                    />

                    {/* Shaded critical moisture window during flowering & grain filling */}
                    <ReferenceArea
                      x1="Flowering"
                      x2="Grain Filling"
                      fill="#FEF3C7"
                      fillOpacity={0.4}
                      strokeOpacity={0}
                    />

                    {/* Baseline Line */}
                    <Line
                      type="monotone"
                      dataKey="baseline"
                      name="5-Yr Regional Median"
                      stroke="#A3BFB5"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#A3BFB5' }}
                    />

                    {/* Current Season Line */}
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Current Season (Simulated)"
                      stroke={isWaterStressed ? "#D97706" : "#3D8C61"}
                      strokeWidth={3}
                      dot={{ r: 4, fill: isWaterStressed ? "#D97706" : "#173D32", stroke: '#FFFFFF', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-text-muted pt-1">
                <span>Shaded yellow zone indicates the <strong>Critical Moisture Deficit Sensitivity Window</strong>.</span>
                <span className="font-semibold text-sidebar-bg">ESA Copernicus Calibration</span>
              </div>
            </div>
          </div>
        </div>
      </section>{/* --------------------------------------------------------------------- */}
      {/* MODAL: Data Provenance, Categories & Future Satellite Roadmap         */}
      {/* --------------------------------------------------------------------- */}
      {isRoadmapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-card-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-card-border bg-[#F7F9F8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Satellite className="w-5 h-5 text-sidebar-bg" />
                <div>
                  <h3 className="text-[16px] font-bold text-text-primary">
                    Data Categories, Provenance &amp; Satellite Roadmap
                  </h3>
                  <p className="text-[11.5px] text-text-secondary">
                    Transparent demarcation of real data, demonstration simulations, and future integrations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoadmapModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-[12px] leading-relaxed text-text-secondary">
              {/* Category A: Real Data */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-1.5">
                <div className="flex items-center justify-between border-b border-card-border pb-1">
                  <strong className="text-text-primary text-[12.5px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Category A: Existing Real Project Data
                  </strong>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11.5px] text-text-secondary">
                  <li><strong>NISR SAS Microdata:</strong> Point-in-time regional benchmark yields and plot distributions.</li>
                  <li><strong>NASA POWER Daily Weather:</strong> Calibrated daily precipitation and thermal observations.</li>
                  <li><strong>Stage 1 Agrometeorological Baseline:</strong> Verified FAO-56 ETc crop constants (Maize 520 mm, Beans 380 mm, Potato 440 mm, Cassava 450 mm, Rice 950 mm) and FAO/AGLW regression formulas.</li>
                </ul>
              </div>

              {/* Category B: Simulated Demonstration Data */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-1.5">
                <div className="flex items-center justify-between border-b border-card-border pb-1">
                  <strong className="text-text-primary text-[12.5px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Category B: Simulated Demonstration Records
                  </strong>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                    Demonstration Only
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11.5px] text-text-secondary">
                  <li><strong>Farm Cadastre &amp; Coordinates:</strong> Example 1.5 ha holding boundary and elevation profile.</li>
                  <li><strong>Sentinel-2 NDVI Observations:</strong> Simulated 5x5 sub-pixel grids and seasonal phenological curves.</li>
                  <li><strong>In-Season Monitoring Alerts:</strong> Simulated dry spell sensitivity and early-warning covenants.</li>
                  <li><strong>Illustrative Loan &amp; Policy IDs:</strong> Simulated banking and insurance portfolio numbers.</li>
                </ul>
              </div>

              {/* Category C: Future Integrations Roadmap */}
              <div className="border border-card-border rounded-xl p-4 bg-[#FBFDFB] space-y-1.5">
                <div className="flex items-center justify-between border-b border-card-border pb-1">
                  <strong className="text-text-primary text-[12.5px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Category C: Planned Future Integrations
                  </strong>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                    Roadmap
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11.5px] text-text-secondary">
                  <li><strong>Automated Earth Observation Pipelines:</strong> Operational ingestion of cloud-screened Sentinel-2 MSI L2A bottom-of-atmosphere surface reflectance.</li>
                  <li><strong>Rwanda Space Cooperation:</strong> Potential future data partnership subject to satellite availability, ground receiving station infrastructure, spectral band suitability, and institutional access agreements (no operational Rwanda Space API is currently claimed).</li>
                  <li><strong>Calibrated In-Season Yield Models:</strong> Future machine-learning models trained on aligned planting dates, ground weather sensors, satellite time-series, and certified harvest cuts.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-card-border bg-page-bg flex justify-end">
              <button
                onClick={() => setIsRoadmapModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-sidebar-bg text-white text-[12px] font-bold cursor-pointer"
              >
                Close Provenance Report
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
