"""
src/components/footer.py
Application Footer matching dashboard mockup.
"""

import streamlit as st

def render_footer():
    """Renders the clean institutional footer."""
    html = """
    <div class="app-footer">
        <div>
            <strong>AgriResilience Rwanda</strong> &nbsp;|&nbsp; Agricultural Intelligence & Financial Decision-Support
        </div>
        <div style="display:flex; gap:1.25rem;">
            <a href="#" style="color:#6B7771; text-decoration:none;">About</a>
            <a href="#" style="color:#6B7771; text-decoration:none;">Data Sources</a>
            <a href="#" style="color:#6B7771; text-decoration:none;">Methodology</a>
            <a href="#" style="color:#6B7771; text-decoration:none;">Help</a>
        </div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)

