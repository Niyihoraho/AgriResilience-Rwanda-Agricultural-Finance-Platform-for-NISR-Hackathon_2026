"""
app.py
AgriResilience Rwanda — Integrated Agricultural Intelligence, Lending & Insurance Platform
National Institute of Statistics of Rwanda (NISR) Big Data Hackathon 2026

Main application entry point and modular router.
"""

import sys
from pathlib import Path
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Import Design System & Theme
from src.styles.theme import inject_custom_css
from src.components.sidebar import render_sidebar

# Import Page Renderers
from src.pages.page_overview import render_overview_page
from src.pages.page_historical import render_historical_page
from src.pages.page_case_a import render_case_a_page
from src.pages.page_case_b import render_case_b_page
from src.pages.page_loan import render_loan_page
from src.pages.page_insurance import render_insurance_page
from src.pages.page_risk_map import render_risk_map_page
from src.pages.page_reports import render_reports_page
from src.pages.page_data_sources import render_data_sources_page

# ═══════════════════════════════════════════════════════════════════
# PAGE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
st.set_page_config(
    page_title="AgriResilience Rwanda | Agricultural Intelligence Platform",
    page_icon="🍃",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ═══════════════════════════════════════════════════════════════════
# INJECT HIGH-FIDELITY DESIGN SYSTEM
# ═══════════════════════════════════════════════════════════════════
st.markdown(inject_custom_css(), unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════════
# SIDEBAR NAVIGATION
# ═══════════════════════════════════════════════════════════════════
current_page = render_sidebar()

# ═══════════════════════════════════════════════════════════════════
# MODULAR PAGE ROUTING
# ═══════════════════════════════════════════════════════════════════
if current_page == "Overview":
    render_overview_page()
elif current_page == "Historical Production & Weather":
    render_historical_page()
elif current_page == "Case A — Before Planting":
    render_case_a_page()
elif current_page == "Case B — After Planting":
    render_case_b_page()
elif current_page == "Agricultural Loan Assessment":
    render_loan_page()
elif current_page == "Agricultural Insurance & Risk":
    render_insurance_page()
elif current_page == "Agricultural Risk Map":
    render_risk_map_page()
elif current_page == "Evidence Reports":
    render_reports_page()
elif current_page == "Data Sources & Quality":
    render_data_sources_page()
else:
    render_overview_page()
