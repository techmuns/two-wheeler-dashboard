import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts'
import { FY } from '../data.js'

const AXIS_TICK = { fontSize: 10.5, fill: '#64748B' }
const GRID = '#F1F5F9'

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #E5EAF0',
  fontSize: 12,
  boxShadow: '0 6px 20px rgba(15,23,42,0.08)',
}

function GrowthChart({ growth, oemName }) {
  const startIdx = FY.indexOf('FY18')
  const rows = FY.slice(startIdx).map((fy, idx) => ({
    fy,
    [oemName]: growth.oem[startIdx + idx],
    Industry: growth.industry[startIdx + idx],
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42} tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—')} />
        <Bar dataKey="Industry" fill="#CBD5E1" radius={[2, 2, 0, 0]} isAnimationActive={false} />
        <Bar dataKey={oemName} fill="#2563EB" radius={[2, 2, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MixChart({ mix }) {
  const startIdx = FY.indexOf('FY18')
  const rows = FY.slice(startIdx).map((fy, idx) => {
    const row = { fy }
    mix.forEach((s) => { row[s.name] = s.values[startIdx + idx] })
    return row
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }} barCategoryGap="18%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—')}
        />
        {mix.map((s, i) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            stackId="mix"
            fill={s.color}
            radius={i === mix.length - 1 ? [2, 2, 0, 0] : 0}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

const Legend = ({ items }) => (
  <div className="chart-legend">
    {items.map((s) => (
      <span key={s.name} className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
        {s.name}
      </span>
    ))}
  </div>
)

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

const totalForFy = (mix, idx) => {
  let total = 0
  let any = false
  mix.forEach((s) => {
    const v = s.values[idx]
    if (typeof v === 'number') { total += v; any = true }
  })
  return any ? total : null
}

export default function PerformanceSection({ company }) {
  const { performance, name, shortName } = company
  if (!performance) return null
  const oemLabel = name === 'Industry' ? '2W industry' : (shortName || name)
  const otherLabel = name === 'Industry' ? '2W industry' : '2W industry'
  const oemKey = oemLabel

  // Volume totals for the right card meta strip — use mix sum (already in %)
  // Substitute with absolute headline if you have it; here we surface YoY pct.
  const fy24Idx = FY.indexOf('FY24')
  const fy25Idx = FY.indexOf('FY25')
  const growthFy25 = typeof performance.growth?.oem?.[fy25Idx] === 'number'
    ? performance.growth.oem[fy25Idx]
    : null

  const growthHasData = (performance.growth?.oem || []).some((v) => typeof v === 'number')
  const mixHasData = (performance.mix || []).some((s) => s.values.some((v) => typeof v === 'number'))

  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Performance</span>
        <span className="section-hint">Growth · Mix · Composition</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left — Growth vs Industry */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">{name === 'Industry' ? '2W industry growth' : `${oemLabel} growth vs ${otherLabel}`}</div>
                <div className="chart-panel-sub">Volume Growth % · FY18–FY27</div>
              </div>
              <span className="bsr-pill">%</span>
            </div>
            <div className="chart-panel-meta">
              <span>OEM</span>
              <span>Industry benchmark</span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              {growthHasData ? (
                <GrowthChart growth={performance.growth} oemName={oemKey} />
              ) : (
                <PendingShell />
              )}
            </div>
            <Legend items={[
              { name: oemLabel, color: '#2563EB' },
              { name: 'Industry', color: '#CBD5E1' },
            ]} />
            <div className="chart-source">
              FY26–FY27 are forecast. Industry benchmark is total domestic 2W volume growth from SIAM monthly bulletins.
            </div>
          </div>
        </div>

        {/* Right — Volume composition */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">Where {oemLabel}{name === 'Industry' ? '' : "'s"} volume is coming from</div>
                <div className="chart-panel-sub">Total sales volume by selected mix</div>
              </div>
              <span className="bsr-pill">Mix %</span>
            </div>
            <div className="chart-panel-meta">
              <span>FY25</span>
              <span>YoY vs FY24 {growthFy25 !== null ? <span className={`${growthFy25 >= 0 ? 'text-[#1F7A45]' : 'text-[#9F1F2E]'} font-semibold`}>{growthFy25 >= 0 ? '+' : ''}{growthFy25.toFixed(1)}%</span> : '—'}</span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              {mixHasData ? <MixChart mix={performance.mix} /> : <PendingShell />}
            </div>
            <Legend items={performance.mix} />
            <div className="chart-source">Stacked share by category, FY18–FY27. Source: SIAM · Vahan dashboard · OEM disclosures.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
