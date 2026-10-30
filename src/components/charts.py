"""
src/components/charts.py
High-fidelity Plotly chart generators matching the mockup's styling, colors, and typography.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from src.styles.theme import COLOR_PALETTE

CHART_FONT = dict(family="Inter, sans-serif", size=11, color=COLOR_PALETTE["text_secondary"])

def create_production_by_season_chart(df_grouped: pd.DataFrame) -> go.Figure:
    """Grouped bar chart comparing production across seasons and crops."""
    fig = go.Figure()

    if df_grouped.empty:
        fig.update_layout(title="No production records available")
        return fig

    # Crop colors matching mockup
    crop_colors = {
        "Maize": "#1B4D3E",       # Deep Forest Green
        "Beans": "#4D7EA8",       # Blue
        "Cassava": "#D99A32",     # Amber / Gold
        "Irish Potato": "#7C3AED", # Purple
        "Rice": "#22C55E"         # Emerald
    }

    periods = sorted(df_grouped["period"].unique())
    crops = [c for c in ["Maize", "Beans", "Cassava"] if c in df_grouped["crop"].unique()]
    if not crops:
        crops = df_grouped["crop"].unique()[:3]

    for crop in crops:
        crop_data = df_grouped[df_grouped["crop"] == crop]
        # Reindex to all periods so bars align cleanly
        data_dict = dict(zip(crop_data["period"], crop_data["production_tonnes"]))
        y_vals = [data_dict.get(p, 0.0) for p in periods]

        fig.add_trace(go.Bar(
            name=crop,
            x=periods,
            y=y_vals,
            marker_color=crop_colors.get(crop, "#64748B"),
            marker_line_width=0,
            opacity=0.92
        ))

    fig.update_layout(
        barmode="group",
        height=260,
        margin=dict(l=10, r=10, t=10, b=10),
        plot_bgcolor="#FFFFFF",
        paper_bgcolor="#FFFFFF",
        font=CHART_FONT,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=10)
        ),
        xaxis=dict(
            showgrid=False,
            linecolor="#E5E9E7",
            tickangle=0,
            tickfont=dict(size=9.5)
        ),
        yaxis=dict(
            title=dict(text="Production (tonnes)", font=dict(size=10)),
            showgrid=True,
            gridcolor="#F3F5F4",
            linecolor="#E5E9E7",
            tickfont=dict(size=10)
        )
    )
    return fig


def create_yield_trends_chart(df_yield: pd.DataFrame) -> go.Figure:
    """Multi-line chart displaying crop yield trends (t/ha) over years."""
    fig = go.Figure()

    if df_yield.empty:
        fig.update_layout(title="No yield records available")
        return fig

    crop_colors = {
        "Maize": "#1B4D3E",
        "Beans": "#4D7EA8",
        "Cassava": "#D99A32"
    }

    years = sorted(df_yield["year"].unique())
    crops = [c for c in ["Maize", "Beans", "Cassava"] if c in df_yield["crop"].unique()]
    if not crops:
        crops = df_yield["crop"].unique()[:3]

    for crop in crops:
        crop_data = df_yield[df_yield["crop"] == crop].sort_values("year")
        fig.add_trace(go.Scatter(
            name=crop,
            x=crop_data["year"],
            y=crop_data["yield_t_ha"],
            mode="lines+markers",
            line=dict(color=crop_colors.get(crop, "#64748B"), width=2.5),
            marker=dict(size=6, symbol="circle")
        ))

    fig.update_layout(
        height=260,
        margin=dict(l=10, r=10, t=10, b=10),
        plot_bgcolor="#FFFFFF",
        paper_bgcolor="#FFFFFF",
        font=CHART_FONT,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=10)
        ),
        xaxis=dict(
            showgrid=False,
            linecolor="#E5E9E7",
            dtick=1,
            tickfont=dict(size=10)
        ),
        yaxis=dict(
            title=dict(text="Yield (t/ha)", font=dict(size=10)),
            showgrid=True,
            gridcolor="#F3F5F4",
            linecolor="#E5E9E7",
            tickfont=dict(size=10)
        )
    )
    return fig


def create_weather_trends_chart(df_weather: pd.DataFrame) -> go.Figure:
    """Dual-axis chart with monthly rainfall bars and temperature line."""
    fig = go.Figure()

    if df_weather.empty:
        fig.update_layout(title="No weather records available")
        return fig

    # Rainfall bars (Primary Y Axis)
    fig.add_trace(go.Bar(
        name="Rainfall (mm)",
        x=df_weather["month"],
        y=df_weather["rainfall_mm"],
        marker_color="#4D7EA8",
        yaxis="y",
        opacity=0.85
    ))

    # Temperature line (Secondary Y Axis)
    fig.add_trace(go.Scatter(
        name="Temperature (°C)",
        x=df_weather["month"],
        y=df_weather["temperature_c"],
        mode="lines+markers",
        line=dict(color="#D97706", width=2.2),
        marker=dict(size=5),
        yaxis="y2"
    ))

    fig.update_layout(
        height=260,
        margin=dict(l=10, r=10, t=10, b=10),
        plot_bgcolor="#FFFFFF",
        paper_bgcolor="#FFFFFF",
        font=CHART_FONT,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(size=10)
        ),
        xaxis=dict(
            showgrid=False,
            linecolor="#E5E9E7",
            tickfont=dict(size=10)
        ),
        yaxis=dict(
            title=dict(text="Rainfall (mm)", font=dict(size=10)),
            showgrid=True,
            gridcolor="#F3F5F4",
            linecolor="#E5E9E7",
            tickfont=dict(size=10)
        ),
        yaxis2=dict(
            title=dict(text="Temperature (°C)", font=dict(size=10)),
            overlaying="y",
            side="right",
            showgrid=False,
            linecolor="#E5E9E7",
            tickfont=dict(size=10)
        )
    )
    return fig


def create_mini_choropleth_map(df_districts: pd.DataFrame, geojson: dict) -> go.Figure:
    """Generates mini Rwanda district choropleth map for the geographic summary card."""
    if not geojson or "features" not in geojson:
        # Fallback simple scatter chart if GeoJSON unavailable
        fig = go.Figure()
        fig.update_layout(
            height=260,
            margin=dict(l=0, r=0, t=0, b=0),
            annotations=[dict(text="GeoJSON loading...", showarrow=False)]
        )
        return fig

    # Map color scale matching mockup: deep green > 10,000, medium green, light green, yellow
    color_scale = [
        [0.0, "#FEF08A"],  # Light yellow for lower production
        [0.3, "#86EFAC"],  # Light green
        [0.6, "#22C55E"],  # Medium green
        [1.0, "#14532D"]   # Deep forest green
    ]

    try:
        fig = px.choropleth_map(
            df_districts,
            geojson=geojson,
            locations="district",
            featureidkey="properties.shapeName",
            color="production_t",
            color_continuous_scale=color_scale,
            center={"lat": -1.94, "lon": 29.87},
            zoom=6.8,
            map_style="carto-positron",
            opacity=0.88,
            hover_name="district",
            hover_data={"production_t": ":,.0f", "avg_yield_t_ha": ":.1f"}
        )
        fig.update_layout(
            height=260,
            margin=dict(l=0, r=0, t=0, b=0),
            coloraxis_showscale=False,
            font=CHART_FONT
        )
        return fig
    except Exception:
        fig = px.choropleth(
            df_districts,
            geojson=geojson,
            locations="district",
            featureidkey="properties.shapeName",
            color="production_t",
            color_continuous_scale=color_scale,
            hover_name="district"
        )
        fig.update_geos(fitbounds="locations", visible=False)
        fig.update_layout(
            height=260,
            margin=dict(l=0, r=0, t=0, b=0),
            coloraxis_showscale=False,
            font=CHART_FONT
        )
        return fig

