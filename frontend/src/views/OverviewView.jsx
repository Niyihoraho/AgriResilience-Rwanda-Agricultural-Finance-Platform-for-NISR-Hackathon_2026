// frontend/src/views/OverviewView.jsx
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import FilterBar from '../components/FilterBar';
import KpiRow from '../components/KpiRow';
import UnifiedComparisonCard from '../components/UnifiedComparisonCard';
import ProductionBySeasonChart from '../components/ProductionBySeasonChart';
import YieldTrendsChart from '../components/YieldTrendsChart';
import WeatherTrendsChart from '../components/WeatherTrendsChart';
import GeographicSummary from '../components/GeographicSummary';
import DiscoveryBanner from '../components/DiscoveryBanner';
import Footer from '../components/Footer';
import { INITIAL_KPIS } from '../data/mockData';

export default function OverviewView({ onSelectTab }) {
  const [filters, setFilters] = useState({
    district: "Nyabihu",
    sector: "All Sectors",
    crop: "Maize",
    season: "A 2024B",
    year: "2024"
  });

  const [kpis, setKpis] = useState(INITIAL_KPIS);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    // Update KPI subtitles dynamically based on filter selection
    setKpis({
      ...kpis,
      productionSubtitle: `Season: ${updated.season} | Crop: ${updated.crop}`,
      yieldSubtitle: `Season: ${updated.season} | Crop: ${updated.crop}`,
      rainfallSubtitle: `Season: ${updated.season} | ${updated.district} (FAO/AGLW Effective Rain)`,
    });
  };

  const handleReset = () => {
    setFilters({
      district: "Nyabihu",
      sector: "All Sectors",
      crop: "Maize",
      season: "A 2024B",
      year: "2024"
    });
    setKpis(INITIAL_KPIS);
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Utility Header */}
      <TopBar 
        title="Agricultural Intelligence Overview" 
        subtitle="Understand agricultural production, seasonal weather and crop-condition evidence across Rwanda." 
      />

      {/* 2. Global Filter Bar */}
      <FilterBar 
        filters={filters} 
        onChangeFilter={handleFilterChange} 
        onReset={handleReset} 
      />

      {/* 3. 6 KPI Metric Cards */}
      <KpiRow kpis={kpis} />

      {/* 4. Main Charts Section — Row 1 (Clean 2-Column Grid: Unified Comparison & Geographic Map) */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6 h-[370px]">
          <UnifiedComparisonCard />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[370px]">
          <GeographicSummary />
        </div>
      </div>

      {/* 5. Main Charts Section — Row 2 (Clean 2-Column Grid: Multi-Season Production & Weather Trends) */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6 h-[370px]">
          <ProductionBySeasonChart />
        </div>
        <div className="col-span-12 xl:col-span-6 h-[370px]">
          <WeatherTrendsChart />
        </div>
      </div>

      {/* 6. Bottom Discovery Banner */}
      <DiscoveryBanner onSelectTab={onSelectTab} />

      {/* 7. Institutional Footer */}
      <Footer />
    </div>
  );
}
