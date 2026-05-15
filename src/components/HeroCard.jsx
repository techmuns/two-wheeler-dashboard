import React from 'react'

export default function HeroCard({ company }) {
  const { hero, name, brandText, brandColor, shortName } = company
  const title = hero?.title || name
  const subtitle = hero?.subtitle || 'Audited annual snapshot · FY16–FY25 standalone'
  const fy = hero?.fy || 'FY25'
  return (
    <section className="identity-row">
      <div className="logo-mark-header">
        <span
          className="logo-text-full"
          style={{ color: brandColor || '#4C1D95' }}
        >
          {brandText || shortName || name}
        </span>
        <span className="logo-text-short hidden">{(shortName || name || '').slice(0, 3).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 id="view-title" className="truncate">{title}</h1>
        <p id="view-subtitle">{subtitle}</p>
      </div>
      <div className="fy-chip fy-chip-sm">
        <span className="fy-chip-label">FY</span>
        <span className="fy-chip-value">{fy}</span>
      </div>
    </section>
  )
}
