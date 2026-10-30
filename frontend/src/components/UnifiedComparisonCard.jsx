// frontend/src/components/UnifiedComparisonCard.jsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ComposedChart
} from 'recharts';
import { BarChart3, AlignLeft, TrendingUp, Sparkles } from 'lucide-react';
import HorizontalComparisonBar from './HorizontalComparisonBar';

const CROP_COMPARISON_DATA = [
  {
    crop: "Maize",
    production: 48230,
    yield: 3.5,
    sharePct: 38.2,
    color: "#173D32",
    status: "+12% vs 5-yr avg",
    badge: "Leading Staple"
  },
  {
    crop: "Irish Potato",
    production: 34100,
    yield: 8.2,
    sharePct: 27.0,
    color: "#3D8C61",
    status: "High Productivity",
    badge: "Volcanic Zone"
  },
  {
    crop: "Climbing Beans",
    production: 22600,
    yield: 2.2,
    sharePct: 17.9,
    color: "#4D7EA8",
    status: "Moisture Sensitive",
    badge: "Protein Staple"
  },
  {
    crop: "Cassava",
    production: 16800,
    yield: 1.6,
    sharePct: 13.3,
    color: "#D99A32",
    status: "Resilient Baseline",
    badge: "Drought Buffer"
  },
  {
    crop: "Paddy Rice",
    production: 4450,
    yield: 4.1,
    sharePct: 3.6,
    color: "#14B8A6",
    status: "Marshland Scheme",
    badge: "Irrigated"
  }
];

export default function UnifiedComparisonCard() {
  const [viewMode, setViewMode] = useState("bars"); // "bars" or "chart"

  // Prepare items for HorizontalComparisonBar
  const comparisonItems = CROP_COMPARISON_DATA.map(c => ({
    label: c.crop,
    value: c.sharePct,
    formattedValue: `${c.sharePct}% (${c.production.toLocaleString()} t)`,
    secondaryValue: `Yield: ${c.yield} t/ha`,
    pct: c.sharePct * 2.2, // scale visually so 38% fills ~85%
    color: c.color,
    tag: c.badge
  }));

  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-3 border-b border-card-border/70 pb-2.5 gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-agri-green" />
            <span>Integrated Crop Performance Comparison</span>
          </h3>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Single unified comparative view of crop production volume, yield productivity, and national share
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-page-bg border border-card-border rounded-lg p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setViewMode("bars")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "bars" 
                ? "bg-white text-agri-forest shadow-xs font-bold" 
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Benchmark Bars</span>
          </button>
          <button
            onClick={() => setViewMode("chart")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "chart" 
                ? "bg-white text-agri-forest shadow-xs font-bold" 
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Combined Dual Chart</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full flex-1 min-h-[250px] flex flex-col justify-center">
        {viewMode === "bars" ? (
          <div className="space-y-2 py-1">
            <HorizontalComparisonBar 
              items={comparisonItems}
              variant="light"
            />
            {/* Quick KPI footer */}
            <div className="mt-3 pt-2.5 border-t border-card-border/60 grid grid-cols-3 gap-2 text-[11.5px] text-text-secondary">
              <div>Total Monitored Output: <strong className="text-text-primary">126,180 t</strong></div>
              <div>Leading Commodity: <strong className="text-agri-forest">Maize (38.2%)</strong></div>
              <div>Top Productivity: <strong className="text-agri-green">Irish Potato (8.2 t/ha)</strong></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CROP_COMPARISON_DATA}
                margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
                <XAxis 
                  dataKey="crop" 
                  tick={{ fill: '#6B7771', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#E5E9E7' }}
                  tickLine={false}
                  dy={5}
                />
                {/* Left Y Axis: Production Tonnes */}
                <YAxis 
                  yAxisId="left"
                  width={45}
                  tick={{ fill: '#6B7771', fontSize: 11 }}
                  axisLine={{ stroke: '#E5E9E7' }}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                {/* Right Y Axis: Yield t/ha */}
                <YAxis 
                  yAxisId="right"
                  width={35}
                  orientation="right"
                  domain={[0, 10]}
                  ticks={[0, 2.5, 5.0, 7.5, 10]}
                  tick={{ fill: '#3D8C61', fontSize: 11 }}
                  axisLine={{ stroke: '#E5E9E7' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toFixed(1)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5E9E7', 
                    borderRadius: '10px', 
                    fontSize: '12px' 
                  }}
                  formatter={(val, name) => [
                    name === "Production (tonnes)" ? `${val.toLocaleString()} t` : `${val} t/ha`,
                    name
                  ]}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 500 }}
                  iconType="circle"
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="production" 
                  name="Production (tonnes)" 
                  fill="#173D32" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={36} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="yield" 
                  name="Yield (t/ha)" 
                  stroke="#3D8C61" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#3D8C61', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

