"""
src/pages/page_overview.py
Page 1: Overview Dashboard.
Pixel-perfect replication of the target mockup design.
"""

import streamlit as st
import pandas as pd
from src.services.data_service import DataService
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.kpi_card import render_kpi_row
from src.components.charts import (
    create_production_by_season_chart,
    create_yield_trends_chart,
    create_weather_trends_chart,
    create_mini_choropleth_map
)
from src.components.observation_card import render_key_observations
from src.components.quick_actions import render_quick_actions, render_bottom_discovery_banner
from src.components.footer import render_footer

def render_overview_page():
    """Renders the Agricultural Intelligence Overview page."""
    data_service = DataService.get_instance()

    # 1. Top Header
    render_top_header(
        title="Agricultural Intelligence Overview",
        subtitle="Understand agricultural production, seasonal weather and crop-condition evidence across Rwanda."
    )

    # 2. Global Filter Bar
    filters = render_filter_bar()

    # 3. Filtered Dataset & KPI computation
    df_filtered = data_service.filter_data(
        district=filters["district"],
        crop=filters["crop"],
        season=filters["season"],
        year=filters["year"]
    )

    kpis = data_service.get_overview_kpis(
        df_filtered,
        district=filters["district"],
        crop=filters["crop"],
        season=filters["season"],
        year=filters["year"]
    )

    # 4. 6 KPI Metric Cards Row
    render_kpi_row(kpis)

    # 5. Main Section Row 1 (3 Columns)
    c1, c2, c3 = st.columns([3.5, 3.5, 3.0])

    with c1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Production by Season</div>
        """, unsafe_allow_html=True)
        df_season_prod = data_service.get_production_by_season_data(df_filtered)
        fig_prod = create_production_by_season_chart(df_season_prod)
        st.plotly_chart(fig_prod, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Yield Trends</div>
        """, unsafe_allow_html=True)
        df_yield = data_service.get_yield_trends_data(df_filtered)
        fig_yield = create_yield_trends_chart(df_yield)
        st.plotly_chart(fig_yield, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with c3:
        render_key_observations(
            district=filters["district"],
            season=str(filters["season"]),
            crop=str(filters["crop"])
        )

    # 6. Main Section Row 2 (3 Columns)
    r1, r2, r3 = st.columns([3.5, 3.5, 3.0])

    with r1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Weather Trends</div>
        """, unsafe_allow_html=True)
        df_weather = data_service.get_weather_trends_data(df_filtered)
        fig_weather = create_weather_trends_chart(df_weather)
        st.plotly_chart(fig_weather, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with r2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Geographic Summary</div>
        """, unsafe_allow_html=True)
        
        # Sub-columns inside Geographic Summary card (Map on left, Table on right)
        g_map, g_tbl = st.columns([1.1, 1.0])
        df_geo_table = data_service.get_geographic_summary_table(df_filtered)

        with g_map:
            geojson = data_service.load_geojson()
            fig_map = create_mini_choropleth_map(df_geo_table, geojson)
            st.plotly_chart(fig_map, use_container_width=True, config={"displayModeBar": False})

        with g_tbl:
            if not df_geo_table.empty:
                # Format table nicely for display
                display_tbl = df_geo_table.head(5)[["district", "production_t", "avg_yield_t_ha"]].copy()
                display_tbl.columns = ["District", "Production (t)", "Avg. Yield (t/ha)"]
                
                # Styled HTML table
                table_html = """
                <table style="width:100%; font-size:0.75rem; border-collapse:collapse; margin-top:0.25rem;">
                    <thead>
                        <tr style="border-bottom:1px solid #E5E9E7; text-align:left; color:#6B7771;">
                            <th style="padding:0.35rem 0.2rem; font-weight:600;">District</th>
                            <th style="padding:0.35rem 0.2rem; font-weight:600; text-align:right;">Production (t)</th>
                            <th style="padding:0.35rem 0.2rem; font-weight:600; text-align:right;">Avg. Yield</th>
                        </tr>
                    </thead>
                    <tbody>
                """
                for _, row in display_tbl.iterrows():
                    table_html += f"""
                        <tr style="border-bottom:1px solid #F1F4F2;">
                            <td style="padding:0.35rem 0.2rem; font-weight:600; color:#25312D;">{row['District']}</td>
                            <td style="padding:0.35rem 0.2rem; text-align:right; color:#25312D;">{row['Production (t)']:,.0f}</td>
                            <td style="padding:0.35rem 0.2rem; text-align:right; color:#25312D;">{row['Avg. Yield (t/ha)']:.1f}</td>
                        </tr>
                    """
                table_html += """
                    </tbody>
                </table>
                """
                st.markdown(table_html, unsafe_allow_html=True)
            else:
                st.info("No district records available.")

        st.markdown("</div>", unsafe_allow_html=True)

    with r3:
        render_quick_actions()

    # 7. Bottom Discovery Banner
    render_bottom_discovery_banner()

    # 8. Footer
    render_footer()

