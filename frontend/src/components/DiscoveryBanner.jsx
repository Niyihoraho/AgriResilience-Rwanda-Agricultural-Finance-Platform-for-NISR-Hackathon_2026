// frontend/src/components/DiscoveryBanner.jsx
import React from 'react';
import { Leaf, TrendingUp, Calendar, Satellite } from 'lucide-react';

export default function DiscoveryBanner({ onSelectTab }) {
  return (
    <div className="bg-white border border-card-border rounded-xl p-4 mb-4 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-agri-green-light flex items-center justify-center text-agri-green shrink-0">
          <Leaf className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-text-primary leading-tight">
            What do you want to explore next?
          </h4>
          <p className="text-[12px] text-text-secondary mt-0.5">
            Choose a section from the menu or use the quick actions above to dive deeper into the data.
          </p>
        </div>
      </div>

      {/* 3 Action Tiles */}
      <div className="grid grid-cols-3 gap-3">
        {/* Tile 1 */}
        <button
          onClick={() => onSelectTab('historical')}
          className="flex items-center gap-3 p-3 rounded-lg border border-card-border bg-[#F8FAF9] hover:bg-white hover:border-agri-green hover:shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-white border border-card-border flex items-center justify-center text-text-primary group-hover:text-agri-green shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-text-primary group-hover:text-agri-green">
              Understand trends
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">
              See how production and weather have changed over time.
            </div>
          </div>
        </button>

        {/* Tile 2 */}
        <button
          onClick={() => onSelectTab('case-a')}
          className="flex items-center gap-3 p-3 rounded-lg border border-card-border bg-[#F8FAF9] hover:bg-white hover:border-agri-green hover:shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-white border border-card-border flex items-center justify-center text-text-primary group-hover:text-agri-green shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-text-primary group-hover:text-agri-green">
              Plan ahead
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">
              Use historical data to assess next season's potential.
            </div>
          </div>
        </button>

        {/* Tile 3 */}
        <button
          onClick={() => onSelectTab('case-b')}
          className="flex items-center gap-3 p-3 rounded-lg border border-card-border bg-[#F8FAF9] hover:bg-white hover:border-agri-green hover:shadow-xs transition-all text-left group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-white border border-card-border flex items-center justify-center text-text-primary group-hover:text-agri-green shrink-0">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-text-primary group-hover:text-agri-green">
              Monitor current crops
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">
              Track vegetation and weather for planted fields.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

