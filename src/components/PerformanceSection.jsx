import React, { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, ReferenceLine,
} from 'recharts'
import { FY } from '../data.js'
import {
  getTvsGrowthVsIndustry,
  getTvsVolumeMix,
  getIndustryMeta,
  getMixSource,
  yoyForSegment,
} from '../data/performance.js'

const AXIS_TICK = { fontSize: 10.5, fill: '#64748B' }
const GRID = '#F1F5F9'
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #E5EAF0',
  fontSize: 12,
  boxShadow: '0 6px 20px rgba(15,23,42,0.08)',
  padding: '10px 12px',
}

const MIX_TYPES = [
  { key: 'product',    label: 'Product Mix' },
  { key: 'powertrain', label: 'Powertrain Mix' },
  { key: 'geography',  label: 'Domestic / Export' },
]

const fmtUnitsL = (n) =>
  typeof n === 'number' ? `${(n / 100000).toFixed(2)} L` : '—'

const fmtPct = (v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—')
const fmtPctSigned = (v) =>
  typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : '—'

// ============================================================================
// LEFT: Growth vs Industry (grouped bars)
// ============================================================================
function GrowthChart({ rows, oemKey }) {
  const forecastSet = useMemo(
    () => new Set(rows.filter((r) => r.isForecast).map((r) => r.fy)),
    [rows],
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42} tickFormatter={(v) => `${v}%`} />
        <ReferenceLine y={0} stroke="#CBD5E1" strokeWidth={1} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(v, name) => [typeof v === 'number' ? `${v.toFixed(1)}%` : '—', name]}
          labelFormatter={(label) => (forecastSet.has(label) ? `${label} (forecast)` : label)}
        />
        <Bar dataKey="Industry" fill="#CBD5E1" radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {rows.map((r) => (
            <Cell key={`ind-${r.fy}`} fill={r.isForecast ? '#E2E8F0' : '#CBD5E1'} fillOpacity={r.isForecast ? 0.7 : 1} />
          ))}
        </Bar>
        <Bar dataKey={oemKey} fill="#2563EB" radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {rows.map((r) => (
            <Cell key={`oem-${r.fy}`} fill={r.isForecast ? '#93B4F4' : '#2563EB'} fillOpacity={r.isForecast ? 0.8 : 1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ============================================================================
// RIGHT: Volume Mix (stacked 100% bars with internal toggles)
// ============================================================================
function MixChart({ rows, segmentNames, segmentColors, onHoverFy }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={rows}
        margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
        barCategoryGap="20%"
        stackOffset="expand"
        onMouseMove={(e) => e?.activeLabel && onHoverFy?.(e.activeLabel)}
        onMouseLeave={() => onHoverFy?.(null)}
      >
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          width={42}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
        />
        <Tooltip content={<MixTooltip />} />
        {segmentNames.map((name, idx) => (
          <Bar
            key={name}
            dataKey={name}
            stackId="mix"
            fill={segmentColors[name] || '#CBD5E1'}
            radius={idx === segmentNames.length - 1 ? [2, 2, 0, 0] : 0}
            isAnimationActive={true}
            animationDuration={220}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

function MixTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  const total = row.__total
  // Filter to segments that actually have a disclosed value (> 0).
  const disclosed = payload.filter((p) => typeof row[p.dataKey] === 'number' && row[p.dataKey] > 0)
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ fontWeight: 600, color: '#0F1B2D', marginBottom: 6 }}>
        {label} <span style={{ color: '#94A3B8', fontWeight: 400 }}>· {fmtUnitsL(total)} total</span>
      </div>
      {disclosed.length === 0 && (
        <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>
          Segment split not disclosed for {label} in the audited workbook.
        </div>
      )}
      {disclosed.map((p) => {
        const segName = p.dataKey
        const vol = row[segName]
        const pct = total > 0 && typeof vol === 'number' ? (vol / total) * 100 : null
        const yoy = row.__yoy?.[segName]
        return (
          <div key={segName} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '2px 0' }}>
            <span style={{ width: 8, height: 8, background: p.color, borderRadius: 2, display: 'inline-block' }} />
            <span style={{ color: '#475569', minWidth: 110 }}>{segName}</span>
            <span style={{ color: '#0F1B2D', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {fmtUnitsL(vol)}
            </span>
            <span style={{ color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(pct)}</span>
            {typeof yoy === 'number' && (
              <span
                style={{
                  color: yoy >= 0 ? '#1F7A45' : '#9F1F2E',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmtPctSigned(yoy)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// SECTION
// ============================================================================
export default function PerformanceSection({ company }) {
  const performance = company.performance
  if (!performance) return null

  const [mixType, setMixType] = useState('product')
  const [hoveredFy, setHoveredFy] = useState(null)

  const oemKey = company.shortName || company.name
  const industryMeta = getIndustryMeta()

  // ---- Left chart data ----
  const growthRows = useMemo(
    () => getTvsGrowthVsIndustry(performance.growth?.oem, oemKey),
    [performance.growth?.oem, oemKey],
  )
  const growthHasOem = growthRows.some((r) => typeof r[oemKey] === 'number')

  // ---- Right chart data ----
  // Always render FY18..FY25 axis to match the left chart. FYs without
  // segment-level disclosure render as a solid 'Unclassified' grey bar.
  const mixFyAxis = useMemo(() => {
    const start = FY.indexOf('FY18')
    return FY.slice(start, FY.indexOf('FY25') + 1)
  }, [])

  const mixRowsRaw = useMemo(
    () => mixFyAxis.map((fy) => getTvsVolumeMix(company, fy, mixType)),
    [company, mixType, mixFyAxis],
  )

  // Collect union of segment names across rows so each becomes its own <Bar/>.
  const segmentNames = useMemo(() => {
    const names = []
    mixRowsRaw.forEach((r) => {
      r.segments.forEach((s) => {
        if (!names.includes(s.name)) names.push(s.name)
      })
    })
    // Push 'Unclassified' to the end so it stacks on top.
    const u = names.indexOf('Unclassified')
    if (u > -1) {
      names.splice(u, 1)
      names.push('Unclassified')
    }
    return names
  }, [mixRowsRaw])

  const segmentColors = useMemo(() => {
    const colors = {}
    mixRowsRaw.forEach((r) =>
      r.segments.forEach((s) => {
        if (!colors[s.name]) colors[s.name] = s.color
      }),
    )
    return colors
  }, [mixRowsRaw])

  // Build chart rows: one per FY, keys = segmentNames mapped to raw volume.
  // Plus __total and __yoy for the tooltip.
  const previousMix = useMemo(() => {
    const byMixType = (
      mixType === 'product' ? company.performance?.mixRich?.productByFy :
      mixType === 'powertrain' ? company.performance?.mixRich?.powertrainByFy :
      company.performance?.mixRich?.geographyByFy
    ) || {}
    return byMixType
  }, [company.performance?.mixRich, mixType])

  const chartRows = useMemo(() => {
    return mixRowsRaw.map((r, idx) => {
      const row = { fy: r.fy, __total: r.total }
      // Years with no disclosed segments leave all keys absent — Recharts
      // renders no bar for them, so empty space = honest 'not disclosed'.
      segmentNames.forEach((n) => { row[n] = null })
      r.segments.forEach((s) => { row[s.name] = s.volume })
      // YoY change per segment (vs previous FY in this rolling axis).
      const prevFy = idx > 0 ? mixRowsRaw[idx - 1].fy : null
      if (prevFy) {
        row.__yoy = {}
        segmentNames.forEach((n) => {
          const yoy = yoyForSegment(previousMix, r.fy, prevFy, n)
          if (typeof yoy === 'number') row.__yoy[n] = yoy
        })
      }
      return row
    })
  }, [mixRowsRaw, segmentNames, previousMix])

  // Coverage indicator: how many FYs in the axis have at least one disclosed segment.
  const disclosedFyCount = mixRowsRaw.filter((r) => r.segments.some((s) => !s.isUnclassified)).length
  const disclosedFyLabels = mixRowsRaw.filter((r) => r.segments.some((s) => !s.isUnclassified)).map((r) => r.fy)

  // ---- Selected-FY meta ----
  const activeFy = hoveredFy || 'FY25'
  const activeRow = chartRows.find((r) => r.fy === activeFy)
  const activeTotal = activeRow?.__total
  const prevTotal = (() => {
    const i = mixFyAxis.indexOf(activeFy)
    if (i <= 0) return null
    return chartRows[i - 1]?.__total
  })()
  const activeYoy =
    typeof activeTotal === 'number' && typeof prevTotal === 'number' && prevTotal > 0
      ? ((activeTotal - prevTotal) / prevTotal) * 100
      : null

  const activeMixLabel = MIX_TYPES.find((m) => m.key === mixType)?.label || ''

  // ---- Legend items for right chart (unique colors) ----
  const legendItems = segmentNames.map((n) => ({ name: n, color: segmentColors[n] || '#CBD5E1' }))

  // ---- Source footnotes ----
  const mixSource = getMixSource(company, mixType)

  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Performance</span>
        <span className="section-hint">Growth · Mix · Composition</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ===== Left — Growth vs Industry ===== */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">{oemKey} growth vs 2W industry</div>
                <div className="chart-panel-sub">Volume Growth % · FY18–FY27 · forecast lighter</div>
              </div>
              <span className="bsr-pill">%</span>
            </div>
            <div className="chart-panel-meta">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#2563EB' }} />
                {oemKey}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#CBD5E1' }} />
                2W Industry
              </span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              {growthHasOem ? (
                <GrowthChart rows={growthRows} oemKey={oemKey} />
              ) : (
                <PendingShell note={`Volume growth not available for ${oemKey}.`} />
              )}
            </div>
            <div className="chart-legend">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#2563EB' }} />
                {oemKey} volume growth %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#CBD5E1' }} />
                2W industry domestic volume growth %
              </span>
            </div>
            <div className="chart-source">
              {oemKey} growth from audited annual reports.{' '}
              {industryMeta.hasData
                ? `Industry growth: ${industryMeta.source}.`
                : `Industry growth: ${industryMeta.source} — series pending upload (gaps show null, not zero).`}
              {' '}FY26–FY27 styled lighter as forecast.
            </div>
          </div>
        </div>

        {/* ===== Right — Volume composition with toggles ===== */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">Where {oemKey}'s volume is coming from</div>
                <div className="chart-panel-sub">Total sales volume by selected mix</div>
              </div>
              <span className="bsr-pill">Mix %</span>
            </div>
            <div className="chart-panel-meta items-center" style={{ minHeight: 32 }}>
              <div className="flex gap-1 bg-[#F4F6FA] rounded-md p-0.5 border border-[#E5EAF1]">
                {MIX_TYPES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMixType(m.key)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                      mixType === m.key
                        ? 'bg-white text-[#6D28D9] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                        : 'text-[#475569] hover:text-[#0F1B2D]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#475569] tabular-nums ml-auto">
                <span className="text-[#94A3B8]">{activeFy}</span>{' · '}
                Total <span className="text-[#0F1B2D] font-semibold">{fmtUnitsL(activeTotal)}</span>{' · '}
                YoY{' '}
                <span
                  className={`font-semibold ${
                    typeof activeYoy === 'number'
                      ? activeYoy >= 0 ? 'text-[#1F7A45]' : 'text-[#9F1F2E]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {fmtPctSigned(activeYoy)}
                </span>{' · '}
                <span className="text-[#94A3B8]">{activeMixLabel}</span>
              </span>
            </div>
            {disclosedFyCount < mixRowsRaw.length && (
              <div
                className="text-[11px] mt-1.5 px-2 py-1 rounded"
                style={{ background: '#FBEFDC', color: '#7C3A07', border: '1px solid #F5C97A' }}
              >
                <span className="font-semibold">{disclosedFyCount} of {mixRowsRaw.length} FYs disclosed</span>
                {disclosedFyCount > 0 && (
                  <> ({disclosedFyLabels.join(', ')}) — earlier years not broken out in the audited workbook, so they render as empty space.</>
                )}
                {disclosedFyCount === 0 && ' — none of the FYs in this axis carry a disclosed split for this mix type.'}
              </div>
            )}
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              <MixChart
                rows={chartRows}
                segmentNames={segmentNames}
                segmentColors={segmentColors}
                onHoverFy={setHoveredFy}
              />
            </div>
            <div className="chart-legend" style={{ minHeight: 40 }}>
              {legendItems.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
            <div className="chart-source">{mixSource}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PendingShell({ note }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 h-full">
      <div className="w-12 h-12 rounded-full bg-[#F4F7FB] border border-[#E5EAF1] flex items-center justify-center text-[#94A3B8]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>
      <div className="text-[13px] font-semibold text-[#475569] mt-3">Data pending</div>
      <div className="text-[11.5px] text-[#94A3B8] mt-1 max-w-[260px]">
        {note || 'Upload source data to populate this chart.'}
      </div>
    </div>
  )
}
