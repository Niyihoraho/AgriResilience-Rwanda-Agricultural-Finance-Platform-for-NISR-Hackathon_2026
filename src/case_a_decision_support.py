"""
src/case_a_decision_support.py
AgriResilience Rwanda — Case A (Before Planting) Agricultural Decision-Support Engine

Core Responsibilities:
1. Single source of truth for agricultural cash-flow waterfall:
   - Gross Revenue = Harvest * Price
   - Net Operating Income (NOI) = Gross Revenue - Operating Expenses
   - Total Debt Service = Principal + Interest + Fees
   - Net Retained Cash Surplus = NOI - Total Debt Service
2. Financial Risk & Underwriting Indicators:
   - Debt Service Coverage Ratio (DSCR) = NOI / Total Debt Service
   - Debt Service % of NOI = (Total Debt Service / NOI) * 100%
   - Break-Even Selling Price = (Costs + Debt Service) / Harvest
   - Break-Even Yield = (Costs + Debt Service) / (Area * Price)
   - Stress Tolerance Buffer = ((Yield - Break-Even Yield) / Yield) * 100%
3. Multi-Scenario Sensitivity Modeling:
   - Historical Baseline, Forecast-Adjusted ML, Adverse Weather Shock (-25%), User Custom
4. NAIS Insurance Risk Mitigation & Uninsured Exposure Analysis
5. Historical NISR Survey Microdata Aggregation
"""

import math
from typing import Dict, Any, Optional, List
from pathlib import Path
import pandas as pd
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"


def calculate_loan_debt_service(
    principal_rwf: float,
    annual_interest_rate_pct: float = 16.5,
    tenure_months: int = 6,
    facility_fee_pct: float = 1.5,
    insurance_fee_pct: float = 0.0
) -> Dict[str, float]:
    """
    Computes agricultural credit debt service under simple seasonal bullet tenure.
    Formula:
      Interest = Principal * (Rate / 100) * (tenure_months / 12)
      Facility Fee = Principal * (fee_pct / 100)
      Insurance Fee = Principal * (insurance_fee_pct / 100)
      Total Debt Service = Principal + Interest + Facility Fee + Insurance Fee
    """
    if principal_rwf < 0:
        raise ValueError("Principal must be non-negative")
    if annual_interest_rate_pct < 0:
        raise ValueError("Interest rate must be non-negative")
    if tenure_months <= 0:
        raise ValueError("Tenure must be positive")

    interest_cost = round(principal_rwf * (annual_interest_rate_pct / 100.0) * (tenure_months / 12.0), 2)
    facility_fee = round(principal_rwf * (facility_fee_pct / 100.0), 2)
    insurance_fee = round(principal_rwf * (insurance_fee_pct / 100.0), 2)
    total_debt_service = round(principal_rwf + interest_cost + facility_fee + insurance_fee, 2)

    return {
        "principal_rwf": float(principal_rwf),
        "interest_cost_rwf": float(interest_cost),
        "facility_fee_rwf": float(facility_fee),
        "insurance_fee_rwf": float(insurance_fee),
        "total_debt_service_rwf": float(total_debt_service),
        "tenure_months": int(tenure_months),
        "annual_interest_rate_pct": float(annual_interest_rate_pct)
    }


def calculate_expected_harvest_reference(
    benchmark_yield_kg_ha: float,
    cultivated_area_ha: float
) -> Dict[str, Any]:
    """
    Computes the historical expected production reference:
    Expected harvest reference = Historical benchmark yield × Cultivated area.
    Strictly designated as a historical-reference estimate, not a guaranteed prediction.
    """
    if benchmark_yield_kg_ha < 0:
        raise ValueError("Benchmark yield must be non-negative")
    if cultivated_area_ha <= 0:
        raise ValueError("Cultivated area must be strictly positive")

    expected_harvest_kg = round(benchmark_yield_kg_ha * cultivated_area_ha, 2)
    return {
        "benchmark_yield_kg_ha": float(benchmark_yield_kg_ha),
        "cultivated_area_ha": float(cultivated_area_ha),
        "expected_harvest_reference_kg": float(expected_harvest_kg),
        "label": "Historical Expected Production Reference",
        "estimate_type": "historical_reference",
        "is_guaranteed": False,
        "disclaimer": (
            "Historical-reference estimate based on point-in-time district survey baseline. "
            "Not a guaranteed future harvest prediction."
        )
    }


def calculate_agricultural_cash_flow(
    cultivated_area_ha: float,
    yield_kg_per_ha: float,
    selling_price_rwf_per_kg: float,
    total_operating_costs_rwf: float,
    debt_service_rwf: float
) -> Dict[str, Any]:
    """
    Computes vertical agricultural cash-flow waterfall and underwriting indicators.
    Enforces absolute arithmetic consistency across all outputs.
    """
    if cultivated_area_ha <= 0:
        raise ValueError("Cultivated area must be strictly positive")
    if yield_kg_per_ha < 0:
        raise ValueError("Yield must be non-negative")
    if selling_price_rwf_per_kg < 0:
        raise ValueError("Selling price must be non-negative")
    if total_operating_costs_rwf < 0:
        raise ValueError("Operating costs must be non-negative")
    if debt_service_rwf < 0:
        raise ValueError("Debt service must be non-negative")

    # Step 1: Harvest Volume
    total_harvest_kg = round(cultivated_area_ha * yield_kg_per_ha, 2)

    # Step 2: Gross Revenue
    gross_revenue_rwf = round(total_harvest_kg * selling_price_rwf_per_kg, 2)

    # Step 3: Net Operating Income (NOI)
    net_operating_income_rwf = round(gross_revenue_rwf - total_operating_costs_rwf, 2)

    # Step 4: Net Retained Cash Surplus
    retained_cash_surplus_rwf = round(net_operating_income_rwf - debt_service_rwf, 2)

    # Step 5: Underwriting Risk Indicators
    if debt_service_rwf > 0:
        dscr = round(net_operating_income_rwf / debt_service_rwf, 2)
        debt_service_pct_of_noi = round((debt_service_rwf / net_operating_income_rwf) * 100.0, 1) if net_operating_income_rwf > 0 else 999.0
    else:
        dscr = float("inf")
        debt_service_pct_of_noi = 0.0

    # Break-Even Metrics (to cover Operating Costs + Bank Debt Service)
    total_required_outflow = total_operating_costs_rwf + debt_service_rwf
    if total_harvest_kg > 0:
        break_even_price_rwf = round(total_required_outflow / total_harvest_kg, 2)
    else:
        break_even_price_rwf = float("inf")

    revenue_per_kg_yield = cultivated_area_ha * selling_price_rwf_per_kg
    if revenue_per_kg_yield > 0:
        break_even_yield_kg_ha = round(total_required_outflow / revenue_per_kg_yield, 2)
    else:
        break_even_yield_kg_ha = float("inf")

    # Stress buffer: how much yield can drop before debt cannot be served
    if yield_kg_per_ha > 0 and break_even_yield_kg_ha != float("inf"):
        stress_tolerance_buffer_pct = round(((yield_kg_per_ha - break_even_yield_kg_ha) / yield_kg_per_ha) * 100.0, 1)
    else:
        stress_tolerance_buffer_pct = -100.0

    return {
        "cultivated_area_ha": float(cultivated_area_ha),
        "yield_kg_per_ha": float(yield_kg_per_ha),
        "total_harvest_kg": float(total_harvest_kg),
        "selling_price_rwf_per_kg": float(selling_price_rwf_per_kg),
        "gross_revenue_rwf": float(gross_revenue_rwf),
        "total_operating_costs_rwf": float(total_operating_costs_rwf),
        "cost_per_ha_rwf": round(total_operating_costs_rwf / cultivated_area_ha, 2),
        "net_operating_income_rwf": float(net_operating_income_rwf),
        "debt_service_rwf": float(debt_service_rwf),
        "retained_cash_surplus_rwf": float(retained_cash_surplus_rwf),
        "dscr": float(dscr),
        "debt_service_pct_of_noi": float(debt_service_pct_of_noi),
        "break_even_price_rwf": float(break_even_price_rwf),
        "break_even_yield_kg_ha": float(break_even_yield_kg_ha),
        "stress_tolerance_buffer_pct": float(stress_tolerance_buffer_pct)
    }


def evaluate_case_a_scenarios(
    cultivated_area_ha: float = 1.5,
    selling_price_rwf_per_kg: float = 350.0,
    total_operating_costs_rwf: float = 390000.0,
    debt_service_rwf: float = 603625.0,
    historical_benchmark_yield_kg_ha: float = 2482.9,
    user_assumed_yield_kg_ha: float = 3800.0,
    forecast_adjusted_yield_kg_ha: Optional[float] = None,
    adverse_shock_pct: float = 0.25,
    market_price_shock_pct: float = 0.20
) -> Dict[str, Any]:
    """
    Computes the 4 standard evidence-based underwriting sensitivity scenarios:
    1. Historical Reference Baseline (point-in-time survey benchmark)
    2. User-Assumed Scenario (interactive officer/farmer inputs)
    3. Adverse Weather Shock (-25% yield stress simulating severe dry spell)
    4. Market Price Shock (-20% farmgate price reduction simulating post-harvest glut)
    """
    # Baseline yield from point-in-time survey benchmark
    ref_yield = float(historical_benchmark_yield_kg_ha)
    # Adverse shock yield
    adverse_yield = round(ref_yield * (1.0 - adverse_shock_pct), 1)
    # Shocked selling price
    shocked_price = round(selling_price_rwf_per_kg * (1.0 - market_price_shock_pct), 2)

    scenario_configs = {
        "historical_reference": {
            "name": "Historical Reference Baseline",
            "description": "Point-in-time district survey benchmark yield",
            "yield_kg_ha": ref_yield,
            "price_rwf": selling_price_rwf_per_kg,
            "badge": "Historical Reference"
        },
        "user_custom": {
            "name": "User-Assumed Scenario",
            "description": "Interactive officer/farmer input assumption",
            "yield_kg_ha": user_assumed_yield_kg_ha,
            "price_rwf": selling_price_rwf_per_kg,
            "badge": "Farmer Assumption"
        },
        "adverse_shock": {
            "name": f"Adverse Weather Shock (-{int(adverse_shock_pct * 100)}%)",
            "description": "Simulates dry-spell stress during flowering/grain-filling",
            "yield_kg_ha": adverse_yield,
            "price_rwf": selling_price_rwf_per_kg,
            "badge": "Biophysical Shock"
        },
        "price_shock": {
            "name": f"Market Price Shock (-{int(market_price_shock_pct * 100)}%)",
            "description": "Simulates post-harvest local market surplus / price collapse",
            "yield_kg_ha": ref_yield,
            "price_rwf": shocked_price,
            "badge": "Market Shock"
        }
    }

    results = {}
    for key, cfg in scenario_configs.items():
        results[key] = {
            **cfg,
            "metrics": calculate_agricultural_cash_flow(
                cultivated_area_ha=cultivated_area_ha,
                yield_kg_per_ha=cfg["yield_kg_ha"],
                selling_price_rwf_per_kg=cfg["price_rwf"],
                total_operating_costs_rwf=total_operating_costs_rwf,
                debt_service_rwf=debt_service_rwf
            )
        }
    return results


def calculate_nais_insurance_hedging(
    crop: str,
    cultivated_area_ha: float,
    total_operating_costs_rwf: float,
    total_debt_service_rwf: float,
    is_available: bool = True
) -> Dict[str, Any]:
    """
    Calculates insurance coverage and bank exposure reduction based on verified NAIS parameters:
    - Minagri NAIS multi-peril area-yield crop insurance (Tekana Urishingiwe Muhinzi Mworozi)
    - Coverage: 80% of verified production cost
    - Deductible: 15%
    - Government subsidy: 40% of premium paid by MINAGRI
    - Farmer out-of-pocket premium: 60% of premium
    - Standard premium rate: 5.0% of production cost
    """
    if not is_available:
        return {
            "status": "unavailable",
            "message": "Insurance product information not currently available for this assessment."
        }

    # Gross actuarial premium (5% of production input cost)
    gross_premium_rwf = round(total_operating_costs_rwf * 0.05, 2)
    # MINAGRI 40% official subsidy
    government_subsidy_rwf = round(gross_premium_rwf * 0.40, 2)
    # Farmer 60% contribution
    farmer_premium_rwf = round(gross_premium_rwf * 0.60, 2)

    # Maximum indemnity payout (80% of production cost)
    max_coverage_rwf = round(total_operating_costs_rwf * 0.80, 2)
    deductible_pct = 15.0

    # Credit Exposure Analysis
    uninsured_exposure_rwf = round(total_debt_service_rwf, 2)
    # If policy is assigned to lending bank as first loss payee:
    insured_net_bank_exposure_rwf = max(0.0, round(total_debt_service_rwf - max_coverage_rwf, 2))
    exposure_reduction_pct = round(((uninsured_exposure_rwf - insured_net_bank_exposure_rwf) / uninsured_exposure_rwf) * 100.0, 1) if uninsured_exposure_rwf > 0 else 0.0

    return {
        "status": "active",
        "scheme_name": "National Agricultural Insurance Scheme (NAIS) / MINAGRI MPCI",
        "crop": crop,
        "cultivated_area_ha": float(cultivated_area_ha),
        "production_cost_basis_rwf": float(total_operating_costs_rwf),
        "gross_premium_rwf": float(gross_premium_rwf),
        "government_subsidy_rwf": float(government_subsidy_rwf),
        "government_subsidy_pct": 40.0,
        "farmer_premium_rwf": float(farmer_premium_rwf),
        "farmer_premium_pct": 60.0,
        "coverage_limit_pct": 80.0,
        "max_coverage_payout_rwf": float(max_coverage_rwf),
        "policy_deductible_pct": deductible_pct,
        "shortfall_strike_benchmark_pct": 70.0,
        "uninsured_bank_exposure_rwf": float(uninsured_exposure_rwf),
        "insured_net_bank_exposure_rwf": float(insured_net_bank_exposure_rwf),
        "bank_exposure_reduction_pct": float(exposure_reduction_pct),
        "first_loss_payee_assignment": True,
        "policy_verification_warning": (
            "NAIS terms vary across partner microfinance institutions and primary insurers. "
            "Area-yield coverage mitigates severe catastrophic shocks under certified yield loss, "
            "but does not guarantee debt repayment or substitute for primary seasonal cash-flow debt service coverage."
        ),
        "disclaimer": (
            "Insurance reduces catastrophic loss severity but does not guarantee debt repayment. "
            "Claim disbursement requires formal MINAGRI post-harvest field yield assessment."
        )
    }


def get_historical_survey_statistics(
    district: str = "Nyabihu",
    crop: str = "Maize"
) -> Dict[str, Any]:
    """
    Extracts authentic NISR survey sample size and empirical distribution
    from clean_sas_microdata.csv or clean_nisr.csv.
    """
    micro_path = PROCESSED_DIR / "clean_sas_microdata.csv"
    fallback_path = PROCESSED_DIR / "clean_nisr.csv"

    if micro_path.exists():
        df = pd.read_csv(micro_path)
    elif fallback_path.exists():
        df = pd.read_csv(fallback_path)
    else:
        return {
            "district": district,
            "crop": crop,
            "sample_size_n": 0,
            "mean_yield_kg_ha": 3800.0,
            "median_yield_kg_ha": 3800.0,
            "p10_yield_kg_ha": 2500.0,
            "p90_yield_kg_ha": 4500.0,
            "available_survey_years": "2019-2025",
            "is_available": False
        }

    sub = df[(df["district"] == district) & (df["crop"] == crop)]
    if len(sub) == 0:
        # Fallback to district average across crops or crop national average
        sub = df[df["crop"] == crop]
        if len(sub) == 0:
            sub = df

    yield_col = "yield_kg_per_ha" if "yield_kg_per_ha" in sub.columns else "yield_kg_ha"
    yields = sub[yield_col].dropna()

    years = sorted(sub["year"].unique().tolist()) if "year" in sub.columns else [2019, 2020, 2021, 2022, 2023, 2024, 2025]
    years_str = f"{min(years)}–{max(years)}" if years else "2019–2025"

    return {
        "district": district,
        "crop": crop,
        "sample_size_n": int(len(yields)),
        "mean_yield_kg_ha": round(float(yields.mean()), 1) if len(yields) > 0 else 3800.0,
        "median_yield_kg_ha": round(float(yields.median()), 1) if len(yields) > 0 else 3800.0,
        "p10_yield_kg_ha": round(float(yields.quantile(0.10)), 1) if len(yields) > 0 else 2500.0,
        "p90_yield_kg_ha": round(float(yields.quantile(0.90)), 1) if len(yields) > 0 else 4500.0,
        "available_survey_years": years_str,
        "is_available": True
    }

