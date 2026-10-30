"""
src/pages/page_insurance.py
Page 6: Agricultural Insurance & Risk.
In-season exposure monitoring, weather risk triggers, and claim inspection verification.
"""

import streamlit as st
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer

def render_insurance_page():
    render_top_header(
        title="Agricultural Insurance & Risk",
        subtitle="Exposure assessment, weather-index triggers, and in-season crop monitoring for NAIS insurers."
    )

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">National Agricultural Insurance Scheme (NAIS) Decision Support</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            <strong>Insurance Principle:</strong> A satellite NDVI anomaly or weather deficit does not automatically establish an insurance claim.
            The platform flags areas requiring inspection; formal indemnity determinations require insurer validation and policy compliance.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2 = st.columns([1, 1.2])

    with c1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">🛡️ Policy Exposure File (Demonstration)</div>
        """, unsafe_allow_html=True)
        policy_id = st.text_input("Policy ID", value="NAIS-RW-2024-0892", disabled=True)
        district = st.selectbox("Covered District", ["Kayonza (Eastern)", "Nyagatare (Eastern)", "Bugesera (Eastern)", "Nyabihu (Western)"])
        crop = st.selectbox("Insured Crop", ["Maize (Drought-Sensitive)", "Beans", "Rice"])
        insured_area = st.number_input("Insured Area (Hectares)", value=250.0, step=10.0)
        trigger_def = st.selectbox("Index Trigger Condition", [
            "Rainfall deficit > 25% + Consecutive dry days >= 18",
            "Mid-season NDVI drop > 20% relative to 5-year norm",
            "Severe thermal stress (> 30°C for 5+ days)"
        ])
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">🛰️ Risk Exposure & Anomaly Evaluation</div>
            <div style="background:#FEF6E9; border-left:3px solid #D99A32; padding:0.75rem; border-radius:0 6px 6px 0; margin-bottom:1rem;">
                <div style="font-weight:700; color:#D99A32; font-size:0.82rem;">⚠️ Climate Watchlist Flagged</div>
                <div style="font-size:0.75rem; color:#25312D; margin-top:0.2rem;">
                    Eastern savannah corridor (Kayonza/Nyagatare) observed 19 consecutive dry days. 
                    Cumulative precipitation is running 21% below long-term agricultural water requirements.
                </div>
            </div>

            <div style="font-size:0.8rem; font-weight:700; color:#25312D; margin-bottom:0.35rem;">Insurer Action Checklist:</div>
            <div style="font-size:0.75rem; color:#6B7771; line-height:1.6;">
                1. <strong>Verification Order:</strong> Dispatch MINAGRI/SONARWA field surveyor to verify soil moisture.<br>
                2. <strong>Satellite Cross-Check:</strong> Confirm Sentinel-2 scene cloud contamination does not skew greenness index.<br>
                3. <strong>Bank Notice:</strong> Notify lender syndicate regarding potential parametric indemnity window.
            </div>
        </div>
        """, unsafe_allow_html=True)

    render_footer()

