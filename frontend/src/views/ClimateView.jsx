// frontend/src/views/ClimateView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import PastClimateTab from '../components/climate/PastClimateTab';
import CurrentClimateTab from '../components/climate/CurrentClimateTab';
import ClimateOutlookTab from '../components/climate/ClimateOutlookTab';
import ForecastVsActualTab from '../components/climate/ForecastVsActualTab';
import ClimateMethodologyDrawer from '../components/climate/ClimateMethodologyDrawer';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import { 
  CROP_CLIMATE_PROFILES, 
  HISTORICAL_DISTRICT_SEASON_RECORDS 
} from '../data/climateData';
import { 
  Clock, 
  Radio, 
  Compass, 
  Scale, 
  HelpCircle, 
  MapPin, 
  Sprout,
  Calendar,
  Layers
} from 'lucide-react';

export default function ClimateView({
  defaultDistrict = "Gasabo",
  defaultCrop = "Maize",
  defaultSeason = "2021A"
}) {
  const [activeTab, setActiveTab] = useState("past"); // "past", "current", "outlook", "forecast_vs_actual"
  const [district, setDistrict] = useState(defaultDistrict);
  const [crop, setCrop] = useState(defaultCrop);
  const [historicalSeason, setHistoricalSeason] = useState(defaultSeason || "2021A");
  const [outlookPeriod, setOutlookPeriod] = useState("2025A");
  const [verificationCycle, setVerificationCycle] = useState("2025A");
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Discover available historical seasons for the selected district
  const districtHistory = HISTORICAL_DISTRICT_SEASON_RECORDS[district] || {};
  const availableHistoricalSeasons = Object.keys(districtHistory);

  // Available outlook periods
  const outlookPeriods = [
    { value: "2025A", label: "Season 2025A (Published Bulletin)" },
    { value: "2025B", label: "Season 2025B (Unpublished)" },
    { value: "2026A", label: "Season 2026A (Unpublished)" }
  ];

  // Available forecast verification seasons
  const verificationSeasons = [
    { value: "2025A", label: "Season 2025A (Verified & Archived)" },
    { value: "2024B", label: "Season 2024B (Unarchived)" },
    { value: "2024A", label: "Season 2024A (Unarchived)" },
    { value: "2023B", label: "Season 2023B (Unarchived)" }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header with Title & Methodology Toggle Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-extrabold text-sidebar-bg tracking-tight">
            Climate Intelligence &amp; Agroclimatic Risk
          </h2>
          <p className="text-[12.5px] text-text-secondary mt-0.5">
            Understand the past. Monitor the present. Prepare for the future.
          </p>
        </div>

        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg border border-card-border bg-white hover:bg-page-bg text-text-primary text-[11.5px] font-semibold transition-all shadow-xs cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-agri-green" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* 2. Primary 4-Pill Navigation & Shared Context Filter Bar */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card space-y-3">
        {/* Row 1: The 4 Core Views Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-page-bg p-1.5 rounded-xl border border-card-border">
          <button
            onClick={() => setActiveTab("past")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeTab === "past"
                ? "bg-white text-sidebar-bg shadow-sm border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-agri-green shrink-0" />
            <div className="text-left">
              <div>Past Climate</div>
              <div className="text-[10px] font-normal text-text-muted">What happened?</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("current")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeTab === "current"
                ? "bg-white text-weather-blue shadow-sm border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-weather-blue shrink-0" />
            <div className="text-left">
              <div>Current Climate</div>
              <div className="text-[10px] font-normal text-text-muted">What is happening?</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("outlook")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeTab === "outlook"
                ? "bg-white text-emerald-800 shadow-sm border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <div className="text-left">
              <div>Climate Outlook</div>
              <div className="text-[10px] font-normal text-text-muted">What may happen?</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("forecast_vs_actual")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
              activeTab === "forecast_vs_actual"
                ? "bg-white text-amber-800 shadow-sm border border-card-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="text-left">
              <div>Forecast vs. Actual</div>
              <div className="text-[10px] font-normal text-text-muted">How did it perform?</div>
            </div>
          </button>
        </div>

        {/* Row 2: Synchronized Context Filters */}
        <div className="flex flex-wrap items-center justify-between pt-1 border-t border-card-border/60 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter 1: District */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-agri-green" />
                District:
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1 text-[12px] font-bold focus:outline-none focus:border-agri-green cursor-pointer"
              >
                {RWANDA_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>{d.name} ({d.province})</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Crop */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Sprout className="w-3 h-3 text-agri-green" />
                Crop:
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1 text-[12px] font-bold focus:outline-none focus:border-agri-green cursor-pointer"
              >
                {Object.keys(CROP_CLIMATE_PROFILES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Context-Aware Period / Season */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-agri-green" />
                {activeTab === "past" ? "Historical Season:" : activeTab === "current" ? "Observation Period:" : activeTab === "outlook" ? "Forecast Period:" : "Verification Cycle:"}
              </label>

              {activeTab === "past" ? (
                <select
                  value={historicalSeason}
                  onChange={(e) => setHistoricalSeason(e.target.value)}
                  className="bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1 text-[12px] font-bold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  {availableHistoricalSeasons.map((scode) => (
                    <option key={scode} value={scode}>
                      {scode.slice(0, 4)} Season {scode.slice(4)}
                    </option>
                  ))}
                </select>
              ) : activeTab === "current" ? (
                <span className="text-[11.5px] font-bold text-weather-blue bg-weather-blue-light px-2.5 py-1 rounded-md border border-weather-blue/20">
                  September 2026 (Latest closed observation)
                </span>
              ) : activeTab === "outlook" ? (
                <select
                  value={outlookPeriod}
                  onChange={(e) => setOutlookPeriod(e.target.value)}
                  className="bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1 text-[12px] font-bold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  {outlookPeriods.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={verificationCycle}
                  onChange={(e) => setVerificationCycle(e.target.value)}
                  className="bg-page-bg text-text-primary border border-card-border rounded-lg px-2.5 py-1 text-[12px] font-bold focus:outline-none focus:border-agri-green cursor-pointer"
                >
                  {verificationSeasons.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="text-[11px] font-medium text-text-muted">
            {activeTab === "past" && <span>{availableHistoricalSeasons.length} Completed Survey Seasons Discovered</span>}
            {activeTab === "current" && <span>Source: NASA POWER Monthly API v2.0</span>}
            {activeTab === "outlook" && <span>Issuing Authority: Meteo Rwanda</span>}
            {activeTab === "forecast_vs_actual" && <span>Immutable Snapshot Verification</span>}
          </div>
        </div>
      </div>

      {/* 3. Active Tab View Content */}
      {activeTab === "past" && (
        <PastClimateTab 
          district={district}
          crop={crop}
          seasonCode={historicalSeason}
          onSelectSeasonCode={setHistoricalSeason}
        />
      )}

      {activeTab === "current" && (
        <CurrentClimateTab 
          district={district}
        />
      )}

      {activeTab === "outlook" && (
        <ClimateOutlookTab 
          district={district}
          crop={crop}
          selectedPeriod={outlookPeriod}
          onSelectPeriod={setOutlookPeriod}
        />
      )}

      {activeTab === "forecast_vs_actual" && (
        <ForecastVsActualTab 
          district={district}
          crop={crop}
          selectedSeason={verificationCycle}
          onSelectSeason={setVerificationCycle}
        />
      )}

      {/* 4. Collapsible Methodology Drawer */}
      <ClimateMethodologyDrawer 
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <Footer />
    </div>
  );
}
