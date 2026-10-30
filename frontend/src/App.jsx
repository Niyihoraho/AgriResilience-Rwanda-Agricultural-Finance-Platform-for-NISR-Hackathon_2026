// frontend/src/App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import OverviewView from './views/OverviewView';
import HistoricalView from './views/HistoricalView';
import ClimateView from './views/ClimateView';
import CaseAView from './views/CaseAView';
import CaseBView from './views/CaseBView';
import LoanView from './views/LoanView';
import InsuranceView from './views/InsuranceView';
import RiskMapView from './views/RiskMapView';
import ReportsView from './views/ReportsView';
import DataQualityView from './views/DataQualityView';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState('case-a');

  // Shared state connecting Case A (Before Planting) directly into Agricultural Loan Underwriting
  const [caseAData, setCaseAData] = useState({
    district: "Nyabihu",
    crop: "Maize",
    season: "2025A",
    farmerName: "Jean Bizimana (KABOKU Cooperative)",
    area: 1.5,
    costPerHa: 260000,
    pricePerKg: 350,
    expectedYieldKg: 3350,
  });

  // Shared state connecting Case B (After Planting) directly into NAIS Agricultural Insurance
  const [caseBData, setCaseBData] = useState({
    district: "Kayonza",
    crop: "Maize",
    season: "2025A",
    farmerName: "Kayonza Maize Producers Cooperative (Plot 14B)",
    currentStage: "Flowering & Tasseling",
    area: 45.0,
    dryDays: 19,
    yieldPenaltyPct: 22.5,
    inSeasonRevisedYieldKg: 2092,
    isTriggerBreached: true,
  });

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onSelectTab={setActiveTab} />;
      case 'historical':
        return <HistoricalView />;
      case 'climate':
        return (
          <ClimateView 
            defaultDistrict={caseAData.district} 
            defaultCrop={caseAData.crop} 
            defaultSeason={caseAData.season} 
          />
        );
      case 'case-a':
        return (
          <CaseAView 
            caseAData={caseAData} 
            setCaseAData={setCaseAData} 
            onNavigateToLoan={() => setActiveTab('loans')} 
          />
        );
      case 'case-b':
        return (
          <CaseBView 
            caseBData={caseBData} 
            setCaseBData={setCaseBData} 
            onNavigateToInsurance={() => setActiveTab('insurance')} 
          />
        );
      case 'loans':
        return <LoanView caseAData={caseAData} />;
      case 'insurance':
        return <InsuranceView caseBData={caseBData} />;
      case 'risk-map':
        return <RiskMapView />;
      case 'reports':
        return <ReportsView />;
      case 'data-sources':
        return <DataQualityView />;
      default:
        return (
          <CaseAView 
            caseAData={caseAData} 
            setCaseAData={setCaseAData} 
            onNavigateToLoan={() => setActiveTab('loans')} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-page-bg text-text-primary flex">
      {/* 1. Persistent Left Sidebar (260px) */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. Main Content Area */}
      <main className="ml-[260px] flex-1 min-w-0 p-5 lg:p-7 overflow-x-hidden">
        <ErrorBoundary>
          {renderActiveView()}
        </ErrorBoundary>
      </main>
    </div>
  );
}
