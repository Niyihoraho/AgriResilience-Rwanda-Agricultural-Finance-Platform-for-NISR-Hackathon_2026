// frontend/src/components/KeyObservations.jsx
import React from 'react';
import { Lightbulb, ArrowUp, Droplets, AlertTriangle, ChevronRight } from 'lucide-react';

export default function KeyObservations({ crop = "Maize", district = "Nyabihu", season = "2024B" }) {
  return (
    <div className="bg-white border border-card-border rounded-xl p-4 shadow-card h-full flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-text-primary" />
          <h3 className="text-[14.5px] font-bold text-text-primary">
            Key Observations
          </h3>
        </div>
        <button className="text-[12px] font-semibold text-agri-green hover:underline">
          View all
        </button>
      </div>

      {/* Observations List */}
      <div className="space-y-2.5 my-auto">
        {/* Item 1: Positive Production Growth */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-page-bg transition-colors cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-agri-green-light text-agri-green flex items-center justify-center shrink-0 mt-0.5">
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
          <div className="grow min-w-0">
            <div className="text-[12.5px] font-bold text-text-primary leading-tight">
              {crop} production increased by 12%
            </div>
            <div className="text-[11.5px] text-text-secondary mt-0.5 leading-snug">
              Compared to 2023B, total production increased from 43,000 t to 48,230 t.
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              Source: NISR &nbsp;|&nbsp; District: {district} &nbsp;|&nbsp; Period: 2023B vs {season}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors shrink-0 mt-1" />
        </div>

        {/* Item 2: Rainfall Anomaly */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-page-bg transition-colors cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-weather-blue-light text-weather-blue flex items-center justify-center shrink-0 mt-0.5">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <div className="grow min-w-0">
            <div className="text-[12.5px] font-bold text-text-primary leading-tight">
              Rainfall was 18% below average
            </div>
            <div className="text-[11.5px] text-text-secondary mt-0.5 leading-snug">
              Total rainfall during {season} was 842 mm, compared to 1,028 mm (5-year average).
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              Source: Meteo Rwanda &nbsp;|&nbsp; Period: {season}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors shrink-0 mt-1" />
        </div>

        {/* Item 3: Missing Data Warning */}
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-page-bg transition-colors cursor-pointer group">
          <div className="w-6 h-6 rounded-full bg-amber-light text-amber-accent flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="grow min-w-0">
            <div className="text-[12.5px] font-bold text-text-primary leading-tight">
              Missing data for some areas
            </div>
            <div className="text-[11.5px] text-text-secondary mt-0.5 leading-snug">
              Production data missing for 2 districts (Rulindo, Musanze) for {season}.
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              Source: NISR &nbsp;|&nbsp; Period: {season}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors shrink-0 mt-1" />
        </div>
      </div>
    </div>
  );
}

