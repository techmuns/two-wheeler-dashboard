import React from 'react'

const tagTone = {
  Gain: 'bg-emerald-100 text-emerald-700',
  Stable: 'bg-slate-100 text-slate-600',
  Loss: 'bg-rose-100 text-rose-700',
  Pending: 'bg-amber-100 text-amber-700',
}

const growthTone = (g) => {
  if (typeof g !== 'string') return 'text-slate-500'
  if (g.startsWith('-')) return 'text-rose-600'
  if (g.startsWith('+')) return 'text-emerald-600'
  return 'text-slate-500'
}

export default function ProductDrivers({ drivers }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="section-label">Product-Level Drivers</h2>
        <span className="text-xs text-slate-500">Top 6 by latest FY volume</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {drivers.slice(0, 6).map((m) => {
          const empty = m.value === '—' || m.value === 'Pending'
          return (
            <div key={m.name} className="card p-4 h-[124px] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 text-sm leading-tight truncate">{m.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{m.segment || '—'}</div>
                </div>
                <span className={`pill text-[11px] normal-case ${tagTone[m.tag] || tagTone.Stable}`}>
                  {empty && m.value === 'Pending' ? 'Pending' : m.tag}
                </span>
              </div>
              <div>
                <div className={`text-[20px] font-semibold ${empty ? 'text-slate-400' : 'text-slate-900'}`}>{m.value}</div>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-[11px] text-slate-500">{m.sub || ''}</span>
                  <span className={`text-xs font-semibold ${growthTone(m.growth)}`}>{m.growth || ''}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
