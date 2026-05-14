import React from 'react'

const readClass = {
  Gain: 'read-pill positive',
  Stable: 'read-pill neutral',
  Loss: 'read-pill negative',
  Pending: 'read-pill watch',
}

const growthTone = (g) => {
  if (typeof g !== 'string' || !g) return ''
  if (g.startsWith('-')) return 'down'
  if (g.startsWith('+')) return 'up'
  return 'flat'
}

const growthClass = {
  up: 'text-[#1F7A45]',
  down: 'text-[#9F1F2E]',
  flat: 'text-[#94A3B8]',
}

export default function ProductDrivers({ drivers }) {
  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Product-Level Drivers</span>
        <span className="section-hint">Top 6 categories by latest FY volume</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-start">
        {drivers.slice(0, 6).map((m) => {
          const empty = m.value === '—' || m.value === 'Pending'
          const tag = empty && m.value === 'Pending' ? 'Pending' : m.tag
          const tone = growthTone(m.growth)
          return (
            <div key={m.name} className="veh-card">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold text-[#0B1F33] text-[13px] leading-tight truncate">{m.name}</div>
                  <div className="text-[10.5px] text-[#6B7280] mt-0.5 truncate">{m.segment || '—'}</div>
                </div>
                <span className={readClass[tag] || readClass.Stable}>{tag}</span>
              </div>
              <div className={`text-[20px] font-semibold leading-tight ${empty ? 'text-[#94A3B8]' : 'text-[#0B1F33]'} tabular-nums`}>{m.value}</div>
              <div className="flex items-baseline justify-between mt-1 mb-2">
                <span className="text-[10.5px] text-[#6B7280]">{m.sub || ''}</span>
                <span className={`text-[11px] font-semibold ${growthClass[tone] || 'text-[#94A3B8]'}`}>{m.growth || ''}</span>
              </div>
              <div className="veh-row">
                <span className="veh-row-key">Category</span>
                <span className="veh-row-val">{m.segment || '—'}</span>
              </div>
              <div className="veh-row">
                <span className="veh-row-key">FY25 vol</span>
                <span className="veh-row-val">{m.value}</span>
              </div>
              <div className="veh-row">
                <span className="veh-row-key">YoY</span>
                <span className={`veh-row-val ${growthClass[tone] || ''}`}>{m.growth || '—'}</span>
              </div>
              <div className="veh-foot">
                <span className="veh-cta">Drill in</span>
                <span className="veh-src-link">Source</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
