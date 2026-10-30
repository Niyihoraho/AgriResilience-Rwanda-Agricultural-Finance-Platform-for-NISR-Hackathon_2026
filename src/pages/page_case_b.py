"""
src/pages/page_case_b.py
Page 4: Case B — After Planting.
In-season satellite vegetation monitoring, Sentinel-2 NDVI trajectory, and aligned weather observations.
"""

import streamlit as st
import plotly.graph_objects as go
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer
from src.services.data_service import DataService

def render_case_b_page():
    render_top_header(
        title="Case B — After Planting",
        subtitle="In-season crop monitoring using Sentinel-2 satellite NDVI time series and aligned weather evidence."
    )
    filters = render_filter_bar()

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">In-Season Satellite & Weather Monitoring</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            Track standing vegetation conditions throughout the growing period. Satellite NDVI indicates canopy greenness and photosynthetic vigor, 
            providing early warning of climate stress without replacing in-person field verification.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c_chart, c_evidence = st.columns([1.3, 1])

    with c_chart:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Sentinel-2 Seasonal NDVI Trajectory vs. 5-Year Baseline</div>
        """, unsafe_allow_html=True)
        # Synthetic representative NDVI trajectory across 120-day cycle
        days = ["Day 15 (Emergence)", "Day 30 (Vegetative)", "Day 45 (Canopy Dev)", "Day 60 (Flowering)", "Day 75 (Grain Fill)", "Day 90 (Maturation)", "Day 105 (Harvest)"]
        ndvi_current = [0.28, 0.42, 0.61, 0.74, 0.68, 0.52, 0.38]
        ndvi_baseline = [0.30, 0.45, 0.66, 0.78, 0.72, 0.58, 0.42]

        fig_ndvi = go.Figure()
        fig_ndvi.add_trace(go.Scatter(
            x=days, y=ndvi_baseline, name="5-Year Historical Baseline",
            mode="lines", line=dict(color="#A3BFB5", width=2, dash="dash")
        ))
        fig_ndvi.add_trace(go.Scatter(
            x=days, y=ndvi_current, name="Current Season Observation",
            mode="lines+markers", line=dict(color="#3D8C61", width=3),
            marker=dict(size=7, color="#173D32")
        ))

        fig_ndvi.update_layout(
            height=280,
            margin=dict(l=10, r=10, t=10, b=10),
            plot_bgcolor="#FFFFFF",
            paper_bgcolor="#FFFFFF",
            font=dict(family="Inter", size=10, color="#6B7771"),
            legend=dict(orientation="h", y=1.05, x=0.5, xanchor="center"),
            yaxis=dict(title="NDVI (Greenness)", range=[0.1, 0.9], gridcolor="#F1F4F2"),
            xaxis=dict(gridcolor="#F1F4F2")
        )
        st.plotly_chart(fig_ndvi, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with c_evidence:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Structured Evidence Interpretation</div>
            
            <div style="margin-bottom:0.6rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#173D32; background:#E8F3EB; padding:0.15rem 0.4rem; border-radius:4px;">1. OBSERVATION</span>
                <p style="font-size:0.76rem; color:#25312D; margin:0.2rem 0 0 0;">NDVI measured at 0.74 during Day 60 flowering stage, running 5.1% below 5-year district median.</p>
            </div>

            <div style="margin-bottom:0.6rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#4D7EA8; background:#E9F1F7; padding:0.15rem 0.4rem; border-radius:4px;">2. SUPPORTING EVIDENCE</span>
                <p style="font-size:0.76rem; color:#25312D; margin:0.2rem 0 0 0;">12 consecutive dry spell days detected between Day 48 and Day 60 with cumulative rainfall 14% below expected.</p>
            </div>

            <div style="margin-bottom:0.6rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#D99A32; background:#FEF6E9; padding:0.15rem 0.4rem; border-radius:4px;">3. INTERPRETATION</span>
                <p style="font-size:0.76rem; color:#25312D; margin:0.2rem 0 0 0;">Canopy indicates mild water stress during critical reproductive phase; potential yield attenuation if rain does not resume.</p>
            </div>

            <div style="margin-bottom:0.6rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#64748B; background:#F1F5F9; padding:0.15rem 0.4rem; border-radius:4px;">4. LIMITATIONS</span>
                <p style="font-size:0.76rem; color:#25312D; margin:0.2rem 0 0 0;">NDVI measures greenness, not kernel weight or grain moisture. Cloud cover on Day 52 required temporal interpolation.</p>
            </div>

            <div>
                <span style="font-size:0.75rem; font-weight:700; color:#3D8C61; background:#E8F3EB; padding:0.15rem 0.4rem; border-radius:4px;">5. NEXT STEP FOR REVIEWER</span>
                <p style="font-size:0.76rem; color:#25312D; margin:0.2rem 0 0 0;">Schedule agronomist visual check in Nyabihu sector or request local cooperative field report.</p>
            </div>
        </div>
        """, unsafe_allow_html=True)

    render_footer()

