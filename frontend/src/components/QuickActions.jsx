// frontend/src/components/QuickActions.jsx
import React from 'react';
import { Target, TrendingUp, Leaf, Sprout, Map as MapIcon } from 'lucide-react';

export default function QuickActions({ onSelectTab }) {
  const actions = [
    {
      id: 'historical',
      label: 'View detailed historical data',
      icon: TrendingUp,
    },
    {
      id: 'case-a',
      label: 'Start Case A — Before Planting',
      icon: Leaf,
    },
    {
      id: 'case-b',
      label: 'Start Case B — After Planting',
      icon: Sprout,
    },
    {
      id: 'risk-map',
      label: 'Explore risk map',
      icon: MapIcon,
    },
  ];

  return (
    <div className="bg-white border border-card-border rounded-xl p-4 shadow-card h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-text-primary" />
        <h3 className="text-[14.5px] font-bold text-text-primary">
          Quick Actions
        </h3>
      </div>

      <div className="space-y-2 my-auto">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onSelectTab(act.id)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-card-border bg-[#F8FAF9] hover:bg-agri-green-light hover:border-agri-green hover:text-agri-green transition-all text-left group shadow-2xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-md bg-white border border-card-border flex items-center justify-center text-text-primary group-hover:text-agri-green shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12.5px] font-semibold text-text-primary group-hover:text-agri-green">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

