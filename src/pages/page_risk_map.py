"""
src/pages/page_risk_map.py
Page 7: Agricultural Risk Map.
Multi-layer spatial choropleth across Rwanda's 30 districts with documented inputs and reference baselines.
"""

import streamlit as st
import plotly.express as px
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer
from src.services.data_service import DataService

def render_risk_map_page():
    render_top_header(
        title="Agricultural Risk Map",
        subtitle="Geographic view of agricultural conditions, climate exposure, and verified evidence coverage."
    )

    data_service = DataService.get_instance()
    df = data_service.load_dataset()
    geojson = data_service.load_geojson()

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Spatial Agricultural & Climate Exposure Atlas</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            <strong>Methodology Notice:</strong> This map visualizes transparent district-level indicators with documented inputs.
            It does not assign unexplained composite risk scores to individual smallholder farmers.
        </p>
    </div>
    """, unsafe_allow_html=True)

    layer = st.selectbox("Select Map Layer", [
        "Historical Crop Yield (t/ha)",
        "Seasonal Rainfall Total (mm)",
        "Consecutive Dry Spell Days (Drought Risk)",
        "Sentinel-2 Mean NDVI Canopy Greenness",
        "Data Completeness & Sample Density"
    ])

    if not df.empty and geojson and "features" in geojson:
        # Aggregate by district
        grouped = df.groupby("district").agg(
            mean_yield=("yield_kg_per_ha", lambda x: round(x.mean() / 1000.0, 2)),
            mean_rainfall=("seasonal_rainfall_mm", "mean"),
            mean_dry_days=("consecutive_dry_days", "mean"),
            mean_ndvi=("ndvi_seasonal_mean", "mean"),
            sample_count=("record_id", "count")
        ).reset_index()

        if "Yield" in layer:
            col_target = "mean_yield"
            label_text = "Yield (t/ha)"
            color_scale = "Greens"
        elif "Rainfall" in layer:
            col_target = "mean_rainfall"
            label_text = "Rainfall (mm)"
            color_scale = "Blues"
        elif "Dry" in layer:
            col_target = "mean_dry_days"
            label_text = "Dry Days"
            color_scale = "Reds"
        elif "NDVI" in layer:
            col_target = "mean_ndvi"
            label_text = "Mean NDVI"
            color_scale = "YlGn"
        else:
            col_target = "sample_count"
            label_text = "Sample Count"
            color_scale = "Purples"

        try:
            fig = px.choropleth_map(
                grouped,
                geojson=geojson,
                locations="district",
                featureidkey="properties.shapeName",
                color=col_target,
                color_continuous_scale=color_scale,
                center={"lat": -1.94, "lon": 29.87},
                zoom=7.3,
                map_style="carto-positron",
                opacity=0.85,
                hover_name="district",
                labels={col_target: label_text}
            )
            fig.update_layout(
                height=480,
                margin=dict(l=0, r=0, t=10, b=0),
                font=dict(family="Inter", size=11)
            )
            st.plotly_chart(fig, use_container_width=True)
        except Exception:
            fig = px.choropleth(
                grouped,
                geojson=geojson,
                locations="district",
                featureidkey="properties.shapeName",
                color=col_target,
                color_continuous_scale=color_scale,
                hover_name="district"
            )
            fig.update_geos(fitbounds="locations", visible=False)
            fig.update_layout(height=480, margin=dict(l=0, r=0, t=10, b=0))
            st.plotly_chart(fig, use_container_width=True)

    render_footer()

