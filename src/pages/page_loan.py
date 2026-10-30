"""
src/pages/page_loan.py
Page 5: Agricultural Loan Assessment.
Financial decision-support module connecting agricultural evidence with credit appraisal workflows.
"""

import streamlit as st
from src.components.header import render_top_header
from src.components.filter_bar import render_filter_bar
from src.components.footer import render_footer

def render_loan_page():
    render_top_header(
        title="Agricultural Loan Assessment",
        subtitle="Connect verified agricultural evidence to commercial bank underwriting without replacing human review."
    )

    st.markdown("""
    <div class="surface-card">
        <div class="surface-card-title">Bank Credit Appraisal & Agricultural Evidence Review</div>
        <p style="font-size:0.83rem; color:#6B7771; line-height:1.5;">
            <strong>Underwriting Principle:</strong> AgriResilience provides evidence to support financing assessments. 
            It does not automatically approve or reject loans. Final credit determinations remain the responsibility of authorized bank loan officers.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c_form, c_review = st.columns([1, 1.2])

    with c_form:
        st.markdown("""
        <div class="surface-card">
            <div class="surface-card-title">📋 Loan Facility Request (Demonstration Record)</div>
        """, unsafe_allow_html=True)
        applicant = st.text_input("Applicant Name", value="Jean Bizimana (Nyabihu Cooperative)", disabled=True)
        req_amount = st.number_input("Requested Facility (RWF)", value=500000, step=50000)
        crop = st.selectbox("Agricultural Purpose", ["Maize Commercial Production", "Beans Production", "Irish Potato Production"])
        area = st.number_input("Cultivated Area (ha)", value=1.2, step=0.1)
        est_production_cost = st.number_input("Production & Input Costs (RWF)", value=288000, step=10000)
        status = st.selectbox("Assessment Status", ["Under Review", "Draft", "Evidence Incomplete", "Additional Information Required", "Reviewed"])
        st.markdown("</div>", unsafe_allow_html=True)

    with c_review:
        # Cash Flow & Evidence
        expected_yield_kg = 2950.0  # kg/ha
        expected_harvest_kg = expected_yield_kg * area
        farmgate_price = 340.0
        gross_rev = expected_harvest_kg * farmgate_price
        net_farm_income = gross_rev - est_production_cost
        debt_service = req_amount * 1.09  # 9% seasonal interest
        repayment_buffer = net_farm_income - debt_service
        dscr = net_farm_income / max(debt_service, 1)

        st.markdown(f"""
        <div class="surface-card">
            <div class="surface-card-title">🔍 Agricultural Evidence & Repayment Analysis</div>
            
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem; margin-bottom:1rem;">
                <div style="background:#F8FAF9; padding:0.65rem; border-radius:6px; border:1px solid #E5E9E7;">
                    <div style="font-size:0.7rem; color:#6B7771;">Expected Harvest</div>
                    <div style="font-size:1.1rem; font-weight:700; color:#25312D;">{expected_harvest_kg:,.0f} kg</div>
                    <div style="font-size:0.65rem; color:#8C9993;">@ 2,950 kg/ha district median</div>
                </div>
                <div style="background:#F8FAF9; padding:0.65rem; border-radius:6px; border:1px solid #E5E9E7;">
                    <div style="font-size:0.7rem; color:#6B7771;">Projected Gross Revenue</div>
                    <div style="font-size:1.1rem; font-weight:700; color:#25312D;">{gross_rev:,.0f} RWF</div>
                    <div style="font-size:0.65rem; color:#8C9993;">e-Soko farmgate benchmark</div>
                </div>
                <div style="background:#F8FAF9; padding:0.65rem; border-radius:6px; border:1px solid #E5E9E7;">
                    <div style="font-size:0.7rem; color:#6B7771;">Net Operating Farm Income</div>
                    <div style="font-size:1.1rem; font-weight:700; color:#3D8C61;">{net_farm_income:,.0f} RWF</div>
                    <div style="font-size:0.65rem; color:#8C9993;">Less estimated input costs</div>
                </div>
                <div style="background:#F8FAF9; padding:0.65rem; border-radius:6px; border:1px solid #E5E9E7;">
                    <div style="font-size:0.7rem; color:#6B7771;">Debt Service Coverage (DSCR)</div>
                    <div style="font-size:1.1rem; font-weight:700; color:#25312D;">{dscr:.2f}x</div>
                    <div style="font-size:0.65rem; color:#3D8C61;">Strong capacity (Threshold: 1.25x)</div>
                </div>
            </div>

            <div style="border:1px solid #E5E9E7; border-radius:6px; padding:0.75rem; background:#FFFFFF;">
                <div style="font-size:0.8rem; font-weight:700; color:#25312D; margin-bottom:0.35rem;">Reviewer Verification Checklist:</div>
                <div style="font-size:0.75rem; color:#6B7771; line-height:1.6;">
                    ✅ Historical district yield supports requested cultivation area.<br>
                    ✅ Net cash surplus provides {repayment_buffer:,.0f} RWF household food buffer.<br>
                    ⚠️ <em>Recommendation:</em> Request cooperative formal delivery contract before final disbursement.<br>
                    🛡️ <em>Climate Risk:</em> Low drought exposure in Nyabihu (volcanic soil, reliable precipitation).
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    render_footer()

