import React from 'react'

const toneClass = {
  pos: 'pos',
  neg: 'neg',
  flat: 'flat',
}

// Inline sparkline using existing 10-year series.
function Sparkline({ series, tone = 'flat' }) {
  if (!Array.isArray(series) || series.length < 2) return null
  const vals = series.map((v) => (typeof v === 'number' ? v : null))
  const valid = vals.filter((v) => v !== null)
  if (valid.length < 2) return null
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const range = max - min || 1
  const w = 100
  const h = 24
  const stepX = w / (vals.length - 1)
  let d = ''
  vals.forEach((v, i) => {
    if (v === null) return
    const x = i * stepX
    const y = h - ((v - min) / range) * h
    d += d ? ` L ${x.toFixed(1)} ${y.toFixed(1)}` : `M ${x.toFixed(1)} ${y.toFixed(1)}`
  })
  const stroke = tone === 'pos' ? '#1F7A45' : tone === 'neg' ? '#9F1F2E' : '#6D28D9'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Tiny icon per KPI key.
const KpiIcon = ({ k }) => {
  const icons = {
    mktShare: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 4" /></svg>
    ),
    volGrowth: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>
    ),
    revGrowth: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20" /><path d="M17 7H9.5a2.5 2.5 0 100 5h5a2.5 2.5 0 110 5H7" /></svg>
    ),
    ebitda: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="4" height="9" /><rect x="10" y="6" width="4" height="14" /><rect x="17" y="3" width="4" height="17" /></svg>
    ),
    evMix: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>
    ),
    exportMix: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></svg>
    ),
    premium: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" /></svg>
    ),
  }
  return icons[k] || (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /></svg>
  )
}

export default function KpiCards({ kpis, onKpiClick }) {
  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Key Metrics</span>
        <span className="section-hint">FY25 snapshot · click any tile for 10-year trend</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.slice(0, 6).map((k) => (
          <button
            type="button"
            key={k.key || k.label}
            onClick={() => onKpiClick?.(k)}
            className="kpi-card"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="kpi-icon"><KpiIcon k={k.key} /></span>
              <span className={`kpi-delta ${toneClass[k.tone] || 'flat'}`}>{k.delta}</span>
            </div>
            <div className="mt-2 kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
            <div className="kpi-spark">
              <Sparkline series={k.series} tone={k.tone} />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
