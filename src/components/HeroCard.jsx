import React from 'react'

export default function HeroCard({ company }) {
  const { hero, name } = company
  const title = hero?.title || name
  const subtitle = hero?.subtitle || ''
  const fy = hero?.fy || 'FY25'
  return (
    <section className="card px-6 py-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: company.dotColor }} />
          <h1 className="text-[20px] md:text-[22px] font-semibold text-slate-900 leading-tight truncate">{title}</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] tracking-[0.14em] uppercase text-slate-500 font-semibold">Fiscal year</span>
        <span className="pill bg-brand-100 text-brand-700 text-[12px] px-3 py-1 normal-case">{fy}</span>
      </div>
    </section>
  )
}
