// frontend/src/data/mockData.js
// Grounded in official NISR microdata and the 4 fused data pillars

export const INITIAL_KPIS = {
  totalProduction: "48,230 t",
  avgYield: "3.2 t/ha",
  totalRainfall: "842 mm (554 mm eff)",
  areasCovered: "30 districts",
  validSatelliteObs: "23 passes",
  dataCompleteness: "98.4%",
  productionSubtitle: "Season: 2024B | Crop: Maize",
  yieldSubtitle: "Season: 2024B | Crop: Maize",
  rainfallSubtitle: "Gross 842 mm | Est. Effective 554 mm (FAO/AGLW)",
  areasSubtitle: "All 30 ADM2 districts covered",
  satelliteSubtitle: "Sentinel-2 MSI cloud-masked",
  completenessSubtitle: "Across 6,643 unified records",
};

export const SEASONAL_PRODUCTION_DATA = [
  { period: "2020A", Maize: 39500, Beans: 18200, Cassava: 14100 },
  { period: "2020B", Maize: 46200, Beans: 16400, Cassava: 15300 },
  { period: "2021A", Maize: 50100, Beans: 21000, Cassava: 16800 },
  { period: "2021B", Maize: 53400, Beans: 18900, Cassava: 16200 },
  { period: "2022A", Maize: 43200, Beans: 15100, Cassava: 14900 },
  { period: "2022B", Maize: 57100, Beans: 22400, Cassava: 18100 },
  { period: "2023A", Maize: 49800, Beans: 17800, Cassava: 16000 },
  { period: "2023B", Maize: 43000, Beans: 16200, Cassava: 15400 },
  { period: "2024A", Maize: 50400, Beans: 19500, Cassava: 17200 },
  { period: "2024B", Maize: 48230, Beans: 22600, Cassava: 16800 },
];

export const YIELD_TRENDS_DATA = [
  { year: "2020", Maize: 2.8, Beans: 1.6, Cassava: 1.1 },
  { year: "2021", Maize: 3.3, Beans: 1.9, Cassava: 1.3 },
  { year: "2022", Maize: 3.2, Beans: 2.1, Cassava: 1.5 },
  { year: "2023", Maize: 3.4, Beans: 2.2, Cassava: 1.5 },
  { year: "2024", Maize: 3.5, Beans: 2.2, Cassava: 1.6 },
];

export const WEATHER_TRENDS_DATA = [
  { month: "Apr", rainfall: 65, effectiveRainfall: 29.0, temperature: 20.5 },
  { month: "May", rainfall: 52, effectiveRainfall: 21.2, temperature: 20.2 },
  { month: "Jun", rainfall: 80, effectiveRainfall: 40.0, temperature: 19.8 },
  { month: "Jul", rainfall: 72, effectiveRainfall: 33.6, temperature: 18.5 },
  { month: "Aug", rainfall: 115, effectiveRainfall: 68.0, temperature: 21.0 },
  { month: "Sep", rainfall: 92, effectiveRainfall: 49.6, temperature: 22.4 },
  { month: "Oct", rainfall: 42, effectiveRainfall: 15.2, temperature: 23.1 },
  { month: "Nov", rainfall: 58, effectiveRainfall: 24.8, temperature: 24.5 },
  { month: "Dec", rainfall: 62, effectiveRainfall: 27.2, temperature: 26.0 },
];

export const DISTRICT_PRODUCTION_TABLE = [
  { district: "Nyabihu", production: 12420, yield: 3.8, status: "normal" },
  { district: "Musanze", production: 9860, yield: 3.1, status: "normal" },
  { district: "Rulindo", production: null, yield: null, status: "missing" },
  { district: "Gicumbi", production: 7540, yield: 2.9, status: "normal" },
  { district: "Kayonza", production: 6320, yield: 2.7, status: "normal" },
  { district: "Others", production: 12090, yield: 2.8, status: "normal" },
];

export const DISTRICT_OPTIONS = [
  "Nyabihu", "Musanze", "Burera", "Gicumbi", "Rulindo", "Gakenke",
  "Gasabo", "Kicukiro", "Nyarugenge", "Huye", "Nyanza", "Gisagara",
  "Ruhango", "Muhanga", "Kamonyi", "Nyamagabe", "Nyaruguru",
  "Rubavu", "Nyabihu", "Rutsiro", "Karongi", "Ngororero", "Nyamasheke", "Rusizi",
  "Nyagatare", "Gatsibo", "Kayonza", "Rwamagana", "Kirehe", "Ngoma", "Bugesera"
];

export const CROP_OPTIONS = ["Maize", "Beans", "Irish Potato", "Cassava", "Rice"];
export const SEASON_OPTIONS = ["A 2024B", "Season A", "Season B"];
export const YEAR_OPTIONS = ["2024", "2023", "2022", "2021", "2020"];

export const HISTORICAL_SEASONS_DETAILED = [
  { season: "2020A", production: 39500, yield: 2.8, harvestedArea: 14107, rainfall: 890, effectiveRainfall: 592, temperature: 20.8, obs: 420, status: "normal", note: "Favorable germination, regular rains" },
  { season: "2020B", production: 46200, yield: 3.1, harvestedArea: 14903, rainfall: 810, effectiveRainfall: 528, temperature: 21.2, obs: 435, status: "normal", note: "Good grain filling period" },
  { season: "2021A", production: 50100, yield: 3.3, harvestedArea: 15181, rainfall: 940, effectiveRainfall: 632, temperature: 20.5, obs: 440, status: "normal", note: "Above-average national harvest" },
  { season: "2021B", production: 53400, yield: 3.4, harvestedArea: 15705, rainfall: 860, effectiveRainfall: 568, temperature: 20.9, obs: 442, status: "normal", note: "Optimal distribution of moisture" },
  { season: "2022A", production: 43200, yield: 2.9, harvestedArea: 14896, rainfall: 720, effectiveRainfall: 456, temperature: 21.8, obs: 438, status: "shock", note: "Severe dry spell in Eastern Savannah (-16%)" },
  { season: "2022B", production: 57100, yield: 3.6, harvestedArea: 15861, rainfall: 910, effectiveRainfall: 608, temperature: 20.6, obs: 445, status: "normal", note: "Post-drought yield rebound" },
  { season: "2023A", production: 49800, yield: 3.4, harvestedArea: 14647, rainfall: 880, effectiveRainfall: 584, temperature: 21.1, obs: 450, status: "normal", note: "Stable highland production" },
  { season: "2023B", production: 43000, yield: 3.0, harvestedArea: 14333, rainfall: 830, effectiveRainfall: 544, temperature: 21.4, obs: 448, status: "deficit", note: "Late sowing moisture deficit (-8%)" },
  { season: "2024A", production: 50400, yield: 3.5, harvestedArea: 14400, rainfall: 915, effectiveRainfall: 612, temperature: 20.7, obs: 452, status: "normal", note: "High commercial input utilization" },
  { season: "2024B", production: 48230, yield: 3.5, harvestedArea: 13780, rainfall: 842, effectiveRainfall: 554, temperature: 21.0, obs: 458, status: "missing_rulindo", note: "Solid harvest; Rulindo district survey missing" },
];


