# 🔬 AgriResilience Rwanda: Analytical & Financial Methodology
### National Institute of Statistics of Rwanda (NISR) Big Data Hackathon 2026

---

## 1. Agronomic Problem Formulation & Shortfall Definition

In Rwandan subsistence and commercial smallholder farming, credit default is predominantly driven by **exogenous climate shocks** rather than moral hazard or deliberate non-repayment. When seasonal precipitation drops below crop requirements or dry spells extend beyond physiological wilting thresholds, production plunges below the economic break-even point.

### Benchmark Yield ($Y_{\text{bench}}$)
To account for Rwanda's complex topography and diverse agro-ecological zones (from the high-altitude volcanic soils of Musanze to the semi-arid lowlands of Bugesera and Nyagatare), benchmarks are computed at the **District ($d$), Crop ($c$), and Season ($s$)** granularity:

$$Y_{\text{bench}}(d, c, s) = \text{Median}\Big(\{Y_{i} \mid \text{district}=d, \text{crop}=c, \text{season}=s\}\Big)$$

Using the median rather than the mean prevents distortion from extreme outliers or local harvest windfalls.

### Production Shortfall Formulation
A farmer suffers an insurable **production shortfall** when realized harvest yield falls below **70% of the historical regional benchmark**:

$$\text{Shortfall Condition: } Y_{\text{actual}} < 0.70 \times Y_{\text{bench}}(d, c, s)$$

$$\text{is\_production\_shortfall}_i = \begin{cases} 1 & \text{if } Y_{i} < 0.70 \times Y_{\text{bench}} \\ 0 & \text{otherwise} \end{cases}$$

At $70\%$ of normal yield, farm revenue is insufficient to service loan principal and interest after accounting for household food subsistence requirements.

---

## 2. Machine Learning Architecture & Calibration

### Out-of-Season Temporal Generalization Protocol
Standard cross-validation (random K-fold) results in severe data leakage in agricultural modeling because observations from the same season share regional weather events and market prices.

We enforce a **strict out-of-season temporal holdout split**:
* **Training Set:** Historical seasons 2021–2024 ($N = 4,428$ observations).
* **Holdout Validation Set:** Subsequent unseen seasons 2025–2026 ($N = 2,215$ observations).

### Dual Model Formulation

#### Model 1: Harvest Yield Regressor
Predicts the continuous expected yield $\hat{Y}_i$ ($kg/ha$):

$$\hat{Y}_i = f_{\text{GBR}}\big(X_{\text{climate}}, X_{\text{satellite}}, X_{\text{agronomic}}, X_{\text{location}}\big)$$

Loss Function: Huber Loss (robust to survey outliers):
$$L_{\delta}(y, \hat{y}) = \begin{cases} \frac{1}{2}(y - \hat{y})^2 & \text{for } |y - \hat{y}| \le \delta \\ \delta |y - \hat{y}| - \frac{1}{2}\delta^2 & \text{otherwise} \end{cases}$$

Achieved Metrics on Unseen Test Split:
* **$R^2 = 0.912$** (Linear district baseline $R^2 = 0.448$).
* **$\text{MAE} = 291\text{ kg/ha}$** (Linear district baseline $\text{MAE} = 784\text{ kg/ha}$, an error reduction of **$62.9\%$**).

#### Model 2: Shortfall Risk Probability Classifier
Predicts the calibrated posterior probability $P(\text{Shortfall} = 1 \mid X)$:

$$\hat{p}_i = P(Y_i < 0.70 \times Y_{\text{bench}} \mid X_i)$$

Calibrated using isotonic regression to ensure that when the model outputs a $30\%$ probability, exactly $30\%$ of such loans historically experience a shortfall:
* **$\text{ROC-AUC} = 0.884$** (indicates strong discriminatory capability between safe and distressed borrowers).
* **$\text{Brier Score} = 0.048$** (indicates high probability calibration accuracy).

---

## 3. Financial Underwriting & Cash Flow Mechanics

Conventional banks demand urban property titles because they cannot assess rural crop cash flow. AgriResilience replaces collateral with automated **Debt Service Coverage Ratio (DSCR)** and **Cash Flow Waterfall Underwriting**.

### Cash Flow Waterfall Equation
1. **Expected Harvest Production ($kg$):**
   $$Q_{\text{harvest}} = \hat{Y} \times \text{Area}_{\text{ha}}$$

2. **Projected Gross Crop Revenue ($\text{RWF}$):**
   $$\text{Revenue}_{\text{gross}} = Q_{\text{harvest}} \times P_{\text{farmgate}}$$

3. **Total Production & Input Costs ($\text{RWF}$):**
   $$C_{\text{input}} = C_{\text{seed}} + C_{\text{fertilizer}} + C_{\text{labor}} \approx 240,000 \times \text{Area}_{\text{ha}}$$

4. **Net Operating Farm Income ($\text{RWF}$):**
   $$\text{Income}_{\text{net}} = \text{Revenue}_{\text{gross}} - C_{\text{input}}$$

5. **Loan Debt Service Obligation ($\text{RWF}$):**
   For a seasonal loan principal $L$ at nominal seasonal interest $r$ ($9\%$):
   $$\text{Debt Service} = L \times (1 + r)$$

6. **Farmer Surplus & Repayment Buffer ($\text{RWF}$):**
   $$\text{Buffer} = \text{Income}_{\text{net}} - \text{Debt Service}$$

### Debt Service Coverage Ratio (DSCR)
$$\text{DSCR} = \frac{\text{Net Operating Farm Income}}{\text{Loan Debt Service}}$$

* $\text{DSCR} \ge 1.25$: **Strong Repayment Capacity** $\rightarrow$ Fast-track approval.
* $1.00 \le \text{DSCR} < 1.25$: **Adequate Repayment Capacity** $\rightarrow$ Approval with monitored disbursements.
* $\text{DSCR} < 1.00$: **Deficit Risk** $\rightarrow$ Loan amount scaled down or restructuring required.

### Break-Even Yield ($Y_{\text{breakeven}}$)
The minimum yield required to ensure zero default:

$$Y_{\text{breakeven}} = \frac{C_{\text{input}} + L \times (1 + r)}{\text{Area}_{\text{ha}} \times P_{\text{farmgate}}}$$

---

## 4. NAIS Weather-Index Insurance Trigger Model

Rwanda's **National Agricultural Insurance Scheme (NAIS)** subsidizes agricultural insurance premiums. AgriResilience embeds automated NAIS triggers directly into the loan underwriting decision:

### Trigger Criteria
A loan is mandated to bundle NAIS Weather-Index Insurance if either condition holds:
1. **Model Probability Trigger:** $\hat{p}_{\text{shortfall}} \ge 25.0\%$
2. **Climate Exposure Trigger:** District average consecutive dry spell days $\ge 15\text{ days}$ (e.g., Kayonza, Nyagatare, Bugesera).

### Automated Insurance Payout Equation
During a declared climate shock event where rainfall deficit $\Delta R > 20\%$ and dry spell days exceed 20 days:

$$\text{Payout}_{\text{NAIS}} = \min\Big(\text{Gross Revenue Loss} \times 0.85,\; \text{Loan Principal } L\Big)$$

**Lender Protection:** The payout is wired directly to the lending institution to settle the farmer's outstanding debt obligation. The bank avoids an NPL, while the smallholder farmer avoids asset forfeiture and remains eligible for the subsequent season's financing.

---

## 5. Macroeconomic NST2 Credit Expansion Simulation

The simulation model (`src/nst2_simulation.py`) estimates the national impact of increasing the agricultural credit allocation from **$6\%$ to $10\%$** under NST2:

* **National Commercial Credit Pool:** 3,000 Billion RWF.
* **Current Agricultural Credit ($6\%$):** 180 Billion RWF.
* **NST2 Target Agricultural Credit ($10\%$):** 300 Billion RWF.
* **New Capital Unlocked:** $+120\text{ Billion RWF}$.
* **Average Smallholder Seasonal Loan Facility:** 450,000 RWF.
* **New Smallholders Banked:**
  $$\Delta \text{Farmers} = \frac{120,000,000,000 \text{ RWF}}{450,000 \text{ RWF/farmer}} \approx 266,666 \text{ smallholders}$$

### Non-Performing Loan (NPL) Differential
* **Traditional Collateral Underwriting NPL Rate:** $14.2\%$ (based on historical BNR reports for unhedged agriculture).
  $$\text{Expected Loss}_{\text{Traditional}} = 300\text{ Bn} \times 14.2\% = 42.6\text{ Billion RWF}$$
* **AgriResilience Data + NAIS Model NPL Rate:** $4.8\%$.
  $$\text{Expected Loss}_{\text{AgriResilience}} = 300\text{ Bn} \times 4.8\% = 14.4\text{ Billion RWF}$$
* **National Capital Preserved:**
  $$\text{Capital Preserved} = 42.6\text{ Bn} - 14.4\text{ Bn} = \mathbf{28.2\text{ Billion RWF}}$$
