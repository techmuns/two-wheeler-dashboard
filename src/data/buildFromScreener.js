// Map a Screener JSON dump (fetched by scripts/fetch-screener.mjs) into the
// dashboard's per-company shape.
//
// Rule: only emit numbers that Screener actually provided. Fields Screener
// doesn't cover (unit volumes, market share, mix, segment splits, governance)
// are explicitly left empty/null/'Pending' so the UI shows the pending state
// — never make up numbers.

import { FY } from './_fy.js'

// Align a Screener row (12 cols, labelled "FY16".."FY25","TTM") onto our
// shared FY axis (FY16..FY27). Forward years stay null.
const alignToFY = (row, periods) => {
  if (!row || !periods) return new Array(FY.length).fill(null)
  return FY.map((fy) => {
    const idx = periods.indexOf(fy)
    return idx >= 0 && typeof row[idx] === 'number' ? row[idx] : null
  })
}

const pickRow = (block, keys) => {
  if (!block?.rows) return null
  for (const k of keys) {
    if (block.rows[k]) return block.rows[k]
  }
  return null
}

const yoyDelta = (cur, prev) => {
  if (typeof cur !== 'number' || typeof prev !== 'number' || prev === 0) return null
  return Number((((cur - prev) / prev) * 100).toFixed(1))
}

const fmtPct = (v, suffix = '%') => (typeof v === 'number' ? `${v.toFixed(1)}${suffix}` : null)
const fmtPp = (v) => (typeof v === 'number' ? `${v > 0 ? '+' : ''}${v.toFixed(1)}pp` : null)
const fmtPctSigned = (v) => (typeof v === 'number' ? `${v > 0 ? '+' : ''}${v.toFixed(1)}%` : null)
const fmtAbs = (v, suffix = '') => (typeof v === 'number' ? `${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}${suffix}` : null)

const toneFor = (cur, prev, kind = 'pp') => {
  if (typeof cur !== 'number' || typeof prev !== 'number') return 'flat'
  const d = kind === 'pp' ? cur - prev : ((cur - prev) / (prev || 1)) * 100
  if (d > 1) return 'pos'
  if (d < -1) return 'neg'
  return 'flat'
}

const readFor = (cur, prev, kind = 'pp') => {
  if (typeof cur !== 'number' || typeof prev !== 'number') return 'Neutral'
  const d = kind === 'pp' ? cur - prev : ((cur - prev) / (prev || 1)) * 100
  if (d > 1) return 'Positive'
  if (d < -1) return 'Negative'
  return 'Neutral'
}

const buildBlock = (columns, fy24, fy25, fmt) => {
  const change = fy25.map((v, i) => {
    const a = fy24[i]
    if (typeof a !== 'number' || typeof v !== 'number') return null
    return Number((v - a).toFixed(1))
  })
  const read = change.map((c, i) => {
    if (c === null) return 'Neutral'
    if (fmt[i] === 'pp') {
      if (c > 1) return 'Positive'
      if (c < -1) return 'Negative'
      return 'Neutral'
    }
    if (c > 0) return 'Positive'
    if (c < 0) return 'Negative'
    return 'Neutral'
  })
  return { columns, fy24, fy25, change, read, fmt }
}

export function buildFromScreener(json, opts = {}) {
  const { id, name, shortName, brandText, brandColor, dotColor, signal = 'Neutral' } = opts
  const periods = json.profitLoss?.periods || []
  const hasData = periods.length > 0 && Object.keys(json.profitLoss?.rows || {}).length > 0

  const srcScr = json.sources?.screener || 'https://www.screener.in/'
  const fetchedAt = json.fetchedAt
  const updated = fetchedAt ? new Date(fetchedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  // Pull rows we know map cleanly onto Screener's labels.
  const sales      = alignToFY(pickRow(json.profitLoss, ['Sales', 'Revenue']),             periods)
  const opm        = alignToFY(pickRow(json.profitLoss, ['OPM %']),                        periods)
  const np         = alignToFY(pickRow(json.profitLoss, ['Net Profit', 'Net profit']),     periods)
  const expenses   = alignToFY(pickRow(json.profitLoss, ['Expenses']),                     periods)
  const ocf        = alignToFY(pickRow(json.cashFlow,   ['Cash from Operating Activity', 'Cash from Operating Activity +']), periods)
  const investing  = alignToFY(pickRow(json.cashFlow,   ['Cash from Investing Activity', 'Cash from Investing Activity +']), periods)
  const roce       = alignToFY(pickRow(json.ratios,     ['ROCE %']),                       periods)
  const wcd        = alignToFY(pickRow(json.ratios,     ['Working Capital Days']),         periods)
  const borrowings = alignToFY(pickRow(json.balanceSheet, ['Borrowings']),                 periods)
  const reserves   = alignToFY(pickRow(json.balanceSheet, ['Reserves']),                   periods)
  const eqCap      = alignToFY(pickRow(json.balanceSheet, ['Equity Capital']),             periods)

  // Derived series.
  const npm  = sales.map((s, i) => (typeof s === 'number' && typeof np[i] === 'number' && s !== 0 ? Number(((np[i] / s) * 100).toFixed(1)) : null))
  const gpm  = sales.map((s, i) => (typeof s === 'number' && typeof expenses[i] === 'number' && s !== 0 ? Number(((1 - expenses[i] / s) * 100).toFixed(1)) : null))
  const capex = investing.map((v) => (typeof v === 'number' ? -v : null))
  const fcf   = ocf.map((v, i) => (typeof v === 'number' && typeof capex[i] === 'number' ? Number((v - capex[i]).toFixed(0)) : null))
  const equity = eqCap.map((e, i) => (typeof e === 'number' && typeof reserves[i] === 'number' ? e + reserves[i] : null))
  const debtToEquity = borrowings.map((b, i) => (typeof b === 'number' && typeof equity[i] === 'number' && equity[i] !== 0 ? Number((b / equity[i]).toFixed(2)) : null))
  const revGrowthSeries = sales.map((v, i) => yoyDelta(v, sales[i - 1]))

  const fy24Idx = FY.indexOf('FY24')
  const fy25Idx = FY.indexOf('FY25')

  // ----- KPIs -----
  // Only the two metrics Screener cleanly supports are filled. Others stay Pending.
  const revGrowthFy25 = revGrowthSeries[fy25Idx]
  const revGrowthFy24 = revGrowthSeries[fy24Idx]
  const opmFy25 = opm[fy25Idx]
  const opmFy24 = opm[fy24Idx]

  const kpis = [
    { key: 'mktShare',  label: 'Market Share %',  value: null,                              sub: 'Domestic 2W FY25', delta: null, tone: 'flat', fmt: 'pp', series: new Array(FY.length).fill(null), source: 'SIAM (pending)' },
    { key: 'volGrowth', label: 'Volume Growth %', value: null,                              sub: 'FY25 YoY',          delta: null, tone: 'flat', fmt: 'pp', series: new Array(FY.length).fill(null), source: 'Company monthly sales releases (pending)' },
    { key: 'revGrowth', label: 'Revenue Growth %', value: fmtPctSigned(revGrowthFy25),       sub: 'FY25 YoY',          delta: fmtPp(yoyDelta(revGrowthFy25, revGrowthFy24)), tone: toneFor(revGrowthFy25, revGrowthFy24), fmt: 'pp', series: revGrowthSeries, source: srcScr },
    { key: 'ebitda',    label: 'EBITDA Margin %', value: fmtPct(opmFy25),                   sub: 'FY25 OPM',          delta: fmtPp(yoyDelta(opmFy25, opmFy24)), tone: toneFor(opmFy25, opmFy24), fmt: 'pp', series: opm, source: srcScr },
    { key: 'evMix',     label: 'EV Mix %',        value: null,                              sub: 'FY25 mix',          delta: null, tone: 'flat', fmt: 'pp', series: new Array(FY.length).fill(null), source: 'Vahan / company disclosures (pending)' },
    { key: 'exportMix', label: 'Export Mix %',    value: null,                              sub: 'FY25',              delta: null, tone: 'flat', fmt: 'pp', series: new Array(FY.length).fill(null), source: 'Company annual report (pending)' },
  ]

  // ----- Supporting Data -----
  const supporting = {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [revGrowthFy24, null, null],
      [revGrowthFy25, null, null],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [gpm[fy24Idx], opmFy24],
      [gpm[fy25Idx], opmFy25],
      ['pp', 'pp'],
    ),
    'Balance Sheet': buildBlock(
      ['Debt / Equity', 'ROCE %', 'Working Capital Days'],
      [debtToEquity[fy24Idx], roce[fy24Idx], wcd[fy24Idx]],
      [debtToEquity[fy25Idx], roce[fy25Idx], wcd[fy25Idx]],
      ['abs', 'pp', 'abs'],
    ),
    'Cash Flow': buildBlock(
      ['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'],
      [ocf[fy24Idx], fcf[fy24Idx], capex[fy24Idx]],
      [ocf[fy25Idx], fcf[fy25Idx], capex[fy25Idx]],
      ['pct', 'pct', 'pct'],
    ),
    'Product Mix': buildBlock(['Motorcycles %', 'Scooters %', 'EV %'], [null, null, null], [null, null, null], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['Domestic 2W %', 'Scooter %', 'EV 2W %'], [null, null, null], [null, null, null], ['pp', 'pp', 'pp']),
  }

  // ----- Chart series -----
  const C_DARK = '#1f2937', C_BLUE = '#3b82f6', C_GREEN = '#10b981'
  const charts = {
    Growth: [
      { name: 'Revenue Growth %', color: C_DARK, values: revGrowthSeries },
      { name: 'Volume Growth %',  color: C_BLUE, values: new Array(FY.length).fill(null) },
      { name: 'Realisation Growth %', color: C_GREEN, values: new Array(FY.length).fill(null) },
    ],
    Margins: [
      { name: 'Gross Margin %',  color: C_DARK, values: gpm },
      { name: 'EBITDA Margin %', color: C_BLUE, values: opm },
    ],
    'Balance Sheet': [
      { name: 'Debt / Equity', color: C_DARK, values: debtToEquity },
      { name: 'ROCE %',        color: C_BLUE, values: roce },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: C_DARK,  values: ocf },
      { name: 'FCF (₹ Cr)',   color: C_BLUE,  values: fcf },
      { name: 'Capex (₹ Cr)', color: C_GREEN, values: capex },
    ],
    'Product Mix': [
      { name: 'Motorcycles %', color: C_DARK,  values: new Array(FY.length).fill(null) },
      { name: 'Scooters %',    color: C_BLUE,  values: new Array(FY.length).fill(null) },
      { name: 'EV %',          color: C_GREEN, values: new Array(FY.length).fill(null) },
    ],
    'Market Share': [
      { name: 'Domestic 2W %', color: C_DARK,  values: new Array(FY.length).fill(null) },
      { name: 'Scooter %',     color: C_BLUE,  values: new Array(FY.length).fill(null) },
      { name: 'EV 2W %',       color: C_GREEN, values: new Array(FY.length).fill(null) },
    ],
  }

  // Volume-vs-industry comparison cannot be built from Screener.
  const performance = {
    growth: {
      oem: new Array(FY.length).fill(null),
      industry: new Array(FY.length).fill(null),
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: new Array(FY.length).fill(null) },
      { name: 'Scooters',    color: '#3b82f6', values: new Array(FY.length).fill(null) },
      { name: 'Mopeds',      color: '#10b981', values: new Array(FY.length).fill(null) },
      { name: 'EV 2W',       color: '#f59e0b', values: new Array(FY.length).fill(null) },
    ],
  }

  const productDrivers = [
    { name: 'Motorcycles',         segment: 'ICE', value: '—', sub: '', growth: '', tag: 'Pending' },
    { name: 'Scooters',            segment: 'Auto / Gear', value: '—', sub: '', growth: '', tag: 'Pending' },
    { name: 'Mopeds',              segment: 'Sub-100cc', value: '—', sub: '', growth: '', tag: 'Pending' },
    { name: 'EV Two-Wheelers',     segment: 'Electric', value: '—', sub: '', growth: '', tag: 'Pending' },
    { name: 'Premium Motorcycles', segment: '>150cc', value: '—', sub: '', growth: '', tag: 'Pending' },
    { name: 'Exports',             segment: 'All segments', value: '—', sub: '', growth: '', tag: 'Pending' },
  ]

  return {
    id,
    name,
    shortName,
    brandText,
    brandColor,
    dotColor,
    signal,
    updated,
    dataFresh: hasData ? 'Fresh' : 'Pending',
    hero: { title: name === 'TVS Motor Company Ltd' ? 'TVS' : (shortName || name), subtitle: 'Buy-side snapshot', fy: 'FY25' },
    kpis,
    performance,
    productDrivers,
    supportingData: supporting,
    charts,
    modelSource: hasData
      ? `Sourced from Screener (consolidated) on ${updated}. Volume / mix / market-share figures pending — Screener does not publish unit-level data. See: ${srcScr}`
      : `No Screener data fetched yet. Run the "Refresh Data" workflow to populate. See: ${srcScr}`,
  }
}
