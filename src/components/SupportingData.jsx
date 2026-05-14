import React, { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { FY, SUPPORT_BLOCKS } from '../data.js'

const AXIS_TICK = { fontSize: 10.5, fill: '#64748B' }
const GRID = '#F1F5F9'

const readClass = {
  Positive: 'read-pill positive',
  Negative: 'read-pill negative',
  Neutral: 'read-pill neutral',
}

const fmtChange = (v, kind) => {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string') return v
  const sign = v > 0 ? '+' : ''
  if (kind === 'pp') return `${sign}${v.toFixed(1)}pp`
  if (kind === 'pct') return `${sign}${v.toFixed(1)}%`
  return `${sign}${v.toFixed(1)}`
}

const fmtCell = (v, kind) => {
  if (typeof v !== 'number') return v ?? '—'
  if (kind === 'pp') return `${v.toFixed(1)}%`
  return v.toFixed(1)
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between bg-white border border-[#D8CCF7] rounded-lg px-3 py-2 text-[13px] font-semibold text-[#6D28D9] hover:border-[#6D28D9] transition-colors"
      >
        {value}
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5EAF1] rounded-lg shadow-lg overflow-hidden z-20">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F4F7FB] ${
                o === value ? 'bg-[#EFEAFE] text-[#6D28D9] font-semibold' : 'text-[#334E68]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Chart({ series }) {
  const rows = FY.map((fy, idx) => {
    const row = { fy }
    series.forEach((s) => { row[s.name] = s.values[idx] })
    return row
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="fy" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={42}
          tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5EAF0', fontSize: 12, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' }} />
        {series.map((s) => (
          <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2.25}
            dot={{ r: 2.5, fill: s.color }} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} strokeLinecap="round" />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

const blurb = {
  Growth: 'Revenue, volume, and realisation YoY %.',
  Margins: 'Gross margin (proxy) and EBITDA margin %.',
  'Balance Sheet': 'Leverage, ROCE, and working capital.',
  'Cash Flow': 'OCF, FCF, and capex trajectory.',
  'Product Mix': 'Powertrain / segment mix %.',
  'Market Share': 'Overall and segment-level share %.',
}

export default function SupportingData({ company }) {
  const [block, setBlock] = useState('Growth')
  const data = company.supportingData[block]
  const series = company.charts[block] || []
  const cols = data?.columns || []

  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Supporting Data</span>
        <span className="section-hint">Switch dataset · table left · chart right</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: dropdown + transposed table */}
        <div className="chart-panel lg:col-span-5">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0 flex-1">
                <div className="chart-panel-title">{block}</div>
                <div className="chart-panel-sub">{blurb[block]}</div>
              </div>
              <div className="w-[180px] shrink-0">
                <Dropdown value={block} options={SUPPORT_BLOCKS} onChange={setBlock} />
              </div>
            </div>
            <div className="chart-panel-meta">
              <span>FY24 vs FY25</span>
              <span>Read · Positive / Neutral / Negative</span>
            </div>
          </div>

          <div className="chart-panel-body !p-0">
            <table className="mtbl-transposed">
              <thead>
                <tr>
                  <th className="metric-head">Metric</th>
                  {cols.map((c) => <th key={c}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>FY24</th>
                  {data.fy24.map((v, i) => (
                    <td key={i} className="text-[#94A3B8]">{fmtCell(v, data.fmt[i])}</td>
                  ))}
                </tr>
                <tr>
                  <th>FY25</th>
                  {data.fy25.map((v, i) => (
                    <td key={i} className="sel font-semibold">{fmtCell(v, data.fmt[i])}</td>
                  ))}
                </tr>
                <tr>
                  <th>Change</th>
                  {data.change.map((v, i) => (
                    <td key={i} className={`font-semibold ${
                      v === null ? 'text-[#94A3B8]' : v > 0 ? 'text-[#1F7A45]' : v < 0 ? 'text-[#9F1F2E]' : 'text-[#94A3B8]'
                    }`}>
                      {fmtChange(v, data.fmt[i])}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Read</th>
                  {data.read.map((r, i) => (
                    <td key={i}>
                      <span className={readClass[r] || readClass.Neutral}>{r}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="mtbl-foot">{company.modelSource}</div>
          </div>
        </div>

        {/* Right: chart panel */}
        <div className="chart-panel lg:col-span-7">
          <div className="chart-panel-head">
            <div className="chart-panel-row1">
              <div className="min-w-0">
                <div className="chart-panel-title">{block} — 12-year view</div>
                <div className="chart-panel-sub">{blurb[block]} · FY16–FY27</div>
              </div>
              <span className="bsr-pill">FY25</span>
            </div>
            <div className="chart-panel-meta">
              <span>Lines = annual values</span>
              <span>Forecast: FY26–FY27</span>
            </div>
          </div>
          <div className="chart-panel-body">
            <div className="chart-canvas">
              <Chart series={series} />
            </div>
            <div className="chart-legend">
              {series.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
            <div className="chart-source">{company.modelSource}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
