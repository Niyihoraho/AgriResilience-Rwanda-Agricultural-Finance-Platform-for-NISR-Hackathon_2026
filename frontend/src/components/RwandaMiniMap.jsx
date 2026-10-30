// frontend/src/components/RwandaMiniMap.jsx
import React, { useState } from 'react';
import { RWANDA_DISTRICTS } from '../data/rwandaDistrictsData';

// Color scale mapping matching the NISR agricultural benchmarks & user mockup
function getDistrictFill(d, isHovered, isSelected, layer = "production") {
  if (d.status === 'missing' || d.production === null) {
    return isHovered ? '#94A3B8' : '#CBD5E1'; // Slate grey for data gaps
  }

  if (layer === "rainfall") {
    const rain = d.rainfall || 800;
    if (rain >= 900) return isHovered ? '#1E3A8A' : '#2563EB';
    if (rain >= 820) return isHovered ? '#2563EB' : '#3B82F6';
    if (rain >= 750) return isHovered ? '#60A5FA' : '#93C5FD';
    return isHovered ? '#93C5FD' : '#BFDBFE';
  }

  if (layer === "resilience") {
    const score = d.resilienceScore || 70;
    if (score >= 80) return isHovered ? '#0F3F22' : '#14532D';
    if (score >= 68) return isHovered ? '#2F724E' : '#3D8C61';
    if (score >= 60) return isHovered ? '#D97706' : '#F59E0B';
    return isHovered ? '#DC2626' : '#EF4444';
  }

  if (layer === "yield") {
    const yld = d.yield || 2.5;
    if (yld >= 3.2) return isHovered ? '#0F3F22' : '#14532D';
    if (yld >= 2.8) return isHovered ? '#2F724E' : '#3D8C61';
    if (yld >= 2.3) return isHovered ? '#6EE7B7' : '#86EFAC';
    return isHovered ? '#FDE047' : '#FEF08A';
  }

  // Default: Production volume
  if (d.production > 10000) {
    return isHovered ? '#0F3F22' : '#14532D'; // Deep forest green
  }
  if (d.production > 5000) {
    return isHovered ? '#2F724E' : '#3D8C61'; // Agriculture green
  }
  if (d.production > 2000) {
    return isHovered ? '#6EE7B7' : '#86EFAC'; // Light green
  }
  return isHovered ? '#FDE047' : '#FEF08A';     // Pale yellow
}

export default function RwandaMiniMap({ 
  selectedDistrict = "Nyabihu", 
  onSelectDistrict = () => {},
  layer = "production",
  heightClass = "h-[270px]"
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Key districts to display default on-map labels (matching user reference mockup)
  const labeledDistricts = ['Nyabihu', 'Musanze', 'Rulindo', 'Gicumbi', 'Kayonza', 'Huye'];

  return (
    <div className={`relative w-full ${heightClass} flex items-center justify-center select-none overflow-hidden`}>
      {/* 1. Map Legend Overlay (Top-Left) */}
      <div className="absolute top-2 left-2 text-[10px] space-y-1 bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-card-border shadow-xs z-10">
        <div className="font-bold text-text-primary text-[10.5px] pb-0.5 border-b border-card-border/60">
          {layer === "rainfall" ? "Precipitation (mm)" : layer === "resilience" ? "Resilience Score" : layer === "yield" ? "Avg. Yield (t/ha)" : "Production (t)"}
        </div>

        {layer === "rainfall" ? (
          <>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB] shrink-0"></span>
              <span className="text-text-secondary font-medium">&gt; 900 mm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6] shrink-0"></span>
              <span className="text-text-secondary font-medium">820 – 900 mm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#93C5FD] shrink-0"></span>
              <span className="text-text-secondary font-medium">750 – 819 mm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#BFDBFE] shrink-0"></span>
              <span className="text-text-secondary font-medium">&lt; 750 mm</span>
            </div>
          </>
        ) : layer === "resilience" ? (
          <>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#14532D] shrink-0"></span>
              <span className="text-text-secondary font-medium">High (&ge; 80)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3D8C61] shrink-0"></span>
              <span className="text-text-secondary font-medium">Moderate (68–79)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] shrink-0"></span>
              <span className="text-text-secondary font-medium">Developing (60–67)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444] shrink-0"></span>
              <span className="text-text-secondary font-medium">Vulnerable (&lt; 60)</span>
            </div>
          </>
        ) : layer === "yield" ? (
          <>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#14532D] shrink-0"></span>
              <span className="text-text-secondary font-medium">&ge; 3.2 t/ha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3D8C61] shrink-0"></span>
              <span className="text-text-secondary font-medium">2.8 – 3.1 t/ha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#86EFAC] shrink-0"></span>
              <span className="text-text-secondary font-medium">2.3 – 2.7 t/ha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FEF08A] shrink-0"></span>
              <span className="text-text-secondary font-medium">&lt; 2.3 t/ha</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#14532D] shrink-0"></span>
              <span className="text-text-secondary font-medium">&gt; 10,000</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3D8C61] shrink-0"></span>
              <span className="text-text-secondary font-medium">5,001 – 10,000</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#86EFAC] shrink-0"></span>
              <span className="text-text-secondary font-medium">2,001 – 5,000</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FEF08A] border border-amber-200/50 shrink-0"></span>
              <span className="text-text-secondary font-medium">&le; 2,000</span>
            </div>
          </>
        )}

        <div className="flex items-center gap-1.5 pt-0.5 border-t border-card-border/60">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#CBD5E1] shrink-0"></span>
          <span className="text-text-secondary font-medium">No data</span>
        </div>
      </div>

      {/* 2. North Arrow (Top-Right) */}
      <div className="absolute top-2 right-4 flex flex-col items-center text-text-primary font-bold z-10">
        <span className="text-[11px] leading-tight text-agri-forest">▲</span>
        <span className="text-[9.5px] font-extrabold tracking-widest text-text-secondary">N</span>
      </div>

      {/* 3. Scaled SVG Map with all 30 official Rwanda districts */}
      <svg 
        viewBox="0 0 500 440" 
        className="w-full h-full max-h-[360px] drop-shadow-xs"
      >
        <defs>
          <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Render District Boundaries */}
        <g>
          {RWANDA_DISTRICTS.map((d) => {
            const isHovered = hoveredDistrict?.name === d.name;
            const isSelected = selectedDistrict === d.name;
            const fillColor = getDistrictFill(d, isHovered, isSelected, layer);

            return (
              <path
                key={d.name}
                d={d.path}
                fill={fillColor}
                stroke={isSelected ? '#FFFFFF' : isHovered ? '#FFFFFF' : '#FFFFFF'}
                strokeWidth={isSelected ? 3.0 : isHovered ? 2.0 : 1.2}
                strokeLinejoin="round"
                className="cursor-pointer transition-colors duration-150"
                style={{
                  filter: isSelected ? 'url(#map-glow)' : 'none',
                }}
                onMouseEnter={() => setHoveredDistrict(d)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => onSelectDistrict(d.name)}
              />
            );
          })}
        </g>

        {/* Selected District Highlight Ring / Pin */}
        {RWANDA_DISTRICTS.filter(d => d.name === selectedDistrict).map(d => (
          <g key={`pin-${d.name}`} className="pointer-events-none">
            <circle 
              cx={d.cx} 
              cy={d.cy} 
              r={9} 
              fill="rgba(255,255,255,0.7)" 
              stroke="#14532D" 
              strokeWidth={2}
            />
            <circle 
              cx={d.cx} 
              cy={d.cy} 
              r={4} 
              fill="#14532D" 
            />
          </g>
        ))}

        {/* Key District Labels matching reference mockup */}
        <g className="pointer-events-none select-none">
          {RWANDA_DISTRICTS.filter(d => labeledDistricts.includes(d.name)).map(d => {
            const isDark = d.production && d.production > 5000;
            const textColor = isDark ? '#FFFFFF' : '#1E293B';
            const labelText = d.name === 'Huye' ? 'Southern' : d.name;

            return (
              <text
                key={`label-${d.name}`}
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize="10"
                fontWeight="700"
                style={{
                  textShadow: isDark 
                    ? '0 1px 2px rgba(0,0,0,0.6)' 
                    : '0 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {labelText}
              </text>
            );
          })}
        </g>
      </svg>

      {/* 4. Interactive Hover Tooltip */}
      {hoveredDistrict && (
        <div 
          className="absolute bottom-7 right-3 bg-white/95 backdrop-blur-md border border-card-border shadow-lg rounded-lg p-2.5 pointer-events-none z-20 text-[11px] min-w-[155px] animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="font-bold text-text-primary text-[12px] flex items-center justify-between border-b border-card-border/60 pb-1 mb-1">
            <span>{hoveredDistrict.name}</span>
            <span className="text-[10px] font-normal text-text-secondary">{hoveredDistrict.province}</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-text-secondary">Production:</span>
              <span className="font-semibold text-text-primary">
                {hoveredDistrict.production ? `${hoveredDistrict.production.toLocaleString()} t` : '– (Data Gap)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Avg Yield:</span>
              <span className="font-semibold text-text-primary">
                {hoveredDistrict.yield ? `${hoveredDistrict.yield} t/ha` : '–'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Rainfall:</span>
              <span className="font-semibold text-weather-blue">{hoveredDistrict.rainfall} mm</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-text-secondary">Resilience:</span>
              <span className={`font-semibold text-[10px] ${
                hoveredDistrict.resilienceTier === 'High Resilience' ? 'text-agri-green' : 'text-amber-accent'
              }`}>
                {hoveredDistrict.resilienceTier}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Scale Bar (Bottom-Left) */}
      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[9px] text-text-muted z-10">
        <span className="font-semibold">0</span>
        <div className="w-16 h-1 bg-text-secondary/70 rounded-xs flex overflow-hidden">
          <div className="w-1/2 h-full bg-text-primary"></div>
        </div>
        <span className="font-semibold">25 50 100 km</span>
      </div>
    </div>
  );
}
