import React from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { FY } from '../data.js'

const AXIS_TICK = { fontSize: 10.5, fill: '#64748B' }
const GRID = '#F1F5F9'

function GrowthChart({ growth, oemName }) {
  const rows = FY.map((fy, idx) => ({
    fy,
    [oemName]: growth.oem[idx],
    Industry: growth.industry[idx],
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42}
          tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5EAF0', fontSize: 12, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' }} />
        <Line type="monotone" dataKey={oemName} stroke="#173B63" strokeWidth={2.25}
          dot={{ r: 2.5, fill: '#173B63' }} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} strokeLinecap="round" />
        <Line type="monotone" dataKey="Industry" stroke="#2563EB" strokeWidth={2.8}
          strokeDasharray="4 4" dot={false} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} strokeLinecap="round" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function MixChart({ mix }) {
  const rows = FY.map((fy, idx) => {
    const row = { fy }
    mix.forEach((s) => { row[s.name] = s.values[idx] })
    return row
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }} stackOffset="expand">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42}
          tickFormatter={(v) => `${Math.round(v * 100)}%`} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5EAF0', fontSize: 12, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' }}
          formatter={(v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—')} />
        {mix.map((s) => (
          <Area key={s.name} type="monotone" dataKey={s.name} stackId="1"
            stroke={s.color} fill={s.color} fillOpacity={0.16} strokeWidth={2.25}
            isAnimationActive={false} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

const Legend = ({ items, dashed = [] }) => (
  <div className="chart-legend">
    {items.map((s) => (
      <span key={s.name} className="flex items-center gap-1.5">
        {dashed.includes(s.name) ? (
          <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke={s.color} strokeWidth="2" strokeDasharray="3 2" /></svg>
        ) : (
          <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
        )}
        {s.name}
      </span>
    ))}
  </div>
)

export default function PerformanceSection({ company }) {
  const { performance, name } = company
  if (!performance) return null
  const oemName = name === 'Industry' ? 'Industry total' : name
  const growthLegend = [
    { name: oemName, color: '#173B63' },
    { name: 'Industry benchmark', color: '#2563EB' },
  ]
  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Performance</span>
        <span className="section-hint">Volume growth vs industry · product mix evolution</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: growth */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">Volume Growth vs 2W Industry</div>
                <div className="chart-panel-sub">{name === 'Industry' ? 'Industry trend' : `${name} vs industry`} · FY16–FY27 YoY %</div>
              </div>
              <span className="bsr-pill">YoY %</span>
            </div>
            <div className="chart-panel-meta">
              <span>Source: SIAM</span>
              <span>OEM disclosures</span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              <GrowthChart growth={performance.growth} oemName={oemName} />
            </div>
            <Legend items={growthLegend} dashed={['Industry benchmark']} />
            <div className="chart-source">FY26–FY27 are forecast. Industry benchmark is total domestic 2W volume growth from SIAM monthly bulletins.</div>
          </div>
        </div>

        {/* Right: mix */}
        <div className="chart-panel">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">Product Mix Evolution</div>
                <div className="chart-panel-sub">Share by category · FY16–FY27</div>
              </div>
              <span className="bsr-pill">Mix %</span>
            </div>
            <div className="chart-panel-meta">
              <span>Categories: Motorcycles · Scooters · Mopeds · EV 2W</span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              <MixChart mix={performance.mix} />
            </div>
            <Legend items={performance.mix} />
            <div className="chart-source">Stacked share. Sums to 100% per FY. Source: SIAM · Vahan dashboard · OEM disclosures.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
