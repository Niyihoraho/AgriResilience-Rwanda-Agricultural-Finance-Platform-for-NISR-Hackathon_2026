// frontend/src/components/Sidebar.jsx
import React from 'react';
import { 
  Leaf, 
  Sprout,
  CloudRain
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'case-a', label: 'Case A — Before Planting', icon: Leaf },
  { id: 'case-b', label: 'Case B — After Planting', icon: Sprout },
  { id: 'climate', label: 'Climate Intelligence', icon: CloudRain },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="w-[260px] min-w-[260px] bg-sidebar-bg h-screen flex flex-col justify-between fixed left-0 top-0 z-30 select-none overflow-y-auto">
      {/* Top Section */}
      <div>
        {/* Brand Lockup */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-agri-green/20 flex items-center justify-center shrink-0 border border-agri-green/30">
            <Leaf className="w-5 h-5 text-agri-green" />
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-white leading-tight tracking-tight">
              AgriResilience<br />
              <span className="font-semibold text-agri-green-light">Rwanda</span>
            </div>
            <div className="text-[11px] text-sidebar-text-muted text-[#A3BFB5] mt-0.5">
              Data for stronger agriculture
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-sidebar-active text-white font-semibold shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/70'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Edge-to-Edge Rwandan Hillside Terraces Illustration */}
      <div className="relative w-full mt-auto select-none overflow-hidden shrink-0">
        <div className="relative w-full h-[185px] overflow-hidden">
          <img 
            src="/sidebar_hills.png" 
            alt="Rwanda Terraced Hills" 
            className="w-full h-full object-cover object-bottom"
          />
          {/* Top smooth blend into sidebar background and bottom subtle dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#173D32] via-transparent to-[#173D32]/90 pointer-events-none" />
          
          {/* Mission Quote directly overlaid on the illustration */}
          <div className="absolute bottom-4 left-0 right-0 px-4 space-y-0.5">
            <div className="text-[13.5px] font-bold text-white leading-tight drop-shadow-md">
              Better data.
            </div>
            <div className="text-[12.5px] font-semibold text-white/95 leading-tight drop-shadow-md">
              Stronger decisions.
            </div>
            <div className="text-[12.5px] font-normal text-[#A3BFB5] leading-tight drop-shadow-md">
              More resilient farmers.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
