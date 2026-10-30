"""
src/components/filter_bar.py
Global Filter Bar matching dashboard mockup.
"""

import streamlit as st
from src.services.data_service import DataService

def render_filter_bar() -> dict:
    """Renders the horizontal global filter strip and returns selected filter values."""
    data_service = DataService.get_instance()
    options = data_service.get_filter_options()

    # Session state defaults
    if "filter_district" not in st.session_state:
        st.session_state["filter_district"] = "Nyabihu" if "Nyabihu" in options["districts"] else options["districts"][0]
    if "filter_sector" not in st.session_state:
        st.session_state["filter_sector"] = options["sectors"][0]
    if "filter_crop" not in st.session_state:
        st.session_state["filter_crop"] = "Maize" if "Maize" in options["crops"] else options["crops"][0]
    if "filter_season" not in st.session_state:
        # Default to Season B or latest
        st.session_state["filter_season"] = "Season B" if "Season B" in options["seasons"] else options["seasons"][0]
    if "filter_year" not in st.session_state:
        st.session_state["filter_year"] = 2024 if 2024 in options["years"] else options["years"][0]

    with st.container():
        st.markdown('<div class="global-filter-container">', unsafe_allow_html=True)
        c1, c2, c3, c4, c5, c6 = st.columns([2, 1.8, 1.8, 1.8, 1.5, 1.4])

        with c1:
            dist_idx = options["districts"].index(st.session_state["filter_district"]) if st.session_state["filter_district"] in options["districts"] else 0
            district = st.selectbox("District", options["districts"], index=dist_idx, key="sel_district")

        with c2:
            sector_idx = options["sectors"].index(st.session_state["filter_sector"]) if st.session_state["filter_sector"] in options["sectors"] else 0
            sector = st.selectbox("Sector", options["sectors"], index=sector_idx, key="sel_sector")

        with c3:
            crop_idx = options["crops"].index(st.session_state["filter_crop"]) if st.session_state["filter_crop"] in options["crops"] else 0
            crop = st.selectbox("Crop", options["crops"], index=crop_idx, key="sel_crop")

        with c4:
            season_idx = options["seasons"].index(st.session_state["filter_season"]) if st.session_state["filter_season"] in options["seasons"] else 0
            season = st.selectbox("Season", options["seasons"], index=season_idx, key="sel_season")

        with c5:
            year_idx = options["years"].index(st.session_state["filter_year"]) if st.session_state["filter_year"] in options["years"] else 0
            year = st.selectbox("Year", options["years"], index=year_idx, key="sel_year")

        with c6:
            st.markdown("<div style='height: 1.7rem;'></div>", unsafe_allow_html=True)
            if st.button("🔄 Reset filters", use_container_width=True):
                st.session_state["filter_district"] = "All Districts"
                st.session_state["filter_sector"] = "All Sectors"
                st.session_state["filter_crop"] = "All Crops"
                st.session_state["filter_season"] = "All Seasons"
                st.session_state["filter_year"] = "All Years"
                st.rerun()

        st.markdown('</div>', unsafe_allow_html=True)

    # Sync session state
    st.session_state["filter_district"] = district
    st.session_state["filter_sector"] = sector
    st.session_state["filter_crop"] = crop
    st.session_state["filter_season"] = season
    st.session_state["filter_year"] = year

    return {
        "district": district,
        "sector": sector,
        "crop": crop,
        "season": season,
        "year": year
    }

