import React from 'react'

const tagTone = {
  Gain:   'bg-emerald-100 text-emerald-700',
  Stable: 'bg-slate-100 text-slate-600',
  Loss:   'bg-rose-100 text-rose-700',
}

const growthTone = (g) => {
  if (typeof g !== 'string') return 'text-slate-500'
  if (g.startsWith('-')) return 'text-rose-600'
  if (g.startsWith('+')) return 'text-emerald-600'
  return 'text-slate-500'
}

export default function ModelCards({ models }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="section-label">Model-Level Drivers</h2>
        <span className="text-xs text-slate-500">Top 6 by latest FY volume</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {models.map((m) => (
          <div key={m.name} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900 leading-tight">{m.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.segment}</div>
              </div>
              <span className={`pill text-[11px] ${tagTone[m.tag] || tagTone.Stable}`}>{m.tag}</span>
            </div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">{m.units}</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs text-slate-500">{m.sub}</span>
              <span className={`text-xs font-semibold ${growthTone(m.growth)}`}>{m.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
