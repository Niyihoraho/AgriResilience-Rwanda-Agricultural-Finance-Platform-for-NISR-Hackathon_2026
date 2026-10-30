// frontend/src/components/KpiRow.jsx
import React from 'react';
import { 
  Leaf, 
  Wheat, 
  CloudRain, 
  MapPin, 
  Satellite, 
  Database 
} from 'lucide-react';

export default function KpiRow({ kpis }) {
  const cards = [
    {
      title: "Total Production",
      value: kpis.totalProduction || "48,230 t",
      subtitle: kpis.productionSubtitle || "Season: 2024B | Crop: Maize",
      source: "Source: NISR",
      icon: Leaf,
      iconColor: "text-agri-green",
      iconBg: "bg-agri-green-light",
    },
    {
      title: "Average Yield",
      value: kpis.avgYield || "3.2 t/ha",
      subtitle: kpis.yieldSubtitle || "Season: 2024B | Crop: Maize",
      source: "Source: NISR",
      icon: Wheat,
      iconColor: "text-[#3D8C61]",
      iconBg: "bg-[#EBF7EE]",
    },
    {
      title: "Total Rainfall",
      value: kpis.totalRainfall || "842 mm",
      subtitle: kpis.rainfallSubtitle || "Season: 2024B | District: Nyabihu",
      source: "Source: Meteo Rwanda",
      icon: CloudRain,
      iconColor: "text-weather-blue",
      iconBg: "bg-weather-blue-light",
    },
    {
      title: "Areas Covered",
      value: kpis.areasCovered || "8 districts",
      subtitle: kpis.areasSubtitle || "Production & weather data",
      source: "Source: NISR / Meteo Rwanda",
      icon: MapPin,
      iconColor: "text-purple-accent",
      iconBg: "bg-purple-light",
    },
    {
      title: "Valid Satellite Obs.",
      value: kpis.validSatelliteObs || "23",
      subtitle: kpis.satelliteSubtitle || "NDVI observations",
      source: "Source: Sentinel-2",
      icon: Satellite,
      iconColor: "text-sidebar-bg",
      iconBg: "bg-[#E0EDE7]",
    },
    {
      title: "Data Completeness",
      value: kpis.dataCompleteness || "92%",
      subtitle: kpis.completenessSubtitle || "Across selected datasets",
      source: "Last refresh: Apr 28, 2025",
      icon: Database,
      iconColor: "text-text-secondary",
      iconBg: "bg-[#F1F5F9]",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3.5 mb-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white border border-card-border rounded-xl p-3.5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between min-h-[128px]"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-8 h-8 rounded-full ${c.iconBg} ${c.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-[12px] font-semibold text-text-secondary leading-tight">
                  {c.title}
                </div>
              </div>
              <div className="text-[23px] font-extrabold text-text-primary tracking-tight leading-none mt-1">
                {c.value}
              </div>
            </div>

            <div className="mt-2 pt-1">
              <div className="text-[11px] text-text-secondary truncate">
                {c.subtitle}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {c.source}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

