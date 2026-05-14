import React from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { FY } from '../data.js'

const CHART_H = 280

function GrowthChart({ growth, oemName }) {
  const rows = FY.map((fy, idx) => ({
    fy,
    [oemName]: growth.oem[idx],
    Industry: growth.industry[idx],
  }))
  return (
    <ResponsiveContainer width="100%" height={CHART_H}>
      <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="fy" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={44}
          tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
        <Line type="monotone" dataKey={oemName} stroke="#1f2937" strokeWidth={2} dot={{ r: 3, fill: '#1f2937' }} connectNulls={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="Industry" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} connectNulls={false} isAnimationActive={false} strokeDasharray="4 3" />
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
    <ResponsiveContainer width="100%" height={CHART_H}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} stackOffset="expand">
        <XAxis dataKey="fy" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={44}
          tickFormatter={(v) => `${Math.round(v * 100)}%`} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          formatter={(v) => (typeof v === 'number' ? `${v.toFixed(1)}%` : '—')} />
        {mix.map((s) => (
          <Area
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stackId="1"
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.7}
            strokeWidth={1}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

const Legend = ({ items }) => (
  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
    {items.map((s) => (
      <span key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
        {s.name}
      </span>
    ))}
  </div>
)

export default function PerformanceSection({ company }) {
  const { performance, name } = company
  if (!performance) return null
  const oemName = name === 'Industry' ? 'Industry' : name
  const growthLegend = [
    { name: oemName, color: '#1f2937' },
    { name: 'Industry', color: '#3b82f6' },
  ]
  return (
    <section>
      <h2 className="section-label mb-3">Performance</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-[15px]">Volume Growth vs Industry</div>
              <div className="text-xs text-slate-500 mt-0.5">{oemName} vs 2W industry · FY16–FY27</div>
            </div>
            <span className="pill pill-neutral text-[11px] normal-case">YoY %</span>
          </div>
          <div className="mt-2 flex-1 min-h-0">
            <GrowthChart growth={performance.growth} oemName={oemName} />
          </div>
          <Legend items={growthLegend} />
        </div>

        <div className="card p-5 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-[15px]">Product Mix Evolution</div>
              <div className="text-xs text-slate-500 mt-0.5">Share by category · FY16–FY27</div>
            </div>
            <span className="pill pill-neutral text-[11px] normal-case">Mix %</span>
          </div>
          <div className="mt-2 flex-1 min-h-0">
            <MixChart mix={performance.mix} />
          </div>
          <Legend items={performance.mix} />
        </div>
      </div>
    </section>
  )
}
