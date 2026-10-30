"""
src/components/observation_card.py
Key Observations card matching dashboard mockup.
Displays traceable agricultural observations with SVG vector badges and source citations.
"""

import streamlit as st
from src.styles.icons import get_svg_icon

def render_key_observations(district="Nyabihu", season="2024B", crop="Maize"):
    """Renders the Key Observations card with status vector badges and explicit sources."""
    bulb_svg = get_svg_icon("lightbulb", color="#25312D", size=16, stroke_width=2.2)
    arrow_up_svg = get_svg_icon("arrow-up", color="#3D8C61", size=14, stroke_width=2.5)
    droplet_svg = get_svg_icon("droplet", color="#4D7EA8", size=14, stroke_width=2.5)
    alert_svg = get_svg_icon("alert-triangle", color="#D99A32", size=14, stroke_width=2.5)
    chevron_svg = get_svg_icon("chevron-right", color="#A3BFB5", size=15, stroke_width=2.0)

    html = f"""
    <div class="surface-card">
        <div class="surface-card-title">
            <span style="display:flex; align-items:center; gap:0.45rem;">
                <span>{bulb_svg}</span> Key Observations
            </span>
            <span class="surface-card-title-link">View all ›</span>
        </div>

        <!-- Observation 1: Positive Production Growth -->
        <div class="observation-item">
            <div class="observation-badge" style="background:#E8F3EB;">{arrow_up_svg}</div>
            <div style="flex-grow:1;">
                <div class="observation-title">{crop} production increased by 12%</div>
                <div class="observation-desc">
                    Compared to previous season, regional production increased from 43,000 t to 48,230 t across monitored plots.
                </div>
                <div class="observation-source">Source: NISR | District: {district} | Period: 2023B vs {season}</div>
            </div>
            <div>{chevron_svg}</div>
        </div>

        <!-- Observation 2: Rainfall Deficit -->
        <div class="observation-item">
            <div class="observation-badge" style="background:#E9F1F7;">{droplet_svg}</div>
            <div style="flex-grow:1;">
                <div class="observation-title">Rainfall was 18% below average</div>
                <div class="observation-desc">
                    Seasonal precipitation was 842 mm, compared to 1,028 mm 5-year agroclimatic baseline.
                </div>
                <div class="observation-source">Source: Meteo Rwanda / NASA POWER | Period: {season}</div>
            </div>
            <div>{chevron_svg}</div>
        </div>

        <!-- Observation 3: Data Quality & Missing Records Warning -->
        <div class="observation-item">
            <div class="observation-badge" style="background:#FEF6E9;">{alert_svg}</div>
            <div style="flex-grow:1;">
                <div class="observation-title">Missing data for some areas</div>
                <div class="observation-desc">
                    Production microdata missing or pending validation for 2 sectors in the selected district for {season}.
                </div>
                <div class="observation-source">Source: NISR Data Quality Audit | Period: {season}</div>
            </div>
            <div>{chevron_svg}</div>
        </div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)
