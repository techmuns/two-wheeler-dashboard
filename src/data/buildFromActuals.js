// Map an "actuals" JSON (audited annual-report dump like src/data/companies/tvs.json)
// into the dashboard's per-company shape.
//
// Rules:
//  - Only emit numbers the source actually disclosed. NA stays null / 'Pending'.
//  - Derived items (margins, FCF, growth) are computed from the disclosed
//    line items — they are not estimates.
//  - Every populated cell carries a source citation back to the annual report.

import { FY } from './_fy.js'
import { getIndustryGrowthSeries } from './performance.js'

// Align a series indexed by the source's fyAxis (e.g. ['FY16'..'FY25']) onto
// our shared FY axis ('FY16'..'FY27'). Forward years stay null.
const alignToFY = (series, sourceFyAxis) => {
  if (!series || !sourceFyAxis) return new Array(FY.length).fill(null)
  return FY.map((fy) => {
    const idx = sourceFyAxis.indexOf(fy)
    return idx >= 0 && typeof series[idx] === 'number' ? series[idx] : null
  })
}

const fmtPct = (v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : null)
const fmtPctSigned = (v) => (typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : null)
const fmtPpSigned  = (v) => (typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}pp` : null)
const fmtUnitsL    = (n) => (typeof n === 'number' ? `${(n / 100000).toFixed(2)} L` : null)
const fmtCr        = (v) => (typeof v === 'number' ? `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr` : null)

const toneFromDelta = (d, kind = 'pp') => {
  if (typeof d !== 'number') return 'flat'
  const t = kind === 'pp' ? 1 : 1
  if (d > t) return 'pos'
  if (d < -t) return 'neg'
  return 'flat'
}

const readFromDelta = (d, kind = 'pp') => {
  if (typeof d !== 'number') return 'Neutral'
  if (d > 1) return 'Positive'
  if (d < -1) return 'Negative'
  return 'Neutral'
}

const buildBlock = (columns, fy24, fy25, fmt) => {
  const change = fy25.map((v, i) => {
    const a = fy24[i]
    if (typeof a !== 'number' || typeof v !== 'number') return null
    return Number((v - a).toFixed(2))
  })
  const read = change.map((c, i) => (c === null ? 'Neutral' : readFromDelta(c, fmt[i])))
  return { columns, fy24, fy25, change, read, fmt }
}

export function buildFromActuals(json, opts = {}) {
  const { id, name, shortName, brandText, brandColor, dotColor, heroOverride, signal: signalOverride } = opts
  const isEmpty = !json || !json?.fyAxis || !json?.pl
  const ax = json?.fyAxis || []
  const fy24Idx = FY.indexOf('FY24')
  const fy25Idx = FY.indexOf('FY25')

  // ---- Series aligned to dashboard FY axis (FY16..FY27) ----
  const revenue       = alignToFY(json?.pl?.revenue, ax)
  const ebitda        = alignToFY(json?.pl?.ebitda, ax)
  const pat           = alignToFY(json?.pl?.pat, ax)
  const totalVolume   = alignToFY(json?.ops?.totalVolume, ax)

  const revGrowth     = alignToFY(json?.metrics?.revenueGrowth, ax)
  const volGrowth     = alignToFY(json?.metrics?.volumeGrowth, ax)
  const realGrowth    = alignToFY(json?.metrics?.realisationGrowth, ax)
  const ebitdaMargin  = alignToFY(json?.metrics?.ebitdaMargin, ax)
  const ebitMargin    = alignToFY(json?.metrics?.ebitMargin, ax)
  const patMargin     = alignToFY(json?.metrics?.patMargin, ax)
  const grossMargin   = alignToFY(json?.metrics?.grossMargin, ax)
  const debtEquity    = alignToFY(json?.metrics?.debtEquity, ax)
  const netDebtEquity = alignToFY(json?.metrics?.netDebtEquity, ax)
  const wcDays        = alignToFY(json?.metrics?.wcDays, ax)
  const fcfRev        = alignToFY(json?.metrics?.fcfRevenue, ax)
  const capexRev      = alignToFY(json?.metrics?.capexRevenue, ax)
  const roe           = alignToFY(json?.metrics?.roe, ax)
  const roce          = alignToFY(json?.metrics?.roce, ax)
  const evShare       = alignToFY(json?.metrics?.evShare, ax)

  const cfo   = alignToFY(json?.cf?.cfo, ax)
  const capex = alignToFY(json?.cf?.capex, ax)
  const fcf   = alignToFY(json?.cf?.fcf, ax)

  // FY values
  const v25 = (s) => s[fy25Idx]
  const v24 = (s) => s[fy24Idx]

  const revGrowthFy25     = v25(revGrowth)
  const revGrowthFy24     = v24(revGrowth)
  const volGrowthFy25     = v25(volGrowth)
  const volGrowthFy24     = v24(volGrowth)
  const ebitdaMarginFy25  = v25(ebitdaMargin)
  const ebitdaMarginFy24  = v24(ebitdaMargin)
  const evShareFy25       = v25(evShare)
  const evShareFy24       = v24(evShare)

  // ---- KPI cards ----
  const kpis = [
    {
      key: 'mktShare',
      label: 'Market Share %',
      value: null, sub: 'FY25', delta: null, tone: 'flat', fmt: 'pp',
      series: new Array(FY.length).fill(null),
      source: 'Pending — not in standalone audited statements',
    },
    {
      key: 'volGrowth',
      label: 'Volume Growth %',
      value: fmtPctSigned(volGrowthFy25),
      sub: 'FY25 YoY',
      delta: fmtPpSigned(typeof volGrowthFy25 === 'number' && typeof volGrowthFy24 === 'number' ? volGrowthFy25 - volGrowthFy24 : null),
      tone: toneFromDelta(typeof volGrowthFy25 === 'number' && typeof volGrowthFy24 === 'number' ? volGrowthFy25 - volGrowthFy24 : null),
      fmt: 'pp',
      series: volGrowth,
      source: json?.sources?.primary,
    },
    {
      key: 'revGrowth',
      label: 'Revenue Growth %',
      value: fmtPctSigned(revGrowthFy25),
      sub: 'FY25 YoY',
      delta: fmtPpSigned(typeof revGrowthFy25 === 'number' && typeof revGrowthFy24 === 'number' ? revGrowthFy25 - revGrowthFy24 : null),
      tone: toneFromDelta(typeof revGrowthFy25 === 'number' && typeof revGrowthFy24 === 'number' ? revGrowthFy25 - revGrowthFy24 : null),
      fmt: 'pp',
      series: revGrowth,
      source: json?.sources?.primary,
    },
    {
      key: 'ebitda',
      label: 'EBITDA Margin %',
      value: fmtPct(ebitdaMarginFy25),
      sub: 'FY25',
      delta: fmtPpSigned(typeof ebitdaMarginFy25 === 'number' && typeof ebitdaMarginFy24 === 'number' ? ebitdaMarginFy25 - ebitdaMarginFy24 : null),
      tone: toneFromDelta(typeof ebitdaMarginFy25 === 'number' && typeof ebitdaMarginFy24 === 'number' ? ebitdaMarginFy25 - ebitdaMarginFy24 : null),
      fmt: 'pp',
      series: ebitdaMargin,
      source: json?.sources?.primary,
    },
    {
      key: 'evMix',
      label: 'EV Mix %',
      value: fmtPct(evShareFy25),
      sub: 'FY25',
      delta: fmtPpSigned(typeof evShareFy25 === 'number' && typeof evShareFy24 === 'number' ? evShareFy25 - evShareFy24 : null),
      tone: 'pos',
      fmt: 'pp',
      series: evShare,
      source: 'TVS 2025 AR — EV volumes disclosed for FY25',
    },
    {
      key: 'exportMix',
      label: 'Export Mix %',
      value: null, sub: 'FY25', delta: null, tone: 'flat', fmt: 'pp',
      series: new Array(FY.length).fill(null),
      source: 'Pending — not consistently disclosed in audited statements',
    },
  ]

  // ---- Performance section ----
  // Left chart: TVS volume growth vs 2W industry (industry stays Pending here).
  const performance = {
    growth: {
      oem:      volGrowth,
      industry: getIndustryGrowthSeries(),
    },
    // Right chart: stacked product mix. Only FY25 has a real mix in the audited data;
    // earlier years stay null and render as gaps. We still expose the FY25 split so
    // the chart shows a single solid bar for FY25 rather than going fully blank.
    mix: (() => {
      const m = json?.metrics || {}
      const mc = new Array(FY.length).fill(null)
      const sc = new Array(FY.length).fill(null)
      const mp = new Array(FY.length).fill(null)
      const tw = new Array(FY.length).fill(null)
      if (typeof m.motorcycleMixFy25 === 'number') mc[fy25Idx] = m.motorcycleMixFy25
      if (typeof m.scooterMixFy25 === 'number')    sc[fy25Idx] = m.scooterMixFy25
      if (typeof m.mopedMixFy25 === 'number')      mp[fy25Idx] = m.mopedMixFy25
      if (typeof m.threeWheelerMixFy25 === 'number') tw[fy25Idx] = m.threeWheelerMixFy25
      return [
        { name: 'Motorcycles',   color: '#1F2937', values: mc },
        { name: 'Scooters',      color: '#3B82F6', values: sc },
        { name: 'Mopeds',        color: '#10B981', values: mp },
        { name: 'Three-Wheelers', color: '#F59E0B', values: tw },
      ]
    })(),
    // Rich per-FY volume mix consumed by PerformanceSection. Only FYs with
    // disclosed segment splits appear in productByFy / powertrainByFy.
    // geographyByFy is empty — TVS does not disclose domestic/export split
    // in its standalone audited statements.
    mixRich: (() => {
      const ops = json?.ops || {}
      const m = json?.metrics || {}
      const totalByFy = {}
      FY.forEach((fy, idx) => {
        const t = totalVolume[idx]
        if (typeof t === 'number') totalByFy[fy] = t
      })

      // Walk per-FY breakouts (motorcyclesByFy / scootersByFy / etc.) and
      // build a stacked-segment list for every FY where the AR / monthly
      // press releases disclose at least 3 of (M / S / 3W). Moped is
      // always residual = Total − (M + S + 3W).
      const productByFy = {}
      const mByFy   = ops.motorcyclesByFy   || {}
      const sByFy   = ops.scootersByFy      || {}
      const moByFy  = ops.mopedsByFy        || {}
      const twByFy  = ops.threeWheelersByFy || {}
      Object.keys(mByFy).forEach((fy) => {
        const total = totalByFy[fy]
        const m  = mByFy[fy]
        const s  = sByFy[fy]
        const tw = twByFy[fy]
        if (typeof total !== 'number' || typeof m !== 'number' || typeof s !== 'number' || typeof tw !== 'number') return
        // Use explicit Moped volume when the AR / PR breaks it out (FY23 case);
        // otherwise compute as residual and label accordingly (FY24 / FY25).
        const hasExplicitMoped = typeof moByFy[fy] === 'number'
        const mopedVolume      = hasExplicitMoped ? moByFy[fy] : Math.max(0, total - (m + s + tw))
        const mopedName        = hasExplicitMoped ? 'Mopeds' : 'Mopeds / Residual'
        productByFy[fy] = [
          { name: 'Motorcycles',  volume: m,            color: '#2563EB' },
          { name: 'Scooters',     volume: s,            color: '#0EA5E9' },
          { name: mopedName,      volume: mopedVolume,  color: '#10B981', residual: !hasExplicitMoped },
          { name: 'Three-Wheelers', volume: tw,         color: '#F59E0B' },
        ]
      })

      // Powertrain: every FY with a disclosed EV volume gets ICE / EV bars.
      // ICE is always derived as Total − EV.
      const powertrainByFy = {}
      const evByFy = ops.evByFy || {}
      Object.keys(evByFy).forEach((fy) => {
        const total = totalByFy[fy]
        const ev    = evByFy[fy]
        if (typeof total !== 'number' || typeof ev !== 'number') return
        powertrainByFy[fy] = [
          { name: 'ICE', volume: Math.max(0, total - ev), color: '#475569' },
          { name: 'EV',  volume: ev,                       color: '#10B981' },
        ]
      })

      // Geography: every FY with a disclosed Exports volume gets Domestic / Exports bars.
      const geographyByFy = {}
      const exportsByFy = ops.exportsByFy || {}
      Object.keys(exportsByFy).forEach((fy) => {
        const total = totalByFy[fy]
        const exp   = exportsByFy[fy]
        if (typeof total !== 'number' || typeof exp !== 'number') return
        geographyByFy[fy] = [
          { name: 'Domestic', volume: Math.max(0, total - exp), color: '#2563EB' },
          { name: 'Exports',  volume: exp,                       color: '#0EA5E9' },
        ]
      })

      return {
        totalByFy,
        productByFy,
        powertrainByFy,
        geographyByFy,
        dataStatus:   json?.dataStatus || null,
        sourcesByFy:  ops.sourcesByFy || null,
      }
    })(),
  }

  // ---- Product-Level Drivers (6 cards, FY25 absolute volumes) ----
  const ops = json?.ops || {}
  const totalVolFy25 = v25(totalVolume)
  const totalVolFy24 = v24(totalVolume)
  const totalYoY = typeof totalVolFy25 === 'number' && typeof totalVolFy24 === 'number' && totalVolFy24
    ? Number(((totalVolFy25 - totalVolFy24) / totalVolFy24 * 100).toFixed(1))
    : null

  const drivers = [
    { name: 'Motorcycles',     segment: 'Apache + Raider + Star City',  value: fmtUnitsL(ops.motorcyclesFy25),     sub: 'FY25 units', growth: '', tag: 'Gain' },
    { name: 'Scooters',        segment: 'Jupiter + NTorq + iQube',       value: fmtUnitsL(ops.scootersFy25),        sub: 'FY25 units', growth: '', tag: 'Gain' },
    { name: 'Mopeds',          segment: 'XL100',                          value: fmtUnitsL(ops.mopedsFy25),          sub: 'FY25 units', growth: '', tag: 'Stable' },
    { name: 'Three-Wheelers',  segment: 'King series',                    value: fmtUnitsL(ops.threeWheelersFy25),   sub: 'FY25 units', growth: '', tag: 'Stable' },
    { name: 'EV Two-Wheelers', segment: 'iQube',                          value: fmtUnitsL(ops.evVolumeFy25),        sub: 'FY25 units', growth: '', tag: 'Gain' },
    { name: 'Total Volume',    segment: 'All segments',                   value: fmtUnitsL(totalVolFy25),            sub: 'FY25 units', growth: totalYoY === null ? '' : `${totalYoY >= 0 ? '+' : ''}${totalYoY.toFixed(1)}%`, tag: totalYoY > 0 ? 'Gain' : 'Stable' },
  ].map((d) => (d.value === null ? { ...d, value: '—', tag: 'Pending' } : d))

  // ---- Supporting Data (table blocks) ----
  const supporting = {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [v24(revGrowth), v24(volGrowth), v24(realGrowth)],
      [v25(revGrowth), v25(volGrowth), v25(realGrowth)],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %', 'EBIT Margin %', 'PAT Margin %'],
      [v24(grossMargin), v24(ebitdaMargin), v24(ebitMargin), v24(patMargin)],
      [v25(grossMargin), v25(ebitdaMargin), v25(ebitMargin), v25(patMargin)],
      ['pp', 'pp', 'pp', 'pp'],
    ),
    'Balance Sheet': buildBlock(
      ['Debt / Equity', 'Net Debt / Equity', 'ROCE %', 'Working Capital Days'],
      [v24(debtEquity), v24(netDebtEquity), v24(roce), v24(wcDays)],
      [v25(debtEquity), v25(netDebtEquity), v25(roce), v25(wcDays)],
      ['abs', 'abs', 'pp', 'abs'],
    ),
    'Cash Flow': buildBlock(
      ['CFO (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)', 'FCF / Revenue %'],
      [v24(cfo), v24(fcf), v24(capex), v24(fcfRev)],
      [v25(cfo), v25(fcf), v25(capex), v25(fcfRev)],
      ['pct', 'pct', 'pct', 'pp'],
    ),
    'Product Mix': buildBlock(
      ['Motorcycles %', 'Scooters %', 'Mopeds %', 'EV %'],
      [null, null, null, null],
      [json?.metrics?.motorcycleMixFy25 ?? null, json?.metrics?.scooterMixFy25 ?? null, json?.metrics?.mopedMixFy25 ?? null, evShareFy25],
      ['pp', 'pp', 'pp', 'pp'],
    ),
    'Market Share': buildBlock(
      ['Domestic 2W %', 'Scooter %', 'EV 2W %'],
      [null, null, null],
      [null, null, null],
      ['pp', 'pp', 'pp'],
    ),
  }

  // ---- Chart series for each supporting block ----
  const C_DARK = '#1f2937', C_BLUE = '#3b82f6', C_GREEN = '#10b981', C_AMBER = '#f59e0b'
  const charts = {
    Growth: [
      { name: 'Revenue Growth %',     color: C_DARK,  values: revGrowth },
      { name: 'Volume Growth %',      color: C_BLUE,  values: volGrowth },
      { name: 'Realisation Growth %', color: C_GREEN, values: realGrowth },
    ],
    Margins: [
      { name: 'Gross Margin %',  color: C_DARK,  values: grossMargin },
      { name: 'EBITDA Margin %', color: C_BLUE,  values: ebitdaMargin },
      { name: 'EBIT Margin %',   color: C_GREEN, values: ebitMargin },
      { name: 'PAT Margin %',    color: C_AMBER, values: patMargin },
    ],
    'Balance Sheet': [
      { name: 'Net Debt / Equity', color: C_DARK,  values: netDebtEquity },
      { name: 'ROCE %',            color: C_BLUE,  values: roce },
      { name: 'ROE %',             color: C_GREEN, values: roe },
    ],
    'Cash Flow': [
      { name: 'CFO (₹ Cr)',   color: C_DARK,  values: cfo },
      { name: 'FCF (₹ Cr)',   color: C_BLUE,  values: fcf },
      { name: 'Capex (₹ Cr)', color: C_GREEN, values: capex },
    ],
    'Product Mix': [
      { name: 'EV Share %', color: C_GREEN, values: evShare },
    ],
    'Market Share': [
      { name: 'Domestic 2W %', color: C_DARK,  values: new Array(FY.length).fill(null) },
    ],
  }

  // ---- Updated date ----
  const updated = json?.fetchedAt
    ? new Date(json?.fetchedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return {
    id, name: opts.publicName || name, shortName, brandText, brandColor, dotColor,
    signal: signalOverride || (isEmpty ? 'Neutral' : 'Positive'),
    updated: isEmpty ? '—' : updated,
    dataFresh: isEmpty ? 'Pending' : 'Audited',
    hero: heroOverride || {
      title: shortName || name,
      subtitle: isEmpty
        ? 'Pending — annual-report workbook not yet uploaded'
        : 'Audited annual snapshot · FY16–FY25 standalone',
      fy: 'FY25',
    },
    kpis,
    performance,
    productDrivers: drivers,
    supportingData: supporting,
    charts,
    modelSource: isEmpty
      ? 'No source data uploaded yet for this company. Provide an audited financials workbook to populate.'
      : `Source: ${opts.publicName || name} Annual Reports FY16–FY25 (standalone audited) + audited Q4 result packages. Derived items computed from disclosed line items; no estimates.`,
    sourceCitations: json?.sources?.perFY || {},
    // Optional logo. When { path } is present the UI will try to load the
    // asset from public/<path>; on 404 or decode error it gracefully falls
    // back to the text wordmark. Never fetches from sourceUrl directly.
    logo: json?.logo || null,
  }
}
