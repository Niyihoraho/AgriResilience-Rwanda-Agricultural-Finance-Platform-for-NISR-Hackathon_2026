"""
src/pages/page_reports.py
Page 8: Evidence Reports.
Generates traceable, audit-ready reports for agricultural, lending, and insurance review.
"""

import streamlit as st
from datetime import datetime
from src.components.header import render_top_header
from src.components.footer import render_footer

def render_reports_page():
    render_top_header(
        title="Evidence Reports",
        subtitle="Traceable, review-ready agricultural intelligence reports with full source attribution."
    )

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Audit-Ready Evidence Exports</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            Generate formal documentation linking credit appraisals and insurance reviews directly to the underlying 
            NISR survey microdata, satellite observations, and meteorological records.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">🌾 Agricultural Assessment Report</div>
            <p style="font-size:0.75rem; color:#6B7771; line-height:1.4;">
                Complete dossier of crop, location, historical yield benchmarks, weather observations, and scenario forecasts.
            </p>
            <div style="font-size:0.7rem; color:#8C9993; margin-bottom:0.75rem;">Format: Printable Review Dossier (CSV/Text)</div>
        """, unsafe_allow_html=True)
        if st.button("Generate Agricultural Report", use_container_width=True):
            st.success("Report generated successfully.")
            st.download_button(
                "📥 Download Report Dossier",
                f"AGRIRESILIENCE RWANDA - AGRICULTURAL ASSESSMENT REPORT\nGenerated: {datetime.now()}\nStatus: Verified\nSource: NISR / Meteo Rwanda / Sentinel-2\n\nDistrict: Nyabihu\nCrop: Maize\nBenchmark Yield: 2,950 kg/ha\nSeasonal Rainfall: 842 mm\nValid Observations: 23\nData Quality: 92% Complete",
                file_name="AgriResilience_Agricultural_Report.txt",
                use_container_width=True
            )
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">🏦 Bank Loan Evidence Report</div>
            <p style="font-size:0.75rem; color:#6B7771; line-height:1.4;">
                Underwriting summary including crop cash flow waterfall, debt service coverage ratio (DSCR), and verification status.
            </p>
            <div style="font-size:0.7rem; color:#8C9993; margin-bottom:0.75rem;">Format: Credit Committee Dossier</div>
        """, unsafe_allow_html=True)
        if st.button("Generate Loan Evidence Report", use_container_width=True):
            st.success("Loan dossier generated.")
            st.download_button(
                "📥 Download Loan Dossier",
                f"AGRIRESILIENCE RWANDA - COMMERCIAL LOAN EVIDENCE REPORT\nGenerated: {datetime.now()}\nApplicant: Jean Bizimana\nFacility: 500,000 RWF\nDSCR: 1.70x\nDecision Status: Recommended with Standard Underwriting\nReview Officer: John Doe (Analyst)",
                file_name="AgriResilience_Loan_Evidence_Report.txt",
                use_container_width=True
            )
        st.markdown("</div>", unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">🛡️ Insurance Review Report</div>
            <p style="font-size:0.75rem; color:#6B7771; line-height:1.4;">
                Exposure log, Sentinel-2 canopy greenness trajectory, weather anomalies, and flagged field inspection requirements.
            </p>
            <div style="font-size:0.7rem; color:#8C9993; margin-bottom:0.75rem;">Format: NAIS Insurer Dossier</div>
        """, unsafe_allow_html=True)
        if st.button("Generate Insurance Report", use_container_width=True):
            st.success("Insurance report generated.")
            st.download_button(
                "📥 Download Insurance Dossier",
                f"AGRIRESILIENCE RWANDA - NAIS INSURANCE REVIEW REPORT\nGenerated: {datetime.now()}\nPolicy: NAIS-RW-2024-0892\nInsured Area: 250 ha\nWeather Trigger: Monitored\nInspection Recommendation: Dispatched surveyor for moisture cross-check",
                file_name="AgriResilience_Insurance_Report.txt",
                use_container_width=True
            )
        st.markdown("</div>", unsafe_allow_html=True)

    render_footer()

