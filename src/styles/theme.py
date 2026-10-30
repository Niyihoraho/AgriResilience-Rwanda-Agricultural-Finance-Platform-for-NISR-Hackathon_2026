"""
src/styles/theme.py
AgriResilience Rwanda — Complete Design System & CSS Styling.
Professional institutional agricultural analytics interface matching the exact UI mockup.
"""

COLOR_PALETTE = {
    "sidebar_bg": "#173D32",
    "sidebar_active": "#3D8C61",
    "sidebar_hover": "#1E4F3F",
    "page_bg": "#F7F8F5",
    "card_bg": "#FFFFFF",
    "card_border": "#E5E9E7",
    "text_primary": "#25312D",
    "text_secondary": "#6B7771",
    "text_muted": "#8C9993",
    "agri_green": "#3D8C61",
    "agri_green_light": "#E8F3EB",
    "weather_blue": "#4D7EA8",
    "weather_blue_light": "#E9F1F7",
    "amber": "#D99A32",
    "amber_light": "#FEF6E9",
    "red": "#C84C4C",
    "red_light": "#FBEAEA",
    "purple": "#7C3AED",
    "purple_light": "#F3E8FF",
}

def inject_custom_css():
    """Returns the full CSS design system."""
    return """
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
    /* ═══ GLOBAL RESET & FONTS ═══ */
    html, body, [class*="css"], .stApp,
    .stSelectbox, .stSlider, .stMarkdown,
    .stDataFrame, .stPlotlyChart, button, input, select, textarea {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .stApp {
        background: #F7F8F5 !important;
    }

    /* Remove Streamlit default header + footer */
    header[data-testid="stHeader"] { display: none !important; }
    footer { display: none !important; }
    #MainMenu { display: none !important; }
    .stDeployButton { display: none !important; }

    .block-container {
        padding: 1.25rem 2rem 2.5rem 2rem !important;
        max-width: 100% !important;
    }

    /* ═══ SIDEBAR STYLING ═══ */
    section[data-testid="stSidebar"] {
        background: #173D32 !important;
        width: 275px !important;
        min-width: 275px !important;
        border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    section[data-testid="stSidebar"] > div:first-child {
        background: #173D32 !important;
        padding-top: 0 !important;
    }

    section[data-testid="stSidebar"] [data-testid="stSidebarContent"] {
        background: #173D32 !important;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 1.5rem;
    }

    /* All sidebar text white */
    section[data-testid="stSidebar"] * {
        color: #FFFFFF !important;
    }

    /* Hide radio dots completely */
    section[data-testid="stSidebar"] .stRadio > div > label > div:first-child {
        display: none !important;
    }

    section[data-testid="stSidebar"] .stRadio > div {
        gap: 4px !important;
    }

    section[data-testid="stSidebar"] .stRadio > label {
        display: none !important;
    }

    section[data-testid="stSidebar"] .stRadio > div > label {
        background: transparent !important;
        padding: 0.6rem 0.95rem !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
        font-size: 0.85rem !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        margin: 0 !important;
        color: rgba(255,255,255,0.85) !important;
        border: 1px solid transparent !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
    }

    section[data-testid="stSidebar"] .stRadio > div > label:hover {
        background: rgba(255,255,255,0.08) !important;
        color: #FFFFFF !important;
    }

    section[data-testid="stSidebar"] .stRadio > div > label[data-checked="true"],
    section[data-testid="stSidebar"] .stRadio > div[data-checked="true"] label,
    section[data-testid="stSidebar"] .stRadio div[aria-checked="true"] > label {
        background: #3D8C61 !important;
        color: #FFFFFF !important;
        font-weight: 600 !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
    }

    /* ═══ TOP HEADER BAR ═══ */
    .top-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #E5E9E7;
        border-radius: 10px;
        padding: 0.85rem 1.4rem;
        margin-bottom: 0.85rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .top-header-bar .title-group h1 {
        font-size: 1.35rem;
        font-weight: 700;
        color: #25312D;
        margin: 0;
        letter-spacing: -0.015em;
        line-height: 1.2;
    }

    .top-header-bar .title-group p {
        font-size: 0.82rem;
        color: #6B7771;
        margin: 0.2rem 0 0 0;
    }

    .top-header-bar .status-group {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        font-size: 0.78rem;
    }

    .status-pill-live {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: #3D8C61;
        font-weight: 600;
        background: #E8F3EB;
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
    }

    .user-profile-badge {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        border-left: 1px solid #E5E9E7;
        padding-left: 1rem;
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #173D32;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.8rem;
    }

    /* ═══ GLOBAL FILTER BAR ═══ */
    .global-filter-container {
        background: #FFFFFF;
        border: 1px solid #E5E9E7;
        border-radius: 10px;
        padding: 0.85rem 1.25rem;
        margin-bottom: 1.15rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    /* ═══ 6 KPI METRIC CARDS ═══ */
    .kpi-row {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 0.85rem;
        margin-bottom: 1.15rem;
    }

    @media (max-width: 1300px) {
        .kpi-row {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 768px) {
        .kpi-row {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .kpi-metric-card {
        background: #FFFFFF;
        border: 1px solid #E5E9E7;
        border-radius: 10px;
        padding: 0.95rem 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 125px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .kpi-metric-card:hover {
        box-shadow: 0 3px 8px rgba(0,0,0,0.05);
    }

    .kpi-top-row {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-bottom: 0.45rem;
    }

    .kpi-circle-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .kpi-label {
        font-size: 0.76rem;
        font-weight: 600;
        color: #6B7771;
        line-height: 1.2;
    }

    .kpi-value {
        font-size: 1.6rem;
        font-weight: 800;
        color: #25312D;
        letter-spacing: -0.025em;
        line-height: 1.1;
        margin: 0.2rem 0;
        font-feature-settings: 'tnum' 1;
    }

    .kpi-subtext {
        font-size: 0.7rem;
        color: #6B7771;
        margin-top: 0.35rem;
        line-height: 1.3;
    }

    .kpi-source-tag {
        font-size: 0.65rem;
        color: #8C9993;
        font-weight: 500;
        margin-top: 0.2rem;
    }

    /* ═══ SURFACE CARDS ═══ */
    .surface-card {
        background: #FFFFFF;
        border: 1px solid #E5E9E7;
        border-radius: 10px;
        padding: 1.1rem 1.25rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        margin-bottom: 1.15rem;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .surface-card-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #25312D;
        margin: 0 0 0.85rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .surface-card-title-link {
        font-size: 0.75rem;
        font-weight: 600;
        color: #3D8C61;
        text-decoration: none;
        cursor: pointer;
    }

    /* ═══ OBSERVATION ITEMS ═══ */
    .observation-item {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.75rem 0.6rem;
        border-bottom: 1px solid #F1F4F2;
        border-radius: 6px;
        transition: background 0.15s ease;
    }

    .observation-item:hover {
        background: #F8FAF9;
    }

    .observation-item:last-child {
        border-bottom: none;
    }

    .observation-badge {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 0.1rem;
    }

    .observation-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: #25312D;
        margin-bottom: 0.15rem;
    }

    .observation-desc {
        font-size: 0.74rem;
        color: #6B7771;
        line-height: 1.45;
    }

    .observation-source {
        font-size: 0.66rem;
        color: #8C9993;
        margin-top: 0.25rem;
        font-weight: 500;
    }

    /* ═══ QUICK ACTION BUTTONS ═══ */
    .quick-action-button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.7rem 0.9rem;
        margin-bottom: 0.55rem;
        background: #F8FAF9;
        border: 1px solid #E5E9E7;
        border-radius: 8px;
        font-size: 0.83rem;
        font-weight: 600;
        color: #25312D;
        cursor: pointer;
        transition: all 0.15s ease;
        text-decoration: none;
    }

    .quick-action-button:hover {
        background: #E8F3EB;
        border-color: #3D8C61;
        color: #3D8C61;
    }

    /* ═══ BOTTOM DISCOVERY BANNER ═══ */
    .bottom-discovery-banner {
        background: #FFFFFF;
        border: 1px solid #E5E9E7;
        border-radius: 10px;
        padding: 1.15rem 1.4rem;
        margin-top: 0.25rem;
        margin-bottom: 1.15rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .discovery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 0.85rem;
    }

    .discovery-tile {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.9rem 1.1rem;
        background: #F8FAF9;
        border: 1px solid #E5E9E7;
        border-radius: 8px;
        transition: all 0.15s ease;
        cursor: pointer;
    }

    .discovery-tile:hover {
        border-color: #3D8C61;
        background: #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    /* ═══ FOOTER ═══ */
    .app-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.25rem;
        border-top: 1px solid #E5E9E7;
        font-size: 0.75rem;
        color: #6B7771;
        margin-top: 1.5rem;
    }

    /* ═══ STREAMLIT SELECT & INPUT OVERRIDES ═══ */
    .stSelectbox > div > div {
        background: #FFFFFF !important;
        border: 1px solid #E5E9E7 !important;
        border-radius: 8px !important;
        font-size: 0.84rem !important;
        min-height: 38px !important;
    }

    .stSelectbox label {
        font-size: 0.74rem !important;
        font-weight: 600 !important;
        color: #6B7771 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.03em !important;
        margin-bottom: 0.2rem !important;
    }

    .stButton > button {
        background: #FFFFFF !important;
        border: 1px solid #E5E9E7 !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 0.82rem !important;
        color: #25312D !important;
        padding: 0.5rem 1rem !important;
        transition: all 0.15s ease !important;
        box-shadow: none !important;
    }

    .stButton > button:hover {
        border-color: #3D8C61 !important;
        color: #3D8C61 !important;
        background: #F0F9F3 !important;
    }

    .stButton > button:active, .stButton > button:focus {
        border-color: #3D8C61 !important;
        box-shadow: 0 0 0 1px #3D8C61 !important;
    }

    .stDataFrame {
        border: 1px solid #E5E9E7 !important;
        border-radius: 8px !important;
        overflow: hidden !important;
    }

    .stPlotlyChart {
        border-radius: 6px;
        overflow: hidden;
    }
</style>
"""
