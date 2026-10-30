"""
src/pages/page_historical.py
Page 2: Historical Production & Weather.
Provides deep-dive agricultural evidence used by Case A, Case B, and financial assessment modules.
"""

import streamlit as st
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer
from src.services.data_service import DataService

def render_historical_page():
    """Renders Historical Production & Weather page."""
    render_top_header(
        title="Historical Production & Weather",
        subtitle="Transparent multi-season agricultural evidence and climate baseline across Rwanda."
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
        <div class="surface-card-title">Historical Baseline Analysis</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            This module establishes verified historical baselines without making individual farmer claims from district statistics.
            Explore seasonal crop yield distributions, precipitation records, and historical anomaly periods.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Season-by-Season Production (Tonnes)</div>
        """, unsafe_allow_html=True)
        from src.components.charts import create_production_by_season_chart
        df_prod = data_service.get_production_by_season_data(df_filtered)
        st.plotly_chart(create_production_by_season_chart(df_prod), use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">Yield per Hectare Trends (t/ha)</div>
        """, unsafe_allow_html=True)
        from src.components.charts import create_yield_trends_chart
        df_yield = data_service.get_yield_trends_data(df_filtered)
        st.plotly_chart(create_yield_trends_chart(df_yield), use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    # Detailed Table
    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Historical Records Sample & Data Quality Verification</div>
    """, unsafe_allow_html=True)
    if not df_filtered.empty:
        cols_to_show = ["district", "province", "year", "season", "crop", "cultivated_area_ha", "yield_kg_per_ha", "seasonal_rainfall_mm", "consecutive_dry_days"]
        display_df = df_filtered[cols_to_show].head(15).copy()
        display_df.columns = ["District", "Province", "Year", "Season", "Crop", "Area (ha)", "Yield (kg/ha)", "Rainfall (mm)", "Dry Days"]
        st.dataframe(display_df, use_container_width=True, hide_index=True)
    else:
        st.info("No records matching the selected filter criteria.")
    st.markdown("</div>", unsafe_allow_html=True)

    render_footer()

