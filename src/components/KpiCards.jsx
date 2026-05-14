import React from 'react'

const toneClass = {
  pos: 'text-emerald-600',
  neg: 'text-rose-600',
  flat: 'text-slate-500',
}

export default function KpiCards({ kpis }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="section-label">Key Metrics</h2>
        <span className="text-xs text-slate-500">FY25 snapshot</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="card p-4 flex flex-col gap-1">
            <div className="text-[11px] tracking-widest uppercase text-slate-500">{k.label}</div>
            <div className="text-2xl font-semibold text-slate-900 leading-tight">{k.value}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">{k.sub}</span>
              <span className={`text-xs font-semibold ${toneClass[k.tone] || toneClass.flat}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
