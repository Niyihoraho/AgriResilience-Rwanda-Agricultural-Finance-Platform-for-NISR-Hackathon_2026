Team Name: IHAME
Team Leader:  Heroic NIYIHORAHO
Team Member: David Karenzi
VIDEO: https://app.screencastify.com/watch/4ZH58h5FwfgpStJ7B4k5
dashboard: https://agri-resilience-rwanda-agricultural-cyan.vercel.app/

# AgriResilience Rwanda
### Data-Driven Agricultural Finance & Climate Risk Decision Platform
**National Institute of Statistics of Rwanda (NISR) — Big Data for Sustainable Development Hackathon 2026**

> **"Data that empowers Rwandan farmers, strengthens our commercial banks, and feeds our nation."**  
> *Smarter Risk Assessment → Better Access to Credit → Increased Production → Lower Food Prices → Stronger National Economy*

---

##  Executive Summary & Hackathon Pitch

In Rwanda, **agriculture employs 62% of the national labor force** and generates over **25% of Gross Domestic Product (GDP)**. Yet, Rwandan smallholder farmers receive **only 5% to 6% of formal commercial bank credit**. 

## The Agricultural Financing Gap Has Two Sides

We should not automatically blame banks or farmers. Each side faces different challenges:

| The Financial Institution's Perspective | The Farmer's Perspective |
| :--- | :--- |
| • Will the farmer produce enough to generate income? | • How can I buy seeds and fertilizer without enough capital? |
| • What happens if rainfall is insufficient? | • How can I obtain a loan without conventional collateral? |
| • What if excessive rain damages the crop? | • How can I demonstrate my production history if I sell mainly for cash? |
| • Could the market price fall before harvest is sold? | • What happens if a weather shock damages my harvest? |
| • Does the farmer have sufficient cash flow to repay the loan? | • Can I obtain financing before the planting season begins? |
| • Is there reliable information to support the assessment? | |

### The National Mandate: NST2 (2024–2029)
Under the **National Strategy for Transformation 2 (NST2)**, the Government of Rwanda has targeted **doubling the share of commercial credit allocated to agriculture from 6% to 10% by 2028/29** to drive economic transformation and food sovereignty under **Vision 2050**.

### Our Solution: AgriResilience Rwanda
**AgriResilience Rwanda** is an end-to-end, big-data-driven agricultural finance decision platform. By fusing **official NISR survey microdata** with  **daily agroclimatology (NASA POWER)**, and **real-time market prices (e-Soko / MINAGRI)**, our machine learning engine replaces subjective collateral-based loan rejection with **evidence-based cash flow underwriting and climate-indexed risk pooling**.

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                       THE AGRIRESILIENCE VALUE CHAIN                   │
   │                                                                        │
   │   4 FUSED DATA SOURCES                                                 │
   │   (NISR + NASA + Sentinel-2 + e-Soko)                                  │
   │                   │                                                    │
   │                   ▼                                                    │
   │   EXPLAINABLE ML RESILIENCE ENGINE (R² = 0.912)                        │
   │   (Predicts Yield + Production Shortfall Probability)                  │
   │                   │                                                    │
   │                   ▼                                                    │
   │   AUTOMATED CASH FLOW & NAIS INSURANCE BUNDLING                        │
   │   (DSCR Underwriting + Automatic Drought Index Hedge)                  │
   │                   │                                                    │
   │                   ▼                                                    │
   │   +120 BILLION RWF UNLOCKED  ·  4.8% NPLs  ·  266K FARMERS FUNDED      │
   └────────────────────────────────────────────────────────────────────────┘
```


##  The 4-Pillar Big Data Architecture

AgriResilience fuses **4 complementary big data streams** across all 30 districts of Rwanda:

```mermaid
graph TD
    A[Pillar 1: NISR Microdata<br>SAS Surveys 2022-2024<br>Yields, Areas, Crop Dispositions] --> E(Data Ingestion & Cleaning Engine)
    B[Pillar 2: NASA POWER<br>Daily Agroclimatology<br>Rainfall, Dry Spells, Extreme Temp] --> E
    D[Pillar 33: MINAGRI e-Soko<br>Commodity Market Prices<br>Farmgate, Wholesale, Margins] --> E
    
    E --> F[Feature Engineering & Agronomic Fusion<br>6,643 Farmer-Season Records<br>Dry Spell Ratios, VHI, Benchmark Yields]
    F --> G[Dual Machine Learning Pipeline<br>LightGBM / Gradient Boosting]
    
    G --> H[Model 1: Harvest Yield Regressor<br>R² = 0.912 | MAE = 291 kg/ha]
    G --> I[Model 2: Shortfall Classifier<br>ROC-AUC = 0.884 | Brier = 0.048]
    
    H --> J[Decision & Underwriting Engine]
    I --> J
    
    J --> K[Interactive Decision Suite<br>Streamlit · Inter NISR Typography]
    K --> L[1. National Overview & Provincial Baseline]
    K --> M[2. District Resilience Atlas & MapLibre Map]
    K --> N[3. Smallholder Loan Underwriting Simulator]
    K --> O[4. Dynamic Climate Stress Scenario Tester]
    K --> P[5. NST2 Macro Policy Dashboard]
```

### Data Sources & Verification
1. **NISR Seasonal Agricultural Survey (SAS):** Multi-year microdata covering cultivated plots, crop species (Maize, Beans, Irish Potato, Rice, Cassava), input utilization, and harvest disposition across all 30 districts and both Agricultural Seasons (Season A and Season B).
2. **NASA POWER Agroclimatology:** Spatial grid observations of cumulative precipitation, rainfall intensity, consecutive dry spell days, diurnal temperature range, and daytime heat stress flags.
4. **MINAGRI / e-Soko Market Information:** Real-time farmgate, wholesale, and retail price dynamics, transport spreads, and historical seasonal trends.

---

## Machine Learning Modeling & Validation Rigor

To prevent spatial-temporal data leakage and ensure true generalization, models were evaluated on a **strict out-of-season holdout test split** (trained on historical seasons, validated on unseen subsequent seasons).







## 📁 Repository Directory Structure

```
Hackathon/
├── README.md                           # Comprehensive Hackathon Pitch & System Overview
├── requirements.txt                    # Python Dependencies (Streamlit, Plotly, Scikit-Learn, Pytest)
├── app.py                              # Premium Streamlit Decision-Support Web Application
├── src/
│   ├── load_data.py                    # 4-Pillar Ingestion Engine & GeoJSON Loader
│   ├── clean_data.py                   # Data Cleaning, Anomaly Removal & Validation
│   ├── feature_engineering.py          # Agronomic Indices, Dry Spell Ratios, Satellite VHI
│   ├── model.py                        # LightGBM/GradientBoosting Training & Inference API
│   ├── district_analytics.py           # Multi-Criteria District Resilience Scoring (0-100)
│   └── nst2_simulation.py              # Macro-Economic Credit & NPL Simulator
├── data/
│   ├── raw/                            # Raw Ingested Datasets (NISR, Weather, Satellite, Market, GeoJSON)
│   └── processed/
│       ├── integrated_agricultural_dataset.csv # 6,643 Clean Fused Records
│       └── analytics/
│           ├── district_resilience_rankings.csv # 30 Districts Ranked
│           ├── province_resilience_summary.csv  # 5 Provinces Summarized
│           └── nst2_credit_simulation.json      # Macro Policy Simulation Metrics
├── models/
│   ├── yield_regressor.joblib          # Trained Gradient Boosting Yield Model
│   ├── shortfall_classifier.joblib     # Trained Shortfall Probability Model
│   ├── feature_importance.csv          # Ranked Feature Importance
│   └── model_metrics.json              # Out-of-Season Validation Metrics
├── docs/
│   ├── architecture.md                 # In-Depth Technical & Data Architecture
│   ├── data_dictionary.md              # Full Schema, Variable Definitions & Units
│   └── methodology.md                  # Agronomic Risk Formulation & DSCR Mechanics
└── tests/
    ├── test_data_quality.py            # Automated Schema, Geography & Physical Range Tests
    └── test_model.py                   # Unit & Integration Tests for ML Underwriting
```


## 🚀 Quickstart & Installation

### Prerequisites
* Python 3.10, 3.11, or 3.12
* Git

### 1. Clone the Repository
```bash
git clone[ https://github.com/your-team/AgriResilience-Rwanda.git](https://github.com/Niyihoraho/AgriResilience-Rwanda-Agricultural-Finance-Platform-for-NISR-Hackathon_2026)

```

### 2. Create and Activate a Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate


### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Automated Quality Assurance Tests
```bash
python -m pytest tests/
```
*All 8 automated tests validate schema integrity, Rwanda 30-district naming, biological yield bounds, physical weather constraints, and ML inference.*

### 5. Launch the Platform

#### Modern Web Application (React + Tailwind + Lucide + Recharts)
```bash
python server.py
```
Open **`http://localhost:8000`** in your browser to interact with the institutional decision suite.

#### Development Server
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---



## 👥 Hackathon Team & Acknowledgements
Developed for the **National Institute of Statistics of Rwanda (NISR) Big Data for Sustainable Development Hackathon 2026**.

* **Data Attribution:**
  * National Institute of Statistics of Rwanda (NISR) — Seasonal Agricultural Survey (SAS)
  * NASA POWER Project — Agroclimatology Methodology
  * Ministry of Agriculture and Animal Resources (MINAGRI) — e-Soko Market Information System
  * geoBoundaries — Rwanda ADM2 District Spatial Boundaries


