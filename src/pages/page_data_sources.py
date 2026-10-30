"""
src/pages/page_data_sources.py
Page 9: Data Sources & Quality.
Transparent documentation of data providers, update frequencies, spatial coverage, and quality audits.
"""

import streamlit as st
from src.components.header import render_top_header
from src.components.footer import render_footer

def render_data_sources_page():
    render_top_header(
        title="Data Sources & Quality",
        subtitle="Complete transparency into data lineage, update frequencies, coverage, and validation audits."
    )

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Integrated Big Data Catalog</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            AgriResilience establishes rigorous data governance. All observations are verified against biological boundaries, 
            physical meteorological limits, and official Rwanda administrative nomenclature.
        </p>
    </div>
    """, unsafe_allow_html=True)

    sources = [
        {
            "name": "NISR Seasonal Agricultural Survey (SAS)",
            "provider": "National Institute of Statistics of Rwanda",
            "coverage": "All 30 Districts (Season A & Season B, 2021–2026)",
            "frequency": "Biannual (Seasonal Survey)",
            "variables": "Cultivated area (ha), total harvest (kg), crop dispositions, input expenses",
            "quality": "94.8% Completeness · 0 Unhandled Duplicates · Anonymized Microdata",
            "badge": "Official Statistics"
        },
        {
            "name": "NASA POWER Agroclimatology Grid",
            "provider": "NASA Langley Research Center / Meteo Rwanda calibration",
            "coverage": "Rwanda National Spatial Grid (0.5° × 0.5°)",
            "frequency": "Daily Gridded Observations",
            "variables": "Seasonal precipitation (mm), consecutive dry days, diurnal temperature, heat stress",
            "quality": "100% Coverage · Physical boundary filters (0–2,500 mm rain, 10–38°C)",
            "badge": "Meteorological"
        },
        {
            "name": "Sentinel-2 Multispectral Earth Observation",
            "provider": "European Space Agency (ESA) / Copernicus Open Access",
            "coverage": "10m Spatial Resolution across Rwanda territory",
            "frequency": "5-day revisit cycle",
            "variables": "NDVI early season, mid-season peak, harvest senescence, Vegetation Health Index",
            "quality": "Cloud-masked SCL band · Spline-interpolated NDVI phenology curves",
            "badge": "Satellite EO"
        },
        {
            "name": "MINAGRI e-Soko Market Information",
            "provider": "Ministry of Agriculture and Animal Resources",
            "coverage": "Key regional rural and urban commodity markets",
            "frequency": "Weekly market monitoring",
            "variables": "Farmgate prices, wholesale prices, retail prices, transport cost differentials",
            "quality": "Economic sanity checks (Retail >= Wholesale >= Farmgate)",
            "badge": "Market Economics"
        }
    ]

    for s in sources:
        st.markdown(f"""
        <div class="surface-card" style="margin-bottom:0.75rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <div style="font-size:0.95rem; font-weight:700; color:#173D32;">{s['name']}</div>
                <span style="font-size:0.68rem; font-weight:700; background:#E8F3EB; color:#3D8C61; padding:0.2rem 0.5rem; border-radius:4px;">
                    {s['badge']}
                </span>
            </div>
            <div style="font-size:0.76rem; color:#6B7771; line-height:1.5;">
                <strong>Provider:</strong> {s['provider']}<br>
                <strong>Coverage:</strong> {s['coverage']} &nbsp;|&nbsp; <strong>Frequency:</strong> {s['frequency']}<br>
                <strong>Variables:</strong> {s['variables']}<br>
                <strong>Quality Assurance:</strong> <span style="color:#25312D; font-weight:600;">{s['quality']}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

    render_footer()

