import React, { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { FY, SUPPORT_BLOCKS } from '../data.js'

const readPill = {
  Positive: 'pill-positive',
  Negative: 'pill-negative',
  Neutral: 'pill-neutral',
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
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-brand-200 rounded-lg px-3 py-2 text-sm text-brand-700 font-semibold flex items-center justify-between bg-white"
      >
        {value}
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-lg shadow-lg overflow-hidden z-20">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-brand-50 ${
                o === value ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-slate-700'
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
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="fy" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={44}
            tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
          {series.map((s) => (
            <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2}
              dot={{ r: 3, fill: s.color }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
  const gridTemplate = `120px repeat(${cols.length}, minmax(0, 1fr))`

  return (
    <section>
      <h2 className="section-label mb-3">Supporting Data</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="card p-5 lg:col-span-5">
          <div className="grid items-start gap-3" style={{ gridTemplateColumns: gridTemplate }}>
            <Dropdown value={block} options={SUPPORT_BLOCKS} onChange={setBlock} />
            {cols.map((c) => (
              <div key={c} className="text-[11px] font-semibold text-slate-600 px-2 py-2 leading-tight">{c}</div>
            ))}
          </div>

          {[['FY24', data.fy24, false], ['FY25', data.fy25, true]].map(([label, row, bold]) => (
            <div key={label} className="grid items-center mt-1" style={{ gridTemplateColumns: gridTemplate }}>
              <div className="text-[11px] tracking-widest uppercase text-slate-500 py-2">{label}</div>
              {row.map((v, i) => (
                <div key={i} className={`px-2 py-2 text-sm ${bold ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>
                  {fmtCell(v, data.fmt[i])}
                </div>
              ))}
            </div>
          ))}

          <div className="grid items-center" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="text-[11px] tracking-widest uppercase text-slate-500 py-2">Change</div>
            {data.change.map((v, i) => (
              <div key={i} className={`px-2 py-2 text-sm font-semibold ${
                v === null ? 'text-slate-400' : v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {fmtChange(v, data.fmt[i])}
              </div>
            ))}
          </div>

          <div className="grid items-center" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="text-[11px] tracking-widest uppercase text-slate-500 py-2">Read</div>
            {data.read.map((r, i) => (
              <div key={i} className="px-2 py-2">
                <span className={`pill ${readPill[r] || readPill.Neutral}`}>{r}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px] text-slate-500 leading-relaxed">{company.modelSource}</p>
        </div>

        <div className="card p-5 lg:col-span-7 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-slate-900 text-[15px]">{block}</div>
              <div className="text-xs text-slate-500 mt-0.5">{blurb[block]}</div>
            </div>
            <span className="pill pill-neutral text-[11px] normal-case">FY25</span>
          </div>
          <div className="mt-2 flex-1 min-h-0">
            <Chart series={series} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {series.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">{company.modelSource}</p>
        </div>
      </div>
    </section>
  )
}
