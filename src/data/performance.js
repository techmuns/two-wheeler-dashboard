// Performance-section helpers.
// Pure functions over the company shape produced by buildFromActuals + the
// industry JSON. Used only by PerformanceSection.jsx — no other consumers.

import { FY } from './_fy.js'
import industryGrowth from './industry/2w-domestic-volume-growth.json'

const UNCLASSIFIED_COLOR = '#CBD5E1'

// Returns a series of industry growth % aligned to the dashboard FY axis.
// Missing years are null (rendered as gaps, never fake zero).
export function getIndustryGrowthSeries() {
  return FY.map((fy) => industryGrowth.series?.[fy] ?? null)
}

export function getIndustryMeta() {
  return {
    source: industryGrowth.source,
    sourceUrl: industryGrowth.sourceUrl,
    lastUpdated: industryGrowth.lastUpdated,
    forecastYears: industryGrowth.forecastYears || [],
    hasData: FY.some((fy) => typeof industryGrowth.series?.[fy] === 'number'),
  }
}

// Build a row-per-FY dataset for the left "growth vs industry" chart.
// shortName goes in as the OEM series key so the chart legend reads naturally.
export function getTvsGrowthVsIndustry(oemSeries, shortName) {
  const industry = getIndustryGrowthSeries()
  const meta = getIndustryMeta()
  const startIdx = FY.indexOf('FY18')
  return FY.slice(startIdx).map((fy, i) => ({
    fy,
    [shortName]: oemSeries?.[startIdx + i] ?? null,
    Industry: industry[startIdx + i],
    isForecast: meta.forecastYears.includes(fy),
  }))
}

// Allocate residual share to 'Unclassified' so segments sum to exactly 100%.
// IMPORTANT: if zero segments are disclosed for a year, return an empty array
// — the chart then renders no bar for that year, which is honest. A full-
// height 'Unclassified' bar would look like data when it isn't.
export function normalizeMixTo100(segments, total) {
  if (!total) return []
  if (!segments?.length) return []   // nothing disclosed → no bar
  const known = segments.reduce((acc, s) => acc + (typeof s.volume === 'number' ? s.volume : 0), 0)
  const remaining = Math.max(0, total - known)
  const out = segments.map((s) => ({
    ...s,
    percent: total > 0 ? (s.volume / total) * 100 : 0,
  }))
  if (remaining > 0.5 && known > 0) {
    // Only add Unclassified when SOME segments are disclosed — i.e. when it's
    // a true residual, not a stand-in for the entire year.
    out.push({
      name: 'Unclassified',
      volume: remaining,
      color: UNCLASSIFIED_COLOR,
      percent: total > 0 ? (remaining / total) * 100 : 0,
      isUnclassified: true,
    })
  }
  // Rounding correction so disclosed bars sum exactly to 100.
  const sum = out.reduce((a, b) => a + b.percent, 0)
  if (sum !== 100 && out.length) {
    out[out.length - 1].percent += (100 - sum)
  }
  return out
}

// Resolve the per-FY mix for a given mixType.
// Returns: { fy, total, segments[], unavailable }
export function getTvsVolumeMix(company, fy, mixType) {
  // mixRich is the source-of-truth object; the older .mix field is just the
  // legacy stacked-series shape used by some charts.
  const mix = company.performance?.mixRich || company.performance?.mix
  const total = mix?.totalByFy?.[fy] ?? null
  if (!total) return { fy, total: null, segments: [], unavailable: true }

  const key = (
    mixType === 'product'    ? 'productByFy' :
    mixType === 'powertrain' ? 'powertrainByFy' :
                                'geographyByFy'
  )
  const segments = mix?.[key]?.[fy]
  return { fy, total, segments: normalizeMixTo100(segments, total) }
}

// Per-mix-type source citation.
export function getMixSource(company, mixType) {
  return (
    mixType === 'product'    ? 'Product mix: TVS Motor FY25 Annual Report + Q4 FY25 investor presentation (segment volumes disclosed for FY25; earlier years not disclosed in audited standalone statements).' :
    mixType === 'powertrain' ? 'Powertrain mix: TVS Motor FY25 Annual Report (iQube electric volume disclosed for FY25); earlier-year ICE/EV split not disclosed.' :
                                'Domestic / Export split: not disclosed in TVS Motor standalone audited statements. Awaiting upload from monthly press releases / Vahan.'
  )
}

// Volume growth YoY between two FYs, given the per-FY total map. Returns null
// if either side is missing.
export function yoyForSegment(byFy, fy, fyMinus1, segmentName) {
  const a = byFy?.[fyMinus1]?.find((s) => s.name === segmentName)?.volume
  const b = byFy?.[fy]?.find((s) => s.name === segmentName)?.volume
  if (typeof a !== 'number' || typeof b !== 'number' || a === 0) return null
  return ((b - a) / a) * 100
}
