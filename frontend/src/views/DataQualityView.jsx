// frontend/src/views/DataQualityView.jsx
import React from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import HorizontalComparisonBar from '../components/HorizontalComparisonBar';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Satellite, 
  CloudRain, 
  DollarSign, 
  FileCheck,
  RefreshCw,
  Layers
} from 'lucide-react';

export default function DataQualityView() {
  const sources = [
    {
      name: "NISR Seasonal Agricultural Survey (SAS Microdata)",
      provider: "National Institute of Statistics of Rwanda (NISR)",
      coverage: "All 30 Districts (Connected SAS Microdata 2019, 2024, 2025: 109,963 verified plot records)",
      frequency: "Biannual (Official Seasonal Surveys A & B)",
      variables: "Cultivated area (ha), total harvest (kg), crop dispositions, empirical irrigation status (s4q15/s4q14), stratum (hillside vs marshland)",
      completenessPct: 98.6,
      quality: "109,963 Verified Plot Records · 0 Unhandled Duplicates · Verified Marshland Irrigation Telemetry",
      badge: "Connected NISR SAS",
      icon: <Database className="w-4 h-4 text-agri-green" />
    },
    {
      name: "NASA POWER & Meteo Rwanda Station Grid",
      provider: "NASA Langley Research Center / Meteo Rwanda calibration",
      coverage: "Rwanda National Spatial Grid (0.5° × 0.5° resolution)",
      frequency: "Daily Gridded Observations",
      variables: "Seasonal precipitation (mm), consecutive dry days, diurnal temperature, heat stress",
      completenessPct: 100.0,
      quality: "100% Coverage · Physical boundary filters (0–2,500 mm rain, 10–38°C)",
      badge: "Meteorological",
      icon: <CloudRain className="w-4 h-4 text-weather-blue" />
    },
    {
      name: "Sentinel-2 Multispectral Earth Observation",
      provider: "European Space Agency (ESA) / Copernicus Open Access",
      coverage: "10m Spatial Resolution across Rwanda territory",
      frequency: "5-day revisit cycle",
      variables: "NDVI early season, mid-season peak, harvest senescence, Vegetation Health Index",
      completenessPct: 96.2,
      quality: "Cloud-masked SCL band · Spline-interpolated NDVI phenology curves",
      badge: "Satellite EO",
      icon: <Satellite className="w-4 h-4 text-emerald-600" />
    },
    {
      name: "MINAGRI e-Soko Market Information",
      provider: "Ministry of Agriculture and Animal Resources",
      coverage: "Key regional rural and urban commodity markets",
      frequency: "Weekly market monitoring",
      variables: "Farmgate prices, wholesale prices, retail prices, transport cost differentials",
      completenessPct: 92.5,
      quality: "Economic sanity checks (Retail >= Wholesale >= Farmgate)",
      badge: "Market Economics",
      icon: <DollarSign className="w-4 h-4 text-amber-accent" />
    }
  ];

  const validationRules = [
    {
      name: "Biological Crop Plausibility Filter",
      domain: "Agronomic Yields",
      rule: "Yield per hectare must satisfy 0 < Yield ≤ 12,000 kg/ha for cereals and pulses. Outliers flagged for survey supervisor audit.",
      status: "Enforced · 0 Violations"
    },
    {
      name: "Atmospheric & Meteorological Bounds",
      domain: "Climate Observations",
      rule: "Precipitation must satisfy 0 ≤ Rain ≤ 2,500 mm/season; Daily temperature bounded between 10.0°C and 38.0°C.",
      status: "Enforced · 100% Valid"
    },
    {
      name: "Economic Market Sanity Filter",
      domain: "e-Soko Commodity Prices",
      rule: "Checks that Retail Price ≥ Wholesale Price ≥ Farmgate Price. Inverted prices trigger temporal interpolation.",
      status: "Enforced · Clean Lineage"
    },
    {
      name: "Satellite SCL Cloud Masking",
      domain: "Sentinel-2 Imagery",
      rule: "Pixel Quality flags (Scene Classification Layer) filter out dense clouds, cirrus, and cloud shadows before computing NDVI.",
      status: "Enforced · Spline Interpolated"
    }
  ];

  const completenessComparisonItems = sources.map(s => ({
    label: s.name,
    value: s.completenessPct,
    formattedValue: `${s.completenessPct}% Valid`,
    pct: s.completenessPct,
    color: s.completenessPct === 100 ? "#173D32" : s.completenessPct >= 95 ? "#3D8C61" : "#4D7EA8",
    tag: s.badge
  }));

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <TopBar 
        title="Data Sources & Quality" 
        subtitle="Complete transparency into data lineage, update frequencies, coverage, and validation audits across the 4 fused data pillars." 
      />

      {/* 2. Institutional Governance Notice */}
      <div className="bg-white border border-card-border rounded-xl p-4 shadow-card flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-agri-green-light text-agri-green flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-[12.5px] leading-relaxed text-text-secondary">
          <strong className="text-text-primary font-semibold">Strict Data Governance Standard:</strong> AgriResilience enforces end-to-end data provenance. 
          Every indicator surfaced in credit and insurance decision support is corroborated by official Rwandan institutions, physical bounds, and biological plausibility constraints.
        </div>
      </div>

      {/* 3. Reusable Horizontal Comparison Bar: Data Completeness (Matching Image 2 Style) */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card">
        <HorizontalComparisonBar
          title="Data Pillar Completeness & Refresh Audits"
          subtitle="Proportion of verified, uncorrupted records across the 4 integrated data streams:"
          items={completenessComparisonItems}
          variant="light"
        />
      </div>

      {/* 4. The 4 Fused Data Pillars Catalog Cards */}
      <div className="space-y-3">
        {sources.map((s, i) => (
          <div key={i} className="bg-white border border-card-border rounded-xl p-4 shadow-card space-y-2.5">
            <div className="flex items-center justify-between border-b border-card-border/60 pb-2">
              <div className="flex items-center gap-2">
                {s.icon}
                <h4 className="text-[14px] font-bold text-sidebar-bg">{s.name}</h4>
              </div>
              <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-md bg-agri-green-light text-agri-forest">
                {s.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] text-text-secondary">
              <div><strong>Provider:</strong> {s.provider}</div>
              <div><strong>Coverage:</strong> {s.coverage}</div>
              <div><strong>Update Frequency:</strong> {s.frequency}</div>
              <div><strong>Variables:</strong> {s.variables}</div>
            </div>

            <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-agri-forest font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-agri-green" />
                <span>{s.quality}</span>
              </div>
              <span className="text-text-muted">Last Audit: Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Data Validation & Cleaning Pipeline Rules */}
      <div className="bg-white border border-card-border rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-card-border/70 pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-text-primary">
              Automated Data Validation &amp; Cleaning Pipeline Rules
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Deterministic boundary gates preventing flawed or corrupted data from reaching underwriting models
            </p>
          </div>
          <span className="text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
            4 Boundary Gates
          </span>
        </div>

        <div className="overflow-x-auto border border-card-border/80 rounded-lg">
          <table className="w-full text-[12px] border-collapse bg-white">
            <thead>
              <tr className="bg-page-bg/80 border-b border-card-border text-text-secondary font-semibold text-left">
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Validation Gate</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Domain</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Deterministic Rule Specification</th>
                <th className="py-2.5 px-3 uppercase tracking-wider text-[11px] text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F2]">
              {validationRules.map((r, i) => (
                <tr key={i} className="hover:bg-page-bg/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-sidebar-bg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-green shrink-0" />
                    <span>{r.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary font-medium">
                    {r.domain}
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    {r.rule}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-agri-green-light text-agri-forest">
                      {r.status}
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
