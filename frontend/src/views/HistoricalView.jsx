// frontend/src/views/HistoricalView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import HorizontalComparisonBar from '../components/HorizontalComparisonBar';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';
import {
  HISTORICAL_CLIMATE_PROFILES,
  SEASONAL_CLIMATE_FORECASTS
} from '../data/climateData';
import { 
  HISTORICAL_SEASONS_DETAILED, 
  CROP_OPTIONS 
} from '../data/mockData';
import { 
  TrendingUp, 
  Layers, 
  CloudRain, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Info,
  Maximize2,
  BarChart3
} from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';

export default function HistoricalView() {
  const [district, setDistrict] = useState("Nyabihu");
  const [crop, setCrop] = useState("Maize");
  const [seasonRange, setSeasonRange] = useState("all"); // "all", "recent", "early"

  // Filter seasons based on range
  const filteredSeasons = HISTORICAL_SEASONS_DETAILED.filter(s => {
    if (seasonRange === "recent") return s.season.startsWith("2023") || s.season.startsWith("2024");
    if (seasonRange === "early") return s.season.startsWith("2020") || s.season.startsWith("2021") || s.season.startsWith("2022");
    return true;
  });

  // Calculate dynamic aggregate metrics
  const totalProduction = filteredSeasons.reduce((acc, s) => acc + s.production, 0);
  const avgYield = (filteredSeasons.reduce((acc, s) => acc + s.yield, 0) / (filteredSeasons.length || 1)).toFixed(2);
  const avgHarvestedArea = Math.round(filteredSeasons.reduce((acc, s) => acc + s.harvestedArea, 0) / (filteredSeasons.length || 1));
  const avgRainfall = Math.round(filteredSeasons.reduce((acc, s) => acc + s.rainfall, 0) / (filteredSeasons.length || 1));
  const avgEffectiveRainfall = Math.round(filteredSeasons.reduce((acc, s) => acc + (s.effectiveRainfall || s.rainfall * 0.65), 0) / (filteredSeasons.length || 1));
  const histClimate = HISTORICAL_CLIMATE_PROFILES[district] || HISTORICAL_CLIMATE_PROFILES["Nyabihu"];

  // Benchmark comparison items for HorizontalComparisonBar
  const maxProd = Math.max(...filteredSeasons.map(s => s.production), 1);
  const benchmarkComparisonItems = [
    {
      label: "Peak Production Season (2022B)",
      value: 57100,
      formattedValue: "57,100 t (3.6 t/ha)",
      pct: 100,
      color: "#173D32",
      tag: "Post-Drought High"
    },
    {
      label: "Recent Benchmark Season (2024B)",
      value: 48230,
      formattedValue: "48,230 t (3.5 t/ha)",
      pct: (48230 / 57100) * 100,
      color: "#3D8C61",
      tag: "Current Baseline"
    },
    {
      label: "Average Seasonal Output (10-Season Mean)",
      value: Math.round(totalProduction / filteredSeasons.length),
      formattedValue: `${Math.round(totalProduction / filteredSeasons.length).toLocaleString()} t (${avgYield} t/ha)`,
      pct: ((totalProduction / filteredSeasons.length) / 57100) * 100,
      color: "#4D7EA8",
      tag: "Long-Term Norm"
    },
    {
      label: "Severe Drought Shock Season (2022A)",
      value: 43200,
      formattedValue: "43,200 t (2.9 t/ha)",
      pct: (43200 / 57100) * 100,
      color: "#D99A32",
      tag: "-16% Climate Shock"
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Top Header */}
      <TopBar 
        title="Historical Production & Weather" 
        subtitle="Multi-season production volume, crop yield per hectare, harvested area, and meteorological baseline across Rwanda." 
      />

      {/* 2. Institutional Analysis Rules & Governance Notice */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-agri-green-light text-agri-green flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-[12.5px] leading-relaxed text-text-secondary">
          <strong className="text-text-primary font-semibold">Stage 1 Effective Rainfall &amp; Evidence Principles:</strong> This module transparently distinguishes gross precipitation from <strong>estimated effective rainfall</strong> using the approved FAO/AGLW regression model across 5-month operational windows (Season A: Sep–Jan; Season B: Feb–Jun). It separates total harvest volume (tonnes) from localized land productivity (yield per hectare), aligns station observations with crop water demand (ETc), and explicitly flags microdata anomalies (e.g. 2024B Rulindo survey omission). Correlation is never interpreted as proof of individual farmer causation.
        </div>
      </div>

      {/* 3. Contextual Filter Bar */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-text-primary">
            <Filter className="w-4 h-4 text-agri-green" />
            <span>Filters:</span>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold bg-page-bg text-agri-forest focus:outline-none focus:border-agri-green"
            >
              {RWANDA_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>{d.name} ({d.province})</option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold bg-page-bg text-agri-forest focus:outline-none focus:border-agri-green"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Time Horizon Filter */}
          <div>
            <select
              value={seasonRange}
              onChange={(e) => setSeasonRange(e.target.value)}
              className="border border-card-border rounded-lg px-2.5 py-1.5 text-[12px] font-semibold bg-page-bg text-agri-forest focus:outline-none focus:border-agri-green"
            >
              <option value="all">All 10 Seasons (2020A – 2024B)</option>
              <option value="recent">Recent 4 Seasons (2023 – 2024)</option>
              <option value="early">Baseline 6 Seasons (2020 – 2022)</option>
            </select>
          </div>
        </div>

        <div className="text-[11.5px] font-medium text-text-secondary">
          Displaying <strong className="text-agri-forest">{filteredSeasons.length}</strong> monitored seasons &bull; NISR Microdata
        </div>
      </div>

      {/* 4. Four Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Production */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Total Production ({crop})
          </div>
          <div className="text-[24px] font-extrabold text-sidebar-bg mt-1 tracking-tight">
            {totalProduction.toLocaleString()} <span className="text-[13px] font-normal text-text-secondary">tonnes</span>
          </div>
          <div className="text-[10.5px] text-text-muted mt-1">Across selected {filteredSeasons.length} seasons</div>
        </div>

        {/* Avg. Yield */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Average Productivity (Yield)
          </div>
          <div className="text-[24px] font-extrabold text-agri-green mt-1 tracking-tight">
            {avgYield} <span className="text-[13px] font-normal text-text-secondary">t/ha</span>
          </div>
          <div className="text-[10.5px] text-text-muted mt-1">Multi-season survey average</div>
        </div>

        {/* Harvested Area */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Mean Harvested Area
          </div>
          <div className="text-[24px] font-extrabold text-text-primary mt-1 tracking-tight">
            {avgHarvestedArea.toLocaleString()} <span className="text-[13px] font-normal text-text-secondary">ha/season</span>
          </div>
          <div className="text-[10.5px] text-text-muted mt-1">Cultivated land utilization</div>
        </div>

        {/* Historical Climate Stress */}
        <div className="bg-white border border-card-border rounded-xl p-4 shadow-card">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Historical Climate Stress
          </div>
          <div className="text-[24px] font-extrabold text-weather-blue mt-1 tracking-tight flex items-baseline gap-1.5">
            <span>{histClimate.historical_stress_score}</span>
            <span className="text-[13px] font-normal text-text-secondary">/ 100</span>
          </div>
          <div className="text-[10.5px] text-text-muted mt-1 flex justify-between">
            <span>{histClimate.historical_stress_tier}</span>
            <span className="font-semibold text-text-secondary">{avgRainfall}mm gross &bull; {avgEffectiveRainfall}mm eff</span>
          </div>
        </div>
      </div>

      {/* 5. Horizontal Benchmark Comparison (Matching Image 2 Style) */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card">
        <HorizontalComparisonBar
          title="Multi-Season Production Benchmark Comparison"
          subtitle="Relative comparison of peak, typical baseline, long-term norm, and climate shock harvest volumes:"
          items={benchmarkComparisonItems}
          variant="light"
        />
      </div>

      {/* 6. Dual Deep Charts (Row of 2 Cards) */}
      <div className="grid grid-cols-12 gap-4">
        {/* Chart 1: Production Volume vs Harvested Area (6 cols) */}
        <div className="col-span-12 xl:col-span-6 bg-white border border-card-border rounded-xl p-5 shadow-card h-[370px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 border-b border-card-border/70 pb-2">
            <div>
              <h4 className="text-[14px] font-bold text-text-primary">
                Production Volume (tonnes) vs. Harvested Area (ha)
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Evaluates whether harvest expansion is driven by area extension or yield efficiency
              </p>
            </div>
            <span className="text-[10.5px] font-semibold text-agri-green bg-agri-green-light px-2 py-0.5 rounded">
              NISR SAS Microdata
            </span>
          </div>

          <div className="w-full flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredSeasons} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
                <XAxis dataKey="season" tick={{ fill: '#6B7771', fontSize: 10.5, fontWeight: 500 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} dy={4} />
                <YAxis yAxisId="left" width={45} tick={{ fill: '#6B7771', fontSize: 10.5 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" width={45} domain={[12000, 18000]} ticks={[12000, 14000, 16000, 18000]} tick={{ fill: '#4D7EA8', fontSize: 10.5 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E7', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val, name) => [
                    name === "Production (t)" ? `${val.toLocaleString()} t` : `${val.toLocaleString()} ha`,
                    name
                  ]}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 500 }} iconType="circle" />
                <Bar yAxisId="left" dataKey="production" name="Production (t)" fill="#173D32" radius={[3, 3, 0, 0]} maxBarSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="harvestedArea" name="Harvested Area (ha)" stroke="#4D7EA8" strokeWidth={2.5} dot={{ r: 4, fill: '#4D7EA8' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Yield Trajectory & Seasonal Rainfall Dynamics (6 cols) */}
        <div className="col-span-12 xl:col-span-6 bg-white border border-card-border rounded-xl p-5 shadow-card h-[370px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 border-b border-card-border/70 pb-2">
            <div>
              <h4 className="text-[14px] font-bold text-text-primary">
                Yield Productivity (t/ha) &amp; Seasonal Precipitation (mm)
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Displays gross rainfall vs. FAO/AGLW estimated effective moisture against yield
              </p>
            </div>
            <span className="text-[10.5px] font-semibold text-weather-blue bg-weather-blue-light px-2 py-0.5 rounded">
              Meteo Rwanda &bull; FAO/AGLW Stage 1
            </span>
          </div>

          <div className="w-full flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredSeasons} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
                <XAxis dataKey="season" tick={{ fill: '#6B7771', fontSize: 10.5, fontWeight: 500 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} dy={4} />
                <YAxis yAxisId="left" width={40} domain={[0, 1100]} ticks={[0, 300, 600, 900]} tick={{ fill: '#4D7EA8', fontSize: 10.5 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} tickFormatter={(v) => `${v}mm`} />
                <YAxis yAxisId="right" orientation="right" width={35} domain={[2.0, 4.2]} ticks={[2.0, 2.5, 3.0, 3.5, 4.0]} tick={{ fill: '#3D8C61', fontSize: 10.5 }} axisLine={{ stroke: '#E5E9E7' }} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E9E7', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val, name) => [
                    name.includes('Yield') ? `${val} t/ha` : `${val} mm`,
                    name
                  ]}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 500 }} iconType="circle" />
                <Bar yAxisId="left" dataKey="rainfall" name="Gross Rain (mm)" fill="#93C5FD" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar yAxisId="left" dataKey="effectiveRainfall" name="Est. Eff Rain (mm)" fill="#2563EB" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="yield" name="Yield (t/ha)" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#173D32', stroke: '#FFFFFF', strokeWidth: 1.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7. Comprehensive Season-by-Season Comparison Table */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-text-primary">
              Season-by-Season Historical Comparison &amp; Data Gap Log
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Microdata records with physical boundary limits, sample sizes, and documented anomaly notices
            </p>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
            10 Survey Rounds
          </span>
        </div>

        <div className="overflow-x-auto border border-card-border/80 rounded-lg">
          <table className="w-full text-[12px] border-collapse bg-white">
            <thead>
              <tr className="bg-page-bg/80 border-b border-card-border text-text-secondary font-semibold text-left">
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Season</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Production (t)</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Yield (t/ha)</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Harvested Area</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Gross Rain (mm)</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Est. Eff Rain (mm)</th>
                <th className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">Temp (°C)</th>
                <th className="py-2.5 px-3 text-center uppercase tracking-wider text-[11px]">Observations</th>
                <th className="py-2.5 px-3 text-left uppercase tracking-wider text-[11px]">Field / Anomaly Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F2]">
              {filteredSeasons.map((row, i) => (
                <tr key={i} className="hover:bg-page-bg/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-sidebar-bg flex items-center gap-1.5">
                    {row.status === "shock" || row.status === "missing_rulindo" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-agri-green shrink-0" />
                    )}
                    <span>{row.season}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-text-primary">
                    {row.production.toLocaleString()} t
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-agri-forest">
                    {row.yield.toFixed(1)} t/ha
                  </td>
                  <td className="py-2.5 px-3 text-right text-text-secondary">
                    {row.harvestedArea.toLocaleString()} ha
                  </td>
                  <td className="py-2.5 px-3 text-right text-weather-blue font-medium">
                    {row.rainfall} mm
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                    {row.effectiveRainfall || Math.round(row.rainfall * 0.65)} mm
                  </td>
                  <td className="py-2.5 px-3 text-right text-text-secondary">
                    {row.temperature}°C
                  </td>
                  <td className="py-2.5 px-3 text-center text-text-muted">
                    {row.obs} farms
                  </td>
                  <td className="py-2.5 px-3 text-left text-[11.5px]">
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium ${
                      row.status === "shock" 
                        ? "bg-amber-100 text-amber-900 font-semibold" 
                        : row.status === "missing_rulindo"
                          ? "bg-slate-100 text-slate-800 font-semibold"
                          : "text-text-secondary"
                    }`}>
                      {row.note}
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
