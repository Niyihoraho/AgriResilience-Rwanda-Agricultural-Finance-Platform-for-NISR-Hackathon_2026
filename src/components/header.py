"""
src/components/header.py
Top Navigation and Status Bar matching dashboard mockup.
Uses crisp SVG icons for refresh and status indicators.
"""

import streamlit as st
from datetime import datetime
from src.styles.icons import get_svg_icon

def render_top_header(title="Agricultural Intelligence Overview", subtitle="Understand agricultural production, seasonal weather and crop-condition evidence across Rwanda."):
    """Renders the clean top utility bar with live refresh status and user avatar."""
    timestamp = datetime.now().strftime("%b %d, %Y %I:%M %p")
    refresh_svg = get_svg_icon("refresh", color="#6B7771", size=13, stroke_width=2.2)
    user_svg = get_svg_icon("user", color="#FFFFFF", size=16, stroke_width=2.0)
    
    html = f"""
    <div class="top-header-bar">
        <div class="title-group">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
        <div class="status-group">
            <div style="display:flex; align-items:center; gap:0.4rem; color:#6B7771; font-weight:500;">
                <span>{refresh_svg}</span>
                <span>Last updated {timestamp}</span>
            </div>
            <div class="status-pill-live">
                <span style="font-size:0.6rem;">●</span>
                <span>Data up to date</span>
            </div>
            <div class="user-profile-badge">
                <div class="user-avatar">{user_svg}</div>
                <div style="line-height:1.2;">
                    <div style="font-weight:700; color:#25312D; font-size:0.8rem;">John Doe</div>
                    <div style="font-size:0.68rem; color:#6B7771;">Analyst</div>
                </div>
            </div>
        </div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)
