# Two-Wheeler Dashboard — Data Audit

_Generated 2026-05-21T09:54:57.223Z by `scripts/audit-data.mjs`._

This audit reads every per-OEM JSON, computes coverage, runs accounting cross-checks (e.g. EBITDA margin = EBITDA / Revenue, FCF = CFO − Capex, Net debt = Total debt − Cash) and flags discrepancies > tolerance.

## 1. Coverage summary

| OEM | Basis | fyAxis | P&L cells | BS cells | CF cells | Ops cells | Metrics cells | Verification |
|---|---|---|---|---|---|---|---|---|
| **tvs** | Standalone | 10 FYs | 80/80 | 90/90 | 50/50 | 64/70 | 165/170 | audited (curated AR text) |
| **bajaj** | Standalone | 10 FYs | 24/80 | 27/90 | 15/50 | 17/80 | 45/170 | audited (curated AR text) |
| **hero** | Standalone | 10 FYs | 24/80 | 27/90 | 15/50 | 10/70 | 47/170 | audited (curated AR text) |
| **eicher** | Consolidated | 10 FYs | 72/80 | 36/40 | 36/50 | 0/10 | 62/80 | audited (Screener sidecar) |
| **ola** | Consolidated | 10 FYs | 40/80 | 20/40 | 20/50 | 0/10 | 30/80 | audited (Screener sidecar) |

## 2. P&L coverage by FY

| OEM | FY16 | FY17 | FY18 | FY19 | FY20 | FY21 | FY22 | FY23 | FY24 | FY25 |
|---|---|---|---|---|---|---|---|---|---|---|
| tvs | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| bajaj | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟢 | 🟢 | 🟢 |
| hero | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟢 | 🟢 | 🟢 |
| eicher | ⚪ | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| ola | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |

Legend: 🟢 full · 🟡 partial · ⚪ none · · no block

## 3. Operations coverage by FY

| OEM | FY16 | FY17 | FY18 | FY19 | FY20 | FY21 | FY22 | FY23 | FY24 | FY25 |
|---|---|---|---|---|---|---|---|---|---|---|
| tvs | 🟡5/6 | 🟡5/6 | 🟡5/6 | 🟡5/6 | 🟡5/6 | 🟡5/6 | 🟢 | 🟢 | 🟢 | 🟢 |
| bajaj | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟡2/4 | 🟢 | 🟢 | 🟢 |
| hero | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | 🟡3/4 | 🟢 |
| eicher | · | · | · | · | · | · | · | · | · | · |
| ola | · | · | · | · | · | · | · | · | · | · |

## 4. Accounting cross-checks

### tvs — 100 PASS · 0 FAIL · 100 total

_All 100 computable checks pass within tolerance._

### bajaj — 30 PASS · 0 FAIL · 30 total

_All 30 computable checks pass within tolerance._

### hero — 29 PASS · 0 FAIL · 29 total

_All 29 computable checks pass within tolerance._

### eicher — 54 PASS · 0 FAIL · 54 total

_All 54 computable checks pass within tolerance._

### ola — 27 PASS · 0 FAIL · 27 total

_All 27 computable checks pass within tolerance._

## 5. Source provenance

| OEM | Primary source | Notes |
|---|---|---|
| tvs | TVS Motor Company Annual Reports FY16–FY25 (standalone audited) + audited Q4 result packages | Derived items (EBITDA, EBIT, FCF, ratios, margins) computed from disclosed line items. No estimates used. Consolidated T |
| bajaj | Bajaj Auto Limited Annual Reports FY2023-24 (17th AR) and FY2024-25 (18th AR), standalone audited financial statements. Auditors: S R B C &  | Standalone basis (not Consolidated). Consolidated KTM / PBAG / BACL / BATL financials excluded. EBITDA as reported by ma |
| hero | Hero MotoCorp Limited Annual Reports — 42nd AR (FY24-25) and 41st AR (FY23-24), Standalone audited financial statements. | Hero MotoCorp standalone has effectively no debt — only Ind AS 116 lease liabilities are reported under financial liabil |
| eicher | Screener.in consolidated financials — https://www.screener.in/company/EICHERMOT/consolidated/ | Pulled by scripts/fetch-screener.mjs from screener.in. Operational data (unit volumes, segment splits, exports, EV, mark |
| ola | Screener.in consolidated financials — https://www.screener.in/company/OLAELEC/consolidated/ | Pulled by scripts/fetch-screener.mjs from screener.in. Operational data (unit volumes, segment splits, exports, EV, mark |

## 6. Anomaly flags

- **ola** FY22 revenue +37200.0% YoY (verify — large swing)
- **ola** FY23 revenue +605.4% YoY (verify — large swing)
- **ola** FY24 revenue +90.4% YoY (verify — large swing)

## 7. Pending / not-applicable cells

**tvs**
- Export Revenue %
- Capacity Utilisation %
- New Model Launches
- Facelift Launches
- Top Selling Model
- Stock Price 31-Mar

**bajaj**
- Gross Margin (cost-of-materials disclosed but excludes traded-goods purchase + COGS not separately reconciled)
- Capacity Utilisation %
- Stock Price 31-Mar
- Model-wise volume split (Pulsar / CT / Platina / Avenger / Dominar / Freedom)

**hero**
- Mopeds (Hero does not manufacture)
- Three-wheelers (Hero does not manufacture)
- Export Revenue % by FY pre-FY24
- Capacity Utilisation %
- Top Selling Model unit count
- Stock Price 31-Mar

**eicher**
- Volume splits (M / S / Mo / 3W)
- EV / iQube volume
- 2W exports
- Market share (overall + CC-slab)
- KMP, employees, dealers, credit rating

**ola**
- Volume splits (M / S / Mo / 3W)
- EV / iQube volume
- 2W exports
- Market share (overall + CC-slab)
- KMP, employees, dealers, credit rating
