"""
src/components/sidebar.py
Persistent Deep Forest Green Sidebar matching the mockup design.
Features clean brand lockup, styled navigation, and embedded hills illustration at bottom.
"""

from pathlib import Path
import base64
import streamlit as st
from src.styles.icons import get_svg_icon

BASE_DIR = Path(__file__).resolve().parent.parent.parent
HILLS_IMAGE_PATH = BASE_DIR / "assets" / "sidebar_hills.jpg"

NAV_ITEMS = [
    "Overview",
    "Historical Production & Weather",
    "Case A — Before Planting",
    "Case B — After Planting",
    "Agricultural Loan Assessment",
    "Agricultural Insurance & Risk",
    "Agricultural Risk Map",
    "Evidence Reports",
    "Data Sources & Quality"
]

NAV_ICONS = {
    "Overview": "home",
    "Historical Production & Weather": "trending-up",
    "Case A — Before Planting": "leaf",
    "Case B — After Planting": "sprout",
    "Agricultural Loan Assessment": "landmark",
    "Agricultural Insurance & Risk": "shield",
    "Agricultural Risk Map": "map",
    "Evidence Reports": "file-text",
    "Data Sources & Quality": "database"
}

def get_hills_base64() -> str:
    """Reads the sidebar hills image and returns base64 data string."""
    if HILLS_IMAGE_PATH.exists():
        try:
            with open(HILLS_IMAGE_PATH, "rb") as f:
                return base64.b64encode(f.read()).decode("utf-8")
        except Exception:
            return ""
    return ""

def render_sidebar() -> str:
    """Renders the left brand sidebar with navigation and bottom illustration."""
    with st.sidebar:
        # 1. Brand Lockup
        leaf_svg = get_svg_icon("leaf", color="#3D8C61", size=24, stroke_width=2.2)
        st.markdown(f"""
        <div style="padding: 1.25rem 0.5rem 1.15rem 0.5rem; display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(61, 140, 97, 0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                {leaf_svg}
            </div>
            <div>
                <div style="font-size: 1.1rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.015em; line-height: 1.15;">
                    AgriResilience<br><span style="font-weight: 600; color: #E8F3EB;">Rwanda</span>
                </div>
                <div style="font-size: 0.69rem; color: #A3BFB5; margin-top: 0.2rem; font-weight: 400;">
                    Data for stronger agriculture
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div style='height: 0.25rem;'></div>", unsafe_allow_html=True)

        # 2. Navigation Radio
        # Use session state to handle page changes if triggered by quick actions
        if "selected_page" not in st.session_state:
            st.session_state["selected_page"] = NAV_ITEMS[0]

        # Handle index
        current_index = 0
        if st.session_state["selected_page"] in NAV_ITEMS:
            current_index = NAV_ITEMS.index(st.session_state["selected_page"])

        # Display items with clean bullet/title
        selected_page = st.radio(
            "Navigation Menu",
            NAV_ITEMS,
            index=current_index,
            label_visibility="collapsed",
            key="main_nav_radio"
        )
        st.session_state["selected_page"] = selected_page

        # 3. Bottom Hills Illustration & Tagline
        hills_b64 = get_hills_base64()
        if hills_b64:
            st.markdown(f"""
            <div style="margin-top: 2rem; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <img src="data:image/jpeg;base64,{hills_b64}" style="width: 100%; height: auto; display: block; border-radius: 8px 8px 0 0;" alt="Rwanda Tea Hills" />
                <div style="background: rgba(18, 48, 39, 0.96); padding: 0.85rem 0.95rem 0.85rem 0.95rem;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #FFFFFF; line-height: 1.35;">Better data.</div>
                    <div style="font-size: 0.79rem; font-weight: 500; color: #E8F3EB; line-height: 1.35;">Stronger decisions.</div>
                    <div style="font-size: 0.79rem; font-weight: 400; color: #A3BFB5; line-height: 1.35;">More resilient farmers.</div>
                </div>
            </div>
            <div style="font-size: 0.67rem; color: #6E9485; margin-top: 0.75rem; padding: 0 0.25rem;">
                AgriResilience Rwanda &nbsp;|&nbsp; Agricultural Intelligence
            </div>
            """, unsafe_allow_html=True)

        return selected_page
