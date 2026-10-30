"""
src/components/quick_actions.py
Quick Actions widget and Bottom Discovery Banner matching dashboard mockup.
Uses professional SVG vector icons and styled actionable cards.
"""

import streamlit as st
from src.styles.icons import get_svg_icon

def render_quick_actions():
    """Renders the Quick Actions card on the Overview page."""
    target_svg = get_svg_icon("target", color="#25312D", size=16, stroke_width=2.2)
    chart_svg = get_svg_icon("trending-up", color="#3D8C61", size=15, stroke_width=2.0)
    leaf_svg = get_svg_icon("leaf", color="#3D8C61", size=15, stroke_width=2.0)
    sprout_svg = get_svg_icon("sprout", color="#3D8C61", size=15, stroke_width=2.0)
    map_svg = get_svg_icon("map", color="#3D8C61", size=15, stroke_width=2.0)

    st.markdown(f"""
    <div class="surface-card">
        <div class="surface-card-title">
            <span style="display:flex; align-items:center; gap:0.45rem;">
                <span>{target_svg}</span> Quick Actions
            </span>
        </div>
    """, unsafe_allow_html=True)

    c1 = st.button("📊  View detailed historical data", key="qa_hist", use_container_width=True)
    c2 = st.button("🌱  Start Case A — Before Planting", key="qa_case_a", use_container_width=True)
    c3 = st.button("🌿  Start Case B — After Planting", key="qa_case_b", use_container_width=True)
    c4 = st.button("🗺️  Explore agricultural risk map", key="qa_map", use_container_width=True)

    st.markdown("</div>", unsafe_allow_html=True)

    if c1:
        st.session_state["selected_page"] = "Historical Production & Weather"
        st.rerun()
    if c2:
        st.session_state["selected_page"] = "Case A — Before Planting"
        st.rerun()
    if c3:
        st.session_state["selected_page"] = "Case B — After Planting"
        st.rerun()
    if c4:
        st.session_state["selected_page"] = "Agricultural Risk Map"
        st.rerun()


def render_bottom_discovery_banner():
    """Renders the 'What do you want to explore next?' guide card at the bottom of the page."""
    leaf_svg = get_svg_icon("leaf", color="#3D8C61", size=18, stroke_width=2.2)

    st.markdown(f"""
    <div class="bottom-discovery-banner">
        <div style="display:flex; align-items:center; gap:0.85rem;">
            <div style="width:36px; height:36px; border-radius:50%; background:#E8F3EB; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                {leaf_svg}
            </div>
            <div>
                <div style="font-size:0.94rem; font-weight:700; color:#25312D;">What do you want to explore next?</div>
                <div style="font-size:0.79rem; color:#6B7771;">Choose a section from the menu or use the quick actions above to dive deeper into the data.</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    d1, d2, d3 = st.columns(3)

    with d1:
        if st.button("📊  Understand trends\n\nSee how production and weather have changed over time.", key="disc_hist", use_container_width=True):
            st.session_state["selected_page"] = "Historical Production & Weather"
            st.rerun()

    with d2:
        if st.button("🌱  Plan ahead\n\nUse historical data to assess next season's potential.", key="disc_case_a", use_container_width=True):
            st.session_state["selected_page"] = "Case A — Before Planting"
            st.rerun()

    with d3:
        if st.button("🛰️  Monitor current crops\n\nTrack vegetation and weather for planted fields.", key="disc_case_b", use_container_width=True):
            st.session_state["selected_page"] = "Case B — After Planting"
            st.rerun()
