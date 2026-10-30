# 🌾 AgriResilience Rwanda
### Data-Driven Agricultural Finance & Climate Risk Decision Platform
**National Institute of Statistics of Rwanda (NISR) — Big Data for Sustainable Development Hackathon 2026**

> **"Data that empowers Rwandan farmers, strengthens our commercial banks, and feeds our nation."**  
> *Smarter Risk Assessment → Better Access to Credit → Increased Production → Lower Food Prices → Stronger National Economy*

---

## 📌 Executive Summary & Hackathon Pitch

In Rwanda, **agriculture employs 62% of the national labor force** and generates over **25% of Gross Domestic Product (GDP)**. Yet, Rwandan smallholder farmers receive **only 5% to 6% of formal commercial bank credit**. 

### The Problem
* **Lack of Collateral:** Smallholder farmers rarely possess registered urban real estate or titled assets required by conventional lenders.
* **Opaque Climate Volatility:** Unpredictable seasonal rainfall, dry spells (particularly in the Eastern savannah), and heat anomalies make banks perceive smallholders as high-risk, driving loan rejection or prohibitive interest rates.
* **Macro Impact:** Underfunded agriculture limits fertilizer and certified seed adoption, depressing yields, increasing national food prices, and straining foreign exchange reserves on food imports.

### The National Mandate: NST2 (2024–2029)
Under the **National Strategy for Transformation 2 (NST2)**, the Government of Rwanda has targeted **doubling the share of commercial credit allocated to agriculture from 6% to 10% by 2028/29** to drive economic transformation and food sovereignty under **Vision 2050**.

### Our Solution: AgriResilience Rwanda
**AgriResilience Rwanda** is an end-to-end, big-data-driven agricultural finance decision platform. By fusing **official NISR survey microdata** with **high-resolution satellite earth observation (Sentinel-2)**, **daily agroclimatology (NASA POWER)**, and **real-time market prices (e-Soko / MINAGRI)**, our machine learning engine replaces subjective collateral-based loan rejection with **evidence-based cash flow underwriting and climate-indexed risk pooling**.

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

---

## 🏛️ National Economic & Policy Impact (NST2 Simulation)

Our macroeconomic simulation, calibrated against the **National Bank of Rwanda (BNR)** banking sector statistics and **NISR agricultural survey data**, demonstrates the transformative impact of transitioning from traditional collateral underwriting to AgriResilience:

| Performance Dimension | Traditional Collateral-Based Model | AgriResilience AI + NAIS Bundled Model | National Impact |
| :--- | :---: | :---: | :--- |
| **Agricultural Credit Share** | 6.0% (180 Bn RWF) | **10.0% (300 Bn RWF)** | **+120 Billion RWF New Capital** |
| **Smallholders Financed** | ~112,000 farmers | **~378,000 farmers** | **+266,666 Smallholders Banked** |
| **Portfolio Non-Performing Loans (NPL)** | **14.2%** default rate | **4.8%** default rate | **-9.4% NPL Reduction** |
| **Projected Portfolio Loss on 300 Bn** | 42.6 Billion RWF loss | **14.4 Billion RWF loss** | **28.2 Billion RWF Capital Preserved** |
| **Drought Risk Treatment** | Borrower default & insolvency | **Automated NAIS Index Payout to Bank** | Bank capital protected 100% |

---

## 🌐 The 4-Pillar Big Data Architecture

AgriResilience fuses **4 complementary big data streams** across all 30 districts of Rwanda:

```mermaid
graph TD
    A[Pillar 1: NISR Microdata<br>SAS Surveys 2022-2024<br>Yields, Areas, Crop Dispositions] --> E(Data Ingestion & Cleaning Engine)
    B[Pillar 2: NASA POWER<br>Daily Agroclimatology<br>Rainfall, Dry Spells, Extreme Temp] --> E
    C[Pillar 3: Sentinel-2 Satellite<br>10m Multispectral Earth Obs<br>NDVI Trajectory & Canopy Health] --> E
    D[Pillar 4: MINAGRI e-Soko<br>Commodity Market Prices<br>Farmgate, Wholesale, Margins] --> E
    
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
3. **Sentinel-2 Earth Observation:** European Space Agency 10m multispectral imagery processed into seasonal Normalized Difference Vegetation Index (NDVI) curves: early vegetative vigor, peak canopy development, and harvest senescence.
4. **MINAGRI / e-Soko Market Information:** Real-time farmgate, wholesale, and retail price dynamics, transport spreads, and historical seasonal trends.

---

## 🤖 Machine Learning Modeling & Validation Rigor

To prevent spatial-temporal data leakage and ensure true generalization, models were evaluated on a **strict out-of-season holdout test split** (trained on historical seasons, validated on unseen subsequent seasons).

### Performance Benchmarks
| Model Objective | Primary Algorithm | Validation Metric | Baseline Benchmark | AgriResilience Score | Improvement |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Harvest Yield Prediction** | Tuned Gradient Boosting Regressor | **$R^2$ Coefficient** | 0.448 (linear baseline) | **0.912** | **+103.5%** |
| | | **MAE (kg/ha)** | 784 kg/ha | **291 kg/ha** | **-62.9% error** |
| **Shortfall Risk Probability** | Calibrated Gradient Boosting Classifier | **ROC-AUC** | 0.612 (heuristic) | **0.884** | **+44.4%** |
| | | **Brier Calibration Score** | 0.182 | **0.048** | **Well-Calibrated** |

### Top Risk & Yield Drivers Identified by AI
1. **Satellite Vegetation Health Index (NDVI Seasonal Mean)** — Direct physical measure of photosynthetic canopy development.
2. **Consecutive Dry Spell Days** — Drought duration during critical reproductive flowering stages.
3. **Seasonal Precipitation Total (mm)** — Total moisture budget across the vegetative cycle.
4. **Historical Regional Benchmark Yield** — Local agro-ecological capacity (volcanic highlands vs eastern plains).
5. **Cultivated Farm Size (Hectares)** — Scale and mechanization intensity.
6. **Daytime Peak Temperature Stress Flag ($>28^\circ\text{C}$)** — Evapotranspiration stress.

---

## 💻 Interactive Decision-Support Dashboard Suite

Built with **Streamlit** and styled according to the official **National Institute of Statistics of Rwanda (NISR)** and **Rwanda Information Society Authority (RISA)** digital design guidelines:

### 1. 📊 National Overview & Provincial Baseline
* Executive KPI metrics (30 Districts, 6,643 Fused Records, 7.6% Shortfall Rate, 827K RWF Avg Margin, 0.912 $R^2$).
* Provincial Agricultural Performance Matrix comparing **Average Net Farm Margin** against **Shortfall Risk Frequency** with a 10% national watchlist reference line.
* Grouped crop yield distributions segmented by commodity type (Cereals vs Tubers) comparing Season A and Season B directly against official SAS targets.
* High-impact policy takeaways identifying regional strengths (e.g., Northern volcanic high-margin corridor vs Eastern drought-exposed savannah).

### 2. 🗺️ District Resilience Atlas
* Interactive **MapLibre vector choropleth map** (`carto-positron`) rendering all 30 Rwandan districts colored by their multi-dimensional Agricultural Resilience Index (0–100 scale).
* **District Priority Podiums:**
  * 🟢 **Top 3 Resilient Districts:** Rusizi (89.9), Burera (86.3), Gakenke (85.3) — low shortfall risk, volcanic soil, reliable rainfall.
  * 🔴 **Top 3 Climate-Exposed Districts:** Kayonza (35.2), Nyagatare (39.7), Bugesera (41.4) — prolonged dry spells (21+ days), prime candidates for NAIS subsidies.
* Searchable and filterable 30-district data table with shortfall rates, average yields, and net margins.

### 3. 🌾 Smallholder Loan Underwriting Simulator
* Bank credit appraisal interface pre-loaded with farmer profiles (e.g., *Jean Bizimana*, Nyagatare, Maize, 1.0 ha, 500,000 RWF facility).
* Automated **Approval Decision Stamp:**
  * `APPROVED · STANDARD UNSECURED CREDIT` (Low risk)
  * `APPROVED WITH MANDATORY NAIS WEATHER INSURANCE` (Climate-exposed)
  * `SPECIAL REVIEW · BDF CONCESSIONAL DE-RISKING REQUIRED` (High risk)
* **Seasonal Cash Flow & Loan Coverage Waterfall Chart:** Visualizes Gross Crop Revenue $\rightarrow$ Less Input Costs $\rightarrow$ Net Farm Income $\rightarrow$ Less Loan Debt Service $\rightarrow$ Farmer Net Cash Surplus buffer.
* Computes real-time **Debt Service Coverage Ratio (DSCR)** (e.g., `1.70x`) to verify repayment capacity.

### 4. 🌦️ Dynamic Climate Stress Scenario Tester
* Interactive meteorological sliders: Seasonal Rainfall Deficit ($-60\%$ to $+30\%$), Dry Spell Extension ($0$ to $25$ days), and Satellite Canopy Browning ($-40\%$ to $+10\%$).
* **Dual-Panel Diagnostic:**
  * Side-by-side bar chart showing agronomic contraction in expected yield and seasonal rainfall.
  * Simulated **NAIS Weather-Index Insurance Trigger:** Calculates automatic insurance payouts to the bank (e.g., 204,000 RWF) during severe drought, preserving lender capital and shielding farmers from bankruptcy.

### 5. 📈 NST2 Macro Policy Dashboard
* Visual policy milestone tracking progress from **5% today (180 Bn RWF)** to the **NST2 10% target (300 Bn RWF)**.
* Agricultural credit expansion waterfall chart (+120 Bn RWF unlocked).
* Side-by-side banking sector loss comparison (Traditional 14.2% NPL vs AgriResilience 4.8% NPL).
* Feature importance and explainable AI transparency visual.

---

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

---

## 🚀 Quickstart & Installation

### Prerequisites
* Python 3.10, 3.11, or 3.12
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-team/AgriResilience-Rwanda.git
cd AgriResilience-Rwanda
```

### 2. Create and Activate a Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

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

## 🏆 Alignment with Hackathon Judging Criteria

| Judging Criterion | How AgriResilience Rwanda Excels |
| :--- | :--- |
| **Relevance to Rwanda & Vision 2050** | Directly addresses Rwanda's **NST2 priority mandate** to double agricultural credit share from 6% to 10% by 2029, unlocking capital for smallholders who constitute 62% of the workforce. |
| **Big Data Integration & Innovation** | Seamlessly fuses **4 heterogeneous data pillars** (NISR survey microdata, Sentinel-2 10m satellite imagery, NASA POWER weather grids, and e-Soko market data) into a unified 6,643-record pipeline. |
| **Methodological Rigor & AI Quality** | Dual ML models achieving an **$R^2$ of 0.912** for yield prediction and **ROC-AUC of 0.884** for shortfall classification, validated on strict **out-of-season holdout splits** with calibrated probabilities. |
| **Financial & Agronomic Realism** | Formulates real banking cash flow economics (DSCR, repayment buffer, input costs) combined with Rwanda's **NAIS weather-index insurance** mechanism to protect lender capital during droughts. |
| **Design, Usability & Aesthetics** | Designed following the **official NISR / RISA design system**: Google Font **Inter**, government tricolor styling, intuitive cash flow waterfalls, MapLibre choropleths, and zero generic AI clichés. |

---

## 👥 Hackathon Team & Acknowledgements
Developed for the **National Institute of Statistics of Rwanda (NISR) Big Data for Sustainable Development Hackathon 2026**.

* **Data Attribution:**
  * National Institute of Statistics of Rwanda (NISR) — Seasonal Agricultural Survey (SAS)
  * NASA POWER Project — Agroclimatology Methodology
  * European Space Agency (ESA) — Copernicus Sentinel-2 Earth Observation
  * Ministry of Agriculture and Animal Resources (MINAGRI) — e-Soko Market Information System
  * geoBoundaries — Rwanda ADM2 District Spatial Boundaries

*Licensed under the Apache License 2.0.*
