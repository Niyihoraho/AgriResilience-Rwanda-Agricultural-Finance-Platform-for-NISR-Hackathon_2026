// frontend/src/components/HorizontalComparisonBar.jsx
import React from 'react';

/**
 * Reusable Horizontal Comparison Bar component
 * Faithfully matches the user's reference mockup (Image 2)
 */
export default function HorizontalComparisonBar({
  title,
  subtitle,
  items = [],
  variant = "light" // "light" or "dark"
}) {
  const isDark = variant === "dark";

  return (
    <div className={`w-full ${isDark ? 'text-white' : 'text-text-primary'}`}>
      {title && (
        <div className="mb-2">
          <h4 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-text-primary'}`}>
            {title}
          </h4>
          {subtitle && (
            <p className={`text-[12px] mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-text-secondary'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3.5 mt-2">
        {items.map((item, index) => {
          const pct = Math.min(100, Math.max(0, item.pct !== undefined ? item.pct : item.value));
          const barColor = item.color || "#3D8C61";

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center gap-2">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-text-primary'}`}>
                    {item.label}
                  </span>
                  {item.tag && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-page-bg text-text-muted border border-card-border font-medium">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.secondaryValue && (
                    <span className={`text-[11.5px] ${isDark ? 'text-[#94A3B8]' : 'text-text-muted'}`}>
                      {item.secondaryValue}
                    </span>
                  )}
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-text-primary'}`}>
                    {item.formattedValue || `${item.value}%`}
                  </span>
                </div>
              </div>

              {/* Horizontal Progress Track */}
              <div 
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-[#1E293B]' : 'bg-[#E5E9E7]'
                }`}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${pct}%`, 
                    backgroundColor: barColor 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

