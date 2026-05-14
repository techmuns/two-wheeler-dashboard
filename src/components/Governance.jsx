import React from 'react'

export default function Governance({ company }) {
  const entries = Object.entries(company.governance)
  return (
    <section>
      <div className="card p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Governance &amp; Network</h2>
          <span className="text-xs text-slate-500">FY25 snapshot</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {entries.map(([k, v]) => (
            <div key={k} className="bg-brand-50/60 border border-brand-100 rounded-lg p-3">
              <div className="text-[11px] tracking-widest uppercase text-brand-700">{k}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 break-words">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">{company.governanceSource}</p>
      </div>
    </section>
  )
}
