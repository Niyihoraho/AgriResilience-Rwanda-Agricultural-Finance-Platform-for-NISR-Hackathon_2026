"""
src/components/kpi_card.py
6 Top KPI Metric Cards matching dashboard mockup.
Uses professional SVG vector icons with tinted circular badge backgrounds.
"""

import streamlit as st
from src.styles.icons import get_svg_icon

def render_kpi_row(kpis: dict):
    """Renders the 6 uniform metric cards in a single responsive row with vector icons."""
    icon_prod = get_svg_icon("leaf", color="#3D8C61", size=18, stroke_width=2.2)
    icon_yield = get_svg_icon("wheat", color="#3D8C61", size=18, stroke_width=2.2)
    icon_rain = get_svg_icon("cloud-rain", color="#4D7EA8", size=18, stroke_width=2.2)
    icon_areas = get_svg_icon("map", color="#7C3AED", size=18, stroke_width=2.2)
    icon_sat = get_svg_icon("satellite", color="#173D32", size=18, stroke_width=2.2)
    icon_comp = get_svg_icon("database", color="#64748B", size=18, stroke_width=2.2)

    html = f"""
    <div class="kpi-row">
        <!-- Card 1: Total Production -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#E8F3EB;">{icon_prod}</div>
                    <div class="kpi-label">Total Production</div>
                </div>
                <div class="kpi-value">{kpis['total_production_t']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['production_subtitle']}</div>
                <div class="kpi-source-tag">Source: NISR</div>
            </div>
        </div>

        <!-- Card 2: Average Yield -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#E8F3EB;">{icon_yield}</div>
                    <div class="kpi-label">Average Yield</div>
                </div>
                <div class="kpi-value">{kpis['avg_yield_t_ha']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['yield_subtitle']}</div>
                <div class="kpi-source-tag">Source: NISR</div>
            </div>
        </div>

        <!-- Card 3: Total Rainfall -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#E9F1F7;">{icon_rain}</div>
                    <div class="kpi-label">Total Rainfall</div>
                </div>
                <div class="kpi-value">{kpis['total_rainfall_mm']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['rainfall_subtitle']}</div>
                <div class="kpi-source-tag">Source: Meteo Rwanda</div>
            </div>
        </div>

        <!-- Card 4: Areas Covered -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#F3E8FF;">{icon_areas}</div>
                    <div class="kpi-label">Areas Covered</div>
                </div>
                <div class="kpi-value">{kpis['areas_covered']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['areas_subtitle']}</div>
                <div class="kpi-source-tag">Source: NISR / Meteo Rwanda</div>
            </div>
        </div>

        <!-- Card 5: Valid Satellite Obs. -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#E0EDE7;">{icon_sat}</div>
                    <div class="kpi-label">Valid Satellite Obs.</div>
                </div>
                <div class="kpi-value">{kpis['valid_satellite_obs']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['satellite_subtitle']}</div>
                <div class="kpi-source-tag">Source: Sentinel-2</div>
            </div>
        </div>

        <!-- Card 6: Data Completeness -->
        <div class="kpi-metric-card">
            <div>
                <div class="kpi-top-row">
                    <div class="kpi-circle-icon" style="background:#F1F5F9;">{icon_comp}</div>
                    <div class="kpi-label">Data Completeness</div>
                </div>
                <div class="kpi-value">{kpis['data_completeness']}</div>
            </div>
            <div>
                <div class="kpi-subtext">{kpis['completeness_subtitle']}</div>
                <div class="kpi-source-tag">Last refresh: Apr 28, 2025</div>
            </div>
        </div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)
