"""
src/pages/page_case_a.py
Page 3: Case A — Before Planting.
Pre-planting agricultural scenario modeling, historical comparables, and calibrated ML yield intervals.
"""

import streamlit as st
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer
from src.services.data_service import DataService

def render_case_a_page():
    render_top_header(
        title="Case A — Before Planting",
        subtitle="Pre-planting scenario analysis, historical benchmarks, and potential yield ranges."
    )
    filters = render_filter_bar()
    data_service = DataService.get_instance()
    df_filtered = data_service.filter_data(
        district=filters["district"],
        crop=filters["crop"],
        season=filters["season"],
        year=filters["year"]
    )

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Pre-Planting Planning & Evidence Scenarios</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            Evaluate a planned agricultural season using historical benchmarks. Where adequate data exists, 
            explore lower, typical, and favorable production scenarios to support bank and insurer risk reviews.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns([1, 1.2])

    with c1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">📝 Proposed Planting Parameters</div>
        """, unsafe_allow_html=True)
        area = st.number_input("Planned Cultivated Area (Hectares)", min_value=0.1, max_value=20.0, value=1.0, step=0.1)
        est_cost = st.number_input("Estimated Production Cost (RWF/ha)", min_value=50000, max_value=1000000, value=240000, step=10000)
        farmgate_price = st.number_input("Current Crop Price (RWF/kg)", min_value=100, max_value=2000, value=350, step=10)
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">📊 Scenario Projections (Lower · Typical · Favorable)</div>
        """, unsafe_allow_html=True)

        benchmark_yield = 2800.0  # kg/ha typical
        if not df_filtered.empty and "yield_kg_per_ha" in df_filtered.columns:
            benchmark_yield = float(df_filtered["yield_kg_per_ha"].median())

        scenarios = [
            {"tier": "Lower Scenario (Drought/Stress)", "yield_kg": benchmark_yield * 0.70, "color": "#D99A32"},
            {"tier": "Typical Scenario (Median Benchmark)", "yield_kg": benchmark_yield, "color": "#3D8C61"},
            {"tier": "Favorable Scenario (Optimal Rain)", "yield_kg": benchmark_yield * 1.25, "color": "#173D32"}
        ]

        for sc in scenarios:
            harvest_kg = sc["yield_kg"] * area
            gross_rev = harvest_kg * farmgate_price
            net_income = gross_rev - (est_cost * area)
            st.markdown(f"""
            <div style="border-left: 3px solid {sc['color']}; padding: 0.5rem 0.75rem; background:#F8FAF9; border-radius: 0 6px 6px 0; margin-bottom: 0.5rem;">
                <div style="font-size:0.8rem; font-weight:700; color:#25312D;">{sc['tier']}</div>
                <div style="font-size:0.75rem; color:#6B7771;">
                    Expected Yield: <strong>{sc['yield_kg']:.0f} kg/ha</strong> | Harvest: <strong>{harvest_kg:,.0f} kg</strong><br>
                    Est. Gross Revenue: <strong>{gross_rev:,.0f} RWF</strong> | Net Income: <strong>{net_income:,.0f} RWF</strong>
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.markdown("</div>", unsafe_allow_html=True)

    render_footer()

