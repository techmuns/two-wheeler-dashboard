import React from 'react'

export default function HeroCard({ company }) {
  const { hero, name } = company
  const title = hero?.title || name
  const subtitle = hero?.subtitle || ''
  const fy = hero?.fy || 'FY25'
  return (
    <section className="identity-row">
      <div className="logo-mark-header">
        <span className="logo-text-full">Two-Wheeler</span>
        <span className="logo-text-short hidden">2W</span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 id="view-title" className="truncate">{title}</h1>
        <p id="view-subtitle">{subtitle}</p>
      </div>
      <div className="fy-chip fy-chip-sm">
        <span className="fy-chip-label">Fiscal year</span>
        <span className="fy-chip-value">{fy}</span>
      </div>
    </section>
  )
}
