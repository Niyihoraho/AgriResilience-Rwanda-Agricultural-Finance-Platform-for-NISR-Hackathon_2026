// frontend/src/components/GeographicSummary.jsx
import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';
import RwandaMiniMap from './RwandaMiniMap';
import { DISTRICT_PRODUCTION_TABLE } from '../data/mockData';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';

export default function GeographicSummary() {
  const [selectedDistrict, setSelectedDistrict] = useState("Nyabihu");

  // Lookup selected district details
  const activeDistrictInfo = RWANDA_DISTRICTS.find(d => d.name === selectedDistrict);

  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b border-card-border/60 pb-2.5">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">
            Geographic Summary
          </h3>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Official Rwanda ADM2 district boundaries &amp; agricultural performance
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
          <MapPin className="w-3.5 h-3.5 text-agri-green" />
          <span>30 Districts Active</span>
        </div>
      </div>

      {/* Content: Real Map on left (6 cols), Table on right (6 cols) */}
      <div className="grid grid-cols-12 gap-4 items-center grow">
        {/* Real Rwanda SVG Map on left (6 cols) */}
        <div className="col-span-6 h-full flex items-center justify-center">
          <RwandaMiniMap 
            selectedDistrict={selectedDistrict} 
            onSelectDistrict={(name) => setSelectedDistrict(name)} 
          />
        </div>

        {/* Table on right (6 cols) */}
        <div className="col-span-6 h-full flex flex-col justify-center">
          {/* Active District Quick Pill */}
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-text-secondary">
              Selected: <strong className="text-agri-forest">{selectedDistrict}</strong>
            </span>
            {activeDistrictInfo && (
              <span className="text-[10px] text-agri-green bg-agri-green-light px-2 py-0.5 rounded font-semibold">
                {activeDistrictInfo.province} Province
              </span>
            )}
          </div>

          <div className="overflow-hidden border border-card-border/80 rounded-lg shadow-xs">
            <table className="w-full text-[12px] border-collapse bg-white">
              <thead>
                <tr className="bg-page-bg/80 border-b border-card-border text-text-secondary text-left font-semibold">
                  <th className="py-2 px-3 font-semibold text-[11px] uppercase tracking-wider">District</th>
                  <th className="py-2 px-3 font-semibold text-right text-[11px] uppercase tracking-wider">Production (t)</th>
                  <th className="py-2 px-3 font-semibold text-right text-[11px] uppercase tracking-wider">Avg. Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F4F2]">
                {DISTRICT_PRODUCTION_TABLE.map((row, i) => {
                  const isRowSelected = selectedDistrict === row.district;
                  return (
                    <tr 
                      key={i} 
                      onClick={() => row.district !== 'Others' && setSelectedDistrict(row.district)}
                      className={`cursor-pointer transition-colors ${
                        isRowSelected 
                          ? 'bg-agri-green-light/50 font-bold border-l-2 border-agri-green' 
                          : 'hover:bg-page-bg/60'
                      }`}
                    >
                      <td className="py-1.5 px-3 font-medium text-text-primary flex items-center gap-1.5">
                        {row.status === 'missing' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-accent shrink-0" />
                        ) : isRowSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-agri-green shrink-0" />
                        ) : null}
                        <span className={isRowSelected ? 'text-agri-forest font-bold' : ''}>
                          {row.district}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-right text-text-primary font-medium">
                        {row.production ? row.production.toLocaleString() : '–'}
                      </td>
                      <td className="py-1.5 px-3 text-right text-text-primary font-medium">
                        {row.yield ? `${row.yield.toFixed(1)} t/ha` : '–'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
