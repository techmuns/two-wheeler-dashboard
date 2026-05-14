import React from 'react'

const toneClass = {
  pos: 'text-emerald-600',
  neg: 'text-rose-600',
  flat: 'text-slate-500',
}

const accentClass = {
  pos: 'bg-emerald-500',
  neg: 'bg-rose-500',
  flat: 'bg-slate-300',
}

export default function KpiCards({ kpis, onKpiClick }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="section-label">Key Metrics</h2>
        <span className="text-xs text-slate-500">FY25 snapshot · click any tile for 10-year trend</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.slice(0, 6).map((k) => (
          <button
            type="button"
            key={k.key || k.label}
            onClick={() => onKpiClick?.(k)}
            className="card p-4 text-left hover:shadow-md transition-shadow relative overflow-hidden h-[124px] flex flex-col justify-between"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass[k.tone] || accentClass.flat}`} />
            <div>
              <div className="text-[11px] tracking-widest uppercase text-slate-500 leading-tight">{k.label}</div>
              <div className="text-[22px] font-semibold text-slate-900 leading-tight mt-1.5">{k.value}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-slate-500">{k.sub}</span>
              <span className={`text-xs font-semibold ${toneClass[k.tone] || toneClass.flat}`}>{k.delta}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
