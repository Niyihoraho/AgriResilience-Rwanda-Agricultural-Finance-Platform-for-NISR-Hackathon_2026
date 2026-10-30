// frontend/src/components/FilterBar.jsx
import React from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { 
  DISTRICT_OPTIONS, 
  CROP_OPTIONS, 
  SEASON_OPTIONS, 
  YEAR_OPTIONS 
} from '../data/mockData';

export default function FilterBar({ filters, onChangeFilter, onReset }) {
  return (
    <div className="bg-white border border-card-border rounded-xl px-5 py-3 mb-4 shadow-card">
      <div className="grid grid-cols-6 gap-3 items-end">
        {/* District */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            District
          </label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => onChangeFilter('district', e.target.value)}
              className="w-full appearance-none bg-white border border-card-border rounded-lg px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-hidden focus:border-agri-green pr-8 cursor-pointer shadow-2xs"
            >
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Sector
          </label>
          <div className="relative">
            <select
              value={filters.sector}
              onChange={(e) => onChangeFilter('sector', e.target.value)}
              className="w-full appearance-none bg-white border border-card-border rounded-lg px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-hidden focus:border-agri-green pr-8 cursor-pointer shadow-2xs"
            >
              <option value="All Sectors">All Sectors</option>
              <option value="Bigogwe">Bigogwe</option>
              <option value="Jenda">Jenda</option>
              <option value="Mukamira">Mukamira</option>
              <option value="Rurembo">Rurembo</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Crop */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Crop
          </label>
          <div className="relative">
            <select
              value={filters.crop}
              onChange={(e) => onChangeFilter('crop', e.target.value)}
              className="w-full appearance-none bg-white border border-card-border rounded-lg px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-hidden focus:border-agri-green pr-8 cursor-pointer shadow-2xs"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Season */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Season
          </label>
          <div className="relative">
            <select
              value={filters.season}
              onChange={(e) => onChangeFilter('season', e.target.value)}
              className="w-full appearance-none bg-white border border-card-border rounded-lg px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-hidden focus:border-agri-green pr-8 cursor-pointer shadow-2xs"
            >
              {SEASON_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Year
          </label>
          <div className="relative">
            <select
              value={filters.year}
              onChange={(e) => onChangeFilter('year', e.target.value)}
              className="w-full appearance-none bg-white border border-card-border rounded-lg px-3 py-2 text-[13px] font-medium text-text-primary focus:outline-hidden focus:border-agri-green pr-8 cursor-pointer shadow-2xs"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-text-primary bg-white hover:bg-agri-green-light hover:text-agri-green hover:border-agri-green border border-card-border rounded-lg transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

