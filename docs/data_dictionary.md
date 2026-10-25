# 📚 AgriResilience Rwanda: Comprehensive Data Dictionary
### National Institute of Statistics of Rwanda (NISR) Big Data Hackathon 2026

This document provides exhaustive variable specifications, data types, physical units, source attribution, and descriptions for all features across the 4 integrated data pillars and engineered analytical datasets.

---

## Pillar 1: NISR Seasonal Agricultural Survey (SAS) Microdata

| Field Name | Type | Unit | Source | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `record_id` | String | Identifier | NISR SAS | Unique identifier for surveyed farmer-plot-season observation. | `SAS-2024-NYA-00142` |
| `district` | String | Categorical | NISR | Official district name among Rwanda's 30 administrative districts. | `Nyagatare`, `Musanze` |
| `province` | String | Categorical | NISR | Administrative province (`Eastern`, `Northern`, `Southern`, `Western`, `Kigali City`). | `Eastern` |
| `year` | Integer | Year (YYYY) | NISR | Survey collection agricultural calendar year. | `2024` |
| `season` | String | Categorical | NISR | Agricultural survey season (`Season A` = Sept–Feb; `Season B` = March–July). | `Season A` |
| `crop` | String | Categorical | NISR | Primary monitored crop species (`Maize`, `Beans`, `Irish Potato`, `Rice`, `Cassava`). | `Maize` |
| `cultivated_area_ha` | Float | Hectares ($ha$) | NISR | Measured cultivated plot land area under cultivation. | `1.00` |
| `total_production_kg` | Float | Kilograms ($kg$) | NISR | Total wet weight harvested crop production. | `2,483.0` |
| `yield_kg_per_ha` | Float | $kg/ha$ | NISR | Crop harvest yield per unit area ($\text{Production} / \text{Area}$). | `2,483.0` |
| `used_improved_seeds` | Integer | Boolean ($0/1$) | NISR | Flag indicating adoption of certified/hybrid seed varieties. | `1` |
| `used_chemical_fertilizer` | Integer | Boolean ($0/1$) | NISR | Flag indicating application of inorganic fertilizer (DAP, UREA, NPK). | `1` |
| `used_organic_fertilizer` | Integer | Boolean ($0/1$) | NISR | Flag indicating application of farmyard manure or compost. | `1` |
| `used_pesticides` | Integer | Boolean ($0/1$) | NISR | Flag indicating chemical crop protection application. | `0` |
| `irrigation_practiced` | Integer | Boolean ($0/1$) | NISR | Plot-level access to formal or informal irrigation infrastructure. | `0` |
| `post_harvest_loss_pct` | Float | Percentage ($\%$) | NISR | Estimated grain loss during harvesting, drying, and storage. | `6.5` |
| `sold_production_kg` | Float | Kilograms ($kg$) | NISR | Portion of harvested crop sold into commercial market channels. | `1,800.0` |

---

## Pillar 2: NASA POWER Agroclimatology Records

| Field Name | Type | Unit | Source | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `seasonal_rainfall_mm` | Float | Millimeters ($mm$) | NASA POWER | Total cumulative precipitation over the 150-day seasonal crop cycle. | `480.5` |
| `consecutive_dry_days` | Integer | Days ($d$) | NASA POWER | Maximum consecutive sequence of days with rainfall $< 1.0\text{ mm}$ during critical growth. | `14` |
| `rainy_days_count` | Integer | Days ($d$) | NASA POWER | Number of days receiving rainfall $\ge 1.0\text{ mm}$ during the agricultural season. | `38` |
| `extreme_rainfall_days`| Integer | Days ($d$) | NASA POWER | Days receiving intense downpours ($> 50.0\text{ mm}$), driving erosion and waterlogging. | `1` |
| `avg_temperature_c` | Float | Celsius ($^\circ\text{C}$) | NASA POWER | Mean seasonal ambient 2-meter air temperature. | `21.4` |
| `max_temperature_c` | Float | Celsius ($^\circ\text{C}$) | NASA POWER | Highest recorded daytime maximum temperature during the season. | `28.6` |
| `min_temperature_c` | Float | Celsius ($^\circ\text{C}$) | NASA POWER | Lowest recorded nighttime minimum temperature during the season. | `14.2` |
| `diurnal_temp_range_c`| Float | Celsius ($^\circ\text{C}$) | NASA POWER | Temperature spread ($\text{Max Temp} - \text{Min Temp}$), driving plant respiration rates. | `14.4` |
| `heat_stress_flag` | Integer | Boolean ($0/1$) | NASA POWER | Flag triggered when maximum temperature exceeds crop thermal limit ($> 28.0^\circ\text{C}$). | `1` |
| `dry_spell_ratio` | Float | Ratio | Derived | Ratio of consecutive dry days to total rainy days ($\text{Dry Days} / \text{Rainy Days}$). | `0.368` |
| `rainfall_intensity_mm_day` | Float | $mm/day$ | Derived | Average rainfall volume per rainy day ($\text{Total Rainfall} / \text{Rainy Days}$). | `12.64` |

---

## Pillar 3: Sentinel-2 Satellite Earth Observation

| Field Name | Type | Unit | Source | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ndvi_early_season` | Float | Index ($-1$ to $+1$) | Sentinel-2 | Mean NDVI during initial vegetative emergence (Days 15–40). | `0.374` |
| `ndvi_mid_season` | Float | Index ($-1$ to $+1$) | Sentinel-2 | Peak NDVI during maximum canopy coverage and grain filling (Days 60–90). | `0.614` |
| `ndvi_harvest` | Float | Index ($-1$ to $+1$) | Sentinel-2 | NDVI during crop maturity and canopy yellowing/senescence (Days 110–140). | `0.458` |
| `ndvi_seasonal_mean` | Float | Index ($-1$ to $+1$) | Sentinel-2 | Season-long average Normalized Difference Vegetation Index. | `0.520` |
| `vegetation_health_index` | Float | Index ($0$ to $100$) | Derived | Scaled canopy vitality index ($\text{NDVI Seasonal Mean} \times 100$). | `52.0` |
| `ndvi_anomaly_pct` | Float | Percentage ($\%$) | Derived | Percentage deviation from historical 5-year district NDVI baseline. | `-4.8` |
| `ndvi_vigor_ratio` | Float | Ratio | Derived | Ratio of peak canopy vigor to early emergence ($\text{NDVI Mid} / \text{NDVI Early}$). | `1.642` |
| `ndvi_senescence_drop`| Float | Delta Index | Derived | Canopy drop rate at harvest ($\text{NDVI Mid} - \text{NDVI Harvest}$). | `0.156` |
| `satellite_stress_flag` | Integer | Boolean ($0/1$) | Derived | Flag indicating severe vegetation stress ($\text{NDVI Seasonal Mean} < 0.40$). | `0` |

---

## Pillar 4: MINAGRI e-Soko Market Commodity Prices

| Field Name | Type | Unit | Source | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `farmgate_price_per_kg_rwf` | Float | RWF per $kg$ | e-Soko | Price received directly by farmers at plot gate or local collection center. | `320.0` |
| `wholesale_price_per_kg_rwf` | Float | RWF per $kg$ | e-Soko | Wholesale market price in district commercial trading center. | `385.0` |
| `retail_price_per_kg_rwf` | Float | RWF per $kg$ | e-Soko | Urban retail consumer price in regional markets. | `450.0` |
| `price_volatility_pct` | Float | Percentage ($\%$) | e-Soko | Intra-seasonal price coefficient of variation ($\sigma / \mu$). | `14.2` |
| `gross_farm_revenue_rwf` | Float | RWF | Derived | Total revenue ($\text{Sold Production} \times \text{Farmgate Price}$). | `576,000.0` |
| `total_production_cost_rwf`| Float | RWF | Derived | Sum of seed, fertilizer, labor, and transport outlays. | `240,000.0` |
| `net_margin_rwf` | Float | RWF | Derived | Net farm operating profit ($\text{Gross Revenue} - \text{Production Costs}$). | `336,000.0` |
| `commercialization_rate_pct`| Float | Percentage ($\%$) | Derived | Percentage of production commercialized ($\text{Sold} / \text{Produced} \times 100$). | `72.5` |

---

## Target & Risk Underwriting Variables

| Field Name | Type | Unit | Source | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `regional_benchmark_yield` | Float | $kg/ha$ | Model Derived | Historical 3-year median yield for the specific district-crop-season cohort. | `2,400.0` |
| `shortfall_threshold_kg_ha` | Float | $kg/ha$ | Formula | 70% threshold of regional benchmark yield ($0.70 \times Y_{\text{bench}}$). | `1,680.0` |
| `is_production_shortfall` | Integer | Boolean ($0/1$) | Ground Truth | Target: $1$ if actual harvest yield $< \text{Shortfall Threshold}$, else $0$. | `0` |
| `shortfall_probability_pct` | Float | Percentage ($\%$) | ML Classifier | Predicted probability that a farmer suffers severe yield shortfall. | `9.1` |
| `risk_tier` | String | Categorical | Rule Engine | Operational risk tier (`Low Risk`, `Moderate Risk`, `Elevated Risk`). | `Low Risk` |
| `insurance_recommended` | Boolean | Flag | Policy Logic | Mandatory NAIS weather-index insurance requirement indicator. | `False` |
| `dscr` | Float | Ratio | Financial | Debt Service Coverage Ratio ($\text{Net Farm Income} / \text{Loan Repayment}$). | `1.70` |
| `repayment_buffer_rwf` | Float | RWF | Financial | Surplus cash buffer after full debt servicing ($\text{Net Income} - \text{Debt Service}$). | `+382,010.0` |
