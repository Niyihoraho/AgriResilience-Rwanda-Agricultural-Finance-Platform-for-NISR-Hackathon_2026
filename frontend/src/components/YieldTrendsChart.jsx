// frontend/src/components/YieldTrendsChart.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { YIELD_TRENDS_DATA } from '../data/mockData';

export default function YieldTrendsChart() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-card-border/60 pb-2.5">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">
            Yield Trends
          </h3>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Average agricultural productivity per hectare over time (t/ha)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-primary bg-page-bg border border-card-border px-2.5 py-1 rounded-md">
            2020 – 2024
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={YIELD_TRENDS_DATA} 
            margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: '#6B7771', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              dy={5}
            />
            <YAxis 
              width={35}
              domain={[0, 4.5]}
              ticks={[0, 1.0, 2.0, 3.0, 4.0]}
              tick={{ fill: '#6B7771', fontSize: 11 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              tickFormatter={(v) => `${v.toFixed(1)}`}
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
              formatter={(value, name) => [`${value} t/ha`, name]}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11.5px', fontWeight: 500 }}
              iconType="circle"
              iconSize={8}
            />
            <Line 
              type="monotone" 
              dataKey="Maize" 
              stroke="#173D32" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: '#173D32', stroke: '#FFFFFF', strokeWidth: 1.5 }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Beans" 
              stroke="#4D7EA8" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: '#4D7EA8', stroke: '#FFFFFF', strokeWidth: 1.5 }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="Cassava" 
              stroke="#D99A32" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: '#D99A32', stroke: '#FFFFFF', strokeWidth: 1.5 }} 
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
