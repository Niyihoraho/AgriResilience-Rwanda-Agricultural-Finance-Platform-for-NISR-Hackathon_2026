// frontend/src/components/ProductionBySeasonChart.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { SEASONAL_PRODUCTION_DATA } from '../data/mockData';

export default function ProductionBySeasonChart() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-card-border/60 pb-2.5">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">
            Production by Season
          </h3>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Total harvest output across monitored agricultural seasons (tonnes)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-agri-green bg-agri-green-light px-2.5 py-1 rounded-md">
            10 Seasons
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={SEASONAL_PRODUCTION_DATA} 
            margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
            barCategoryGap="22%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
            <XAxis 
              dataKey="period" 
              tick={{ fill: '#6B7771', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              dy={5}
            />
            <YAxis 
              width={45}
              tick={{ fill: '#6B7771', fontSize: 11 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              dx={-2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: '#E5E9E7', 
                borderRadius: '10px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                fontSize: '12px',
                padding: '10px 14px'
              }}
              formatter={(value, name) => [`${value.toLocaleString()} t`, name]}
              cursor={{ fill: 'rgba(61, 140, 97, 0.04)' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11.5px', fontWeight: 500 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Maize" fill="#173D32" radius={[3, 3, 0, 0]} maxBarSize={22} />
            <Bar dataKey="Beans" fill="#4D7EA8" radius={[3, 3, 0, 0]} maxBarSize={22} />
            <Bar dataKey="Cassava" fill="#D99A32" radius={[3, 3, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
