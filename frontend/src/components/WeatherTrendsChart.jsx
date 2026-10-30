// frontend/src/components/WeatherTrendsChart.jsx
import React from 'react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { WEATHER_TRENDS_DATA } from '../data/mockData';

export default function WeatherTrendsChart() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-5 shadow-card h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-card-border/60 pb-2.5">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">
            Weather &amp; Effective Moisture Trends
          </h3>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Gross precipitation vs. FAO/AGLW estimated effective rainfall (mm) and temperature (°C)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-weather-blue bg-weather-blue-light px-2.5 py-1 rounded-md">
            Stage 1 &bull; FAO/AGLW Effective Rain
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={WEATHER_TRENDS_DATA} 
            margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F4F2" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6B7771', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              dy={5}
            />
            {/* Left Y Axis: Rainfall mm */}
            <YAxis 
              yAxisId="left"
              width={45}
              domain={[0, 140]}
              ticks={[0, 35, 70, 105, 140]}
              tick={{ fill: '#6B7771', fontSize: 11 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              tickFormatter={(v) => `${v}mm`}
              dx={-2}
            />
            {/* Right Y Axis: Temperature °C */}
            <YAxis 
              yAxisId="right"
              width={40}
              orientation="right"
              domain={[15, 30]}
              ticks={[15, 20, 25, 30]}
              tick={{ fill: '#D97706', fontSize: 11 }}
              axisLine={{ stroke: '#E5E9E7' }}
              tickLine={false}
              tickFormatter={(v) => `${v}°C`}
              dx={2}
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
              formatter={(value, name) => [
                name.includes('Temp') ? `${value} °C` : `${value} mm`,
                name
              ]}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar 
              yAxisId="left" 
              dataKey="rainfall" 
              name="Gross Rainfall (mm)" 
              fill="#93C5FD" 
              radius={[3, 3, 0, 0]} 
              maxBarSize={22}
            />
            <Bar 
              yAxisId="left" 
              dataKey="effectiveRainfall" 
              name="Est. Effective Rain (mm)" 
              fill="#2563EB" 
              radius={[3, 3, 0, 0]} 
              maxBarSize={22}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="temperature" 
              name="Temperature (°C)" 
              stroke="#D97706" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: '#D97706', stroke: '#FFFFFF', strokeWidth: 1.5 }} 
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
