import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { FY } from '../data.js'

const fmtVal = (v, fmt) => {
  if (typeof v !== 'number') return '—'
  if (fmt === 'pp') return `${v.toFixed(1)}%`
  return v.toFixed(1)
}

function signalFor(latest, prev) {
  if (typeof latest !== 'number' || typeof prev !== 'number') return { label: 'Neutral', cls: 'pill-neutral' }
  const d = latest - prev
  if (d > 1) return { label: 'Positive', cls: 'pill-positive' }
  if (d < -1) return { label: 'Negative', cls: 'pill-negative' }
  return { label: 'Neutral', cls: 'pill-neutral' }
}

export default function KpiModal({ open, kpi, company, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !kpi) return null

  const series = kpi.series || []
  const fy25Idx = FY.indexOf('FY25')
  const tenYearWindow = series
    .map((v, i) => ({ fy: FY[i], v }))
    .filter((p, i) => i <= fy25Idx && typeof p.v === 'number' && i >= fy25Idx - 9)

  const nums = tenYearWindow.map((p) => p.v)
  const current = nums.length ? nums[nums.length - 1] : null
  const prev = nums.length > 1 ? nums[nums.length - 2] : null
  const tenHigh = nums.length ? Math.max(...nums) : null
  const tenLow = nums.length ? Math.min(...nums) : null
  const latestYoY = typeof current === 'number' && typeof prev === 'number'
    ? Number((current - prev).toFixed(1))
    : null
  const sig = signalFor(current, prev)

  const rows = FY.map((fy, i) => ({ fy, v: series[i] }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[920px] max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-[16px]">{kpi.label}</h3>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-700">{company.name}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-700">10-Year Trend</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            <div className="card p-3">
              <div className="text-[10px] tracking-widest uppercase text-slate-500">Current FY25</div>
              <div className="text-lg font-semibold text-slate-900 mt-1">{fmtVal(current, kpi.fmt)}</div>
            </div>
            <div className="card p-3">
              <div className="text-[10px] tracking-widest uppercase text-slate-500">10Y High</div>
              <div className="text-lg font-semibold text-emerald-700 mt-1">{fmtVal(tenHigh, kpi.fmt)}</div>
            </div>
            <div className="card p-3">
              <div className="text-[10px] tracking-widest uppercase text-slate-500">10Y Low</div>
              <div className="text-lg font-semibold text-rose-700 mt-1">{fmtVal(tenLow, kpi.fmt)}</div>
            </div>
            <div className="card p-3">
              <div className="text-[10px] tracking-widest uppercase text-slate-500">Latest YoY</div>
              <div className={`text-lg font-semibold mt-1 ${
                latestYoY === null ? 'text-slate-400' : latestYoY > 0 ? 'text-emerald-700' : latestYoY < 0 ? 'text-rose-700' : 'text-slate-700'
              }`}>
                {latestYoY === null ? '—' : `${latestYoY > 0 ? '+' : ''}${latestYoY.toFixed(1)}${kpi.fmt === 'pp' ? 'pp' : ''}`}
              </div>
            </div>
            <div className="card p-3">
              <div className="text-[10px] tracking-widest uppercase text-slate-500">Signal</div>
              <div className="mt-1.5"><span className={`pill ${sig.cls}`}>{sig.label}</span></div>
            </div>
          </div>

          <div className="card p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="fy" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={48}
                    tickFormatter={(v) => (kpi.fmt === 'pp' ? `${v}%` : `${v}`)} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                    formatter={(v) => fmtVal(v, kpi.fmt)} />
                  <ReferenceLine x="FY25" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="v" name={kpi.label} stroke="#7c3aed" strokeWidth={2.5}
                    dot={{ r: 3, fill: '#7c3aed' }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">{company.modelSource}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
