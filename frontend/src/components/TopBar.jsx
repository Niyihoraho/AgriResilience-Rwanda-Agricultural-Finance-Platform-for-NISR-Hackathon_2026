// frontend/src/components/TopBar.jsx
import React from 'react';
import { RefreshCw, User } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  return (
    <header className="bg-white border border-card-border rounded-xl px-5 py-3.5 mb-3.5 shadow-card flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-[21px] font-bold text-text-primary tracking-tight leading-tight">
          {title || "Agricultural Intelligence Overview"}
        </h1>
        <p className="text-[12.5px] text-text-secondary mt-0.5">
          {subtitle || "Understand agricultural production, seasonal weather and crop-condition evidence across Rwanda."}
        </p>
      </div>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-5 text-[12px]">
        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-text-secondary font-medium">
          <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
          <span>Last updated Apr 28, 2025 10:24 AM</span>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-agri-green-light text-agri-green font-semibold text-[11.5px]">
          <span className="w-1.5 h-1.5 rounded-full bg-agri-green animate-pulse"></span>
          <span>Data up to date</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-4 border-l border-card-border">
          <div className="w-8 h-8 rounded-full bg-sidebar-bg text-white flex items-center justify-center font-bold text-xs shrink-0">
            JD
          </div>
          <div className="leading-tight">
            <div className="font-bold text-text-primary text-[12.5px]">John Doe</div>
            <div className="text-[10.5px] text-text-secondary">Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
}

