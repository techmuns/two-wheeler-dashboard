// Generic Supporting Data builder. Produces the 8-group dropdown structure
// from any OEM's audited workbook JSON (same schema as src/data/companies/tvs.json).
//
// - If the workbook is populated, available metrics show real data with audited
//   verification; not-disclosed metrics show Unavailable with a specific reason.
// - If the workbook is a skeleton (no fyAxis / no pl), every metric shows
//   Unavailable with reason "Awaiting <company> workbook upload" so the user
//   can see the structure that's waiting to be filled.

import { FY } from './_fy.js'
import marketShareJson from './industry/2w-market-share.json'

const SERIES_PALETTE = ['#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#6d28d9', '#dc2626', '#0EA5E9']

const NA_REASONS = {
  pending:       (n) => `Awaiting ${n} audited workbook upload. Drop the FY16–FY25 standalone workbook into src/data/companies/<id>.json to populate.`,
  standalone:    'Not disclosed in standalone audited statements; would need company KMP filings / investor handout extraction.',
  ccSlab:        'CC-slab (75–110 / 110–125 / 125–150 / 150–200 / 200–250 / 250–350 / >350) splits are not in standalone audited disclosures. Available in the SIAM "Engine Capacity-Wise" annual bulletin; requires upload.',
  mixHist:       'OEM does not disclose this mix line consistently across FY16–FY25 in standalone audited statements. Only FY25 value disclosed where available.',
  revMix:        'OEM does not disclose segment-level revenue split (EV / Motorcycle / Export revenue %) in standalone audited statements.',
  launches:      'Launch counts not published in audited financials; would need investor-presentation extraction across 10 annual decks.',
  profile:       'Company profile field (KMP / dealer count / employee count / credit rating / stock price) not in the uploaded workbook. Public sources: company investor portal, CRISIL Ratings, BSE/NSE price archive.',
}

const align = (arr, sourceAxis) => FY.map((fy) => {
  const i = sourceAxis?.indexOf?.(fy)
  return i !== undefined && i >= 0 && typeof arr?.[i] === 'number' ? arr[i] : null
})

const buildSinglePoint = (fy25Value) => {
  const arr = new Array(FY.length).fill(null)
  if (typeof fy25Value === 'number') arr[FY.indexOf('FY25')] = fy25Value
  return arr
}

const allNull = (arr) => !arr || arr.every((v) => typeof v !== 'number')

const NA = (label, fmt, reason, key) => ({
  key, label, fmt,
  series: new Array(FY.length).fill(null),
  verification: 'pending',
  source: null,
  unavailable: true,
  reason,
})

const OK = (key, label, fmt, series, verification, source, note) => ({
  key, label, fmt, series, verification, source, note: note || null, unavailable: false,
})

// Returns a metric object — automatically degrades to Unavailable if the
// resolved series is all-null.
const resolve = (key, label, fmt, series, verification, source, opts = {}) => {
  if (allNull(series)) {
    return NA(label, fmt, opts.naReason, key)
  }
  return OK(key, label, fmt, series, verification, source, opts.note)
}

// Build a 'profile' metric — uses the AR-sourced value when available, else NA.
const profileMetric = (label, fmt, key, value, source) =>
  (value === null || value === undefined || value === '')
    ? NA(label, fmt, source || 'Not disclosed in the uploaded annual report.', key)
    : { key, label, fmt, series: new Array(FY.length).fill(null), fy25: value, verification: 'available', source, unavailable: false }

export function buildSupportingGroups(raw, opts = {}) {
  const {
    shortName,
    publicName,
    marketShareKey,
  } = opts
  const prof = raw?.profile || null

  const isPopulated = !!(raw?.fyAxis?.length && raw?.pl && Object.keys(raw.pl).length > 0)
  const auditedSrc  = raw?.sources?.primary || null
  const ax = raw?.fyAxis || []

  // Pending reason used when the workbook is a skeleton (no data uploaded yet).
  const pendingReason = isPopulated ? NA_REASONS.standalone : NA_REASONS.pending(publicName || shortName || 'OEM')

  // ---------- raw series alignment ----------
  const s = {
    revenueGrowth:     align(raw?.metrics?.revenueGrowth, ax),
    volumeGrowth:      align(raw?.metrics?.volumeGrowth, ax),
    realisationGrowth: align(raw?.metrics?.realisationGrowth, ax),
    grossMargin:       align(raw?.metrics?.grossMargin, ax),
    ebitdaMargin:      align(raw?.metrics?.ebitdaMargin, ax),
    wcDays:            align(raw?.metrics?.wcDays, ax),
    capex:             align(raw?.cf?.capex, ax),
    evShare:           align(raw?.metrics?.evShare, ax),
    motorcycleMix:     buildSinglePoint(raw?.metrics?.motorcycleMixFy25),
    scooterMix:        buildSinglePoint(raw?.metrics?.scooterMixFy25),
    mopedMix:          buildSinglePoint(raw?.metrics?.mopedMixFy25),
    threeWheelerMix:   buildSinglePoint(raw?.metrics?.threeWheelerMixFy25),
  }

  // ---------- market share from industry file ----------
  const msKey = marketShareKey
  const mktShareRow = msKey ? marketShareJson.series?.[msKey] : null
  const mktShareSeries = FY.map((fy) => (typeof mktShareRow?.[fy] === 'number' ? mktShareRow[fy] : null))
  const mktSrc = marketShareJson.source

  // ---------- group definitions ----------
  const groups = [
    {
      name: 'Growth',
      chartType: 'line',
      metrics: [
        resolve('revenueGrowth',     'Revenue Growth %',     'pp', s.revenueGrowth,     'audited', auditedSrc, { naReason: pendingReason }),
        resolve('volumeGrowth',      'Volume Growth %',      'pp', s.volumeGrowth,      'audited', auditedSrc, { naReason: pendingReason }),
        resolve('realisationGrowth', 'Realisation Growth %', 'pp', s.realisationGrowth, 'audited', auditedSrc, { naReason: pendingReason }),
      ],
      sourceFootnote: isPopulated
        ? `Source: ${auditedSrc}. All three series computed FY-on-FY from disclosed revenue, volume, and revenue/volume realisation.`
        : pendingReason,
    },

    {
      name: 'Margins',
      chartType: 'line',
      metrics: [
        resolve('grossMargin',  'Gross Margin %',       'pp',  s.grossMargin,  'audited', auditedSrc, { naReason: pendingReason }),
        resolve('ebitdaMargin', 'EBITDA Margin %',      'pp',  s.ebitdaMargin, 'audited', auditedSrc, { naReason: pendingReason }),
        resolve('wcDays',       'Working Capital Days', 'abs', s.wcDays,       'audited', auditedSrc, { naReason: pendingReason }),
      ],
      sourceFootnote: isPopulated
        ? `Source: ${auditedSrc}. Margins from disclosed P&L lines; WC Days = (Receivables + Inventory − Payables) / Revenue × 365.`
        : pendingReason,
    },

    {
      name: 'Capacity & Capex',
      chartType: 'line',
      metrics: [
        NA('Capacity',               'abs', NA_REASONS.profile, 'capacity'),
        NA('Capacity Utilisation %', 'pp',  NA_REASONS.profile, 'capacityUtilisation'),
        resolve('capex', 'Capex (₹ Cr)', 'abs', s.capex, 'audited', auditedSrc, { naReason: pendingReason }),
      ],
      sourceFootnote: isPopulated
        ? `Capex from ${auditedSrc}. Capacity + utilisation %: ${NA_REASONS.profile}`
        : pendingReason,
    },

    {
      name: 'Market Share',
      chartType: 'line',
      metrics: [
        resolve('marketShare', `Market Share % (overall 2W)`, 'pp', mktShareSeries, 'approximate', mktSrc,
          { naReason: msKey ? 'Market-share row not found in SIAM industry file.' : 'No market-share key configured for this OEM.', note: 'Approximate — from SIAM industry file; verify against latest SIAM bulletin.' }),
        NA('75–110CC Market Share',  'pp', NA_REASONS.ccSlab, 'ms_75_110'),
        NA('110–125CC Market Share', 'pp', NA_REASONS.ccSlab, 'ms_110_125'),
        NA('125–150CC Market Share', 'pp', NA_REASONS.ccSlab, 'ms_125_150'),
        NA('150–200CC Market Share', 'pp', NA_REASONS.ccSlab, 'ms_150_200'),
        NA('200–250CC Market Share', 'pp', NA_REASONS.ccSlab, 'ms_200_250'),
        NA('250–350CC Market Share', 'pp', NA_REASONS.ccSlab, 'ms_250_350'),
        NA('>350CC Market Share',    'pp', NA_REASONS.ccSlab, 'ms_350_plus'),
      ],
      sourceFootnote: `Overall 2W share from ${mktSrc} (approximate). CC-slab share: ${NA_REASONS.ccSlab}`,
    },

    {
      name: 'Volume Mix',
      chartType: 'line',
      metrics: [
        NA('Export Volume %',     'pp', NA_REASONS.mixHist, 'exportVolume'),
        resolve('evVolume',         'EV Volume %',          'pp', s.evShare,          'audited', auditedSrc, { naReason: pendingReason, note: 'Disclosed in audited workbook where available; FY25 reflects EV unit count / total volume.' }),
        resolve('motorcycleVolume', 'Motorcycle Volume %',  'pp', s.motorcycleMix,    'audited', auditedSrc, { naReason: pendingReason, note: 'FY25 only where workbook discloses unit-level segment split.' }),
        resolve('scooterVolume',    'Scooter Volume %',     'pp', s.scooterMix,       'audited', auditedSrc, { naReason: pendingReason, note: 'FY25 only.' }),
        resolve('mopedVolume',      'Moped Volume %',       'pp', s.mopedMix,         'audited', auditedSrc, { naReason: pendingReason, note: 'FY25 only.' }),
        resolve('threeWheelerVolume', 'Three-Wheeler Volume %', 'pp', s.threeWheelerMix, 'audited', auditedSrc, { naReason: pendingReason, note: 'FY25 only.' }),
        NA('75–110CC Volume',  'abs', NA_REASONS.ccSlab, 'v_75_110'),
        NA('110–125CC Volume', 'abs', NA_REASONS.ccSlab, 'v_110_125'),
        NA('125–150CC Volume', 'abs', NA_REASONS.ccSlab, 'v_125_150'),
        NA('150–200CC Volume', 'abs', NA_REASONS.ccSlab, 'v_150_200'),
        NA('200–250CC Volume', 'abs', NA_REASONS.ccSlab, 'v_200_250'),
        NA('250–350CC Volume', 'abs', NA_REASONS.ccSlab, 'v_250_350'),
        NA('>350CC Volume',    'abs', NA_REASONS.ccSlab, 'v_350_plus'),
      ],
      sourceFootnote: isPopulated
        ? `EV / Motorcycle / Scooter / Moped / 3W mix from ${auditedSrc} (FY25 only). Export mix and CC-slab volumes: not in workbook.`
        : pendingReason,
    },

    {
      name: 'Revenue Mix',
      chartType: 'line',
      metrics: [
        NA('Export Revenue %',     'pp', NA_REASONS.revMix, 'exportRevenue'),
        NA('EV Revenue %',         'pp', NA_REASONS.revMix, 'evRevenue'),
        NA('Motorcycle Revenue %', 'pp', NA_REASONS.revMix, 'motorcycleRevenue'),
      ],
      sourceFootnote: NA_REASONS.revMix,
    },

    {
      name: 'Product / Launches',
      chartType: 'profile',
      metrics: [
        NA('New Model Launches (Nos.)', 'abs',  NA_REASONS.launches, 'newLaunches'),
        NA('Facelift Launches (Nos.)',  'abs',  NA_REASONS.launches, 'faceliftLaunches'),
        NA('Top Selling Model',         'text', NA_REASONS.launches, 'topSellingModel'),
      ],
      sourceFootnote: NA_REASONS.launches,
    },

    // NOTE: 'Company Profile' group intentionally removed from this dropdown.
    // KMP / dealers / employees / credit rating / manufacturing all live on
    // the Governance & Network card directly on the main page now, so
    // duplicating them inside Supporting Data was pure clutter.
  ]

  return groups
}

// ----------------------------------------------------------------------------
// Same helpers as supportingTvs (kept here so other companies don't need to
// import the TVS-specific module).
// ----------------------------------------------------------------------------
const fy24Idx = FY.indexOf('FY24')
const fy25Idx = FY.indexOf('FY25')

export function getMetricRead(curr, prev, fmt) {
  if (typeof curr !== 'number' || typeof prev !== 'number') return 'Neutral'
  const d = curr - prev
  if (d > 1) return 'Positive'
  if (d < -1) return 'Negative'
  return 'Neutral'
}

export function getSupportingData(group) {
  return group.metrics.map((m) => {
    const fy24 = m.series?.[fy24Idx]
    const fy25 = m.series?.[fy25Idx]
    const change = (typeof fy24 === 'number' && typeof fy25 === 'number') ? Number((fy25 - fy24).toFixed(2)) : null
    const read = m.unavailable ? 'Neutral' : getMetricRead(fy25, fy24, m.fmt)
    return { ...m, fy24, fy25, change, read }
  })
}

export function getSupportingChartData(group) {
  const series = group.metrics
    .filter((m) => !m.unavailable && m.series?.some((v) => typeof v === 'number'))
    .map((m, idx) => ({
      name: m.label,
      color: SERIES_PALETTE[idx % SERIES_PALETTE.length],
      values: m.series,
      fmt: m.fmt,
    }))
  return {
    type: group.chartType,
    series,
    hasAny: series.length > 0,
    allUnavailable: group.metrics.every((m) => m.unavailable),
  }
}

export function normalizeMixTo100(rows) {
  const sum = rows.reduce((a, b) => a + (typeof b.value === 'number' ? b.value : 0), 0)
  if (sum === 0) return rows.map((r) => ({ ...r, percent: 0 }))
  const out = rows.map((r) => ({ ...r, percent: (r.value / sum) * 100 }))
  const total = out.reduce((a, b) => a + b.percent, 0)
  if (total < 99.5) {
    out.push({ name: 'Unclassified', value: null, percent: 100 - total, isUnclassified: true })
  }
  return out
}
