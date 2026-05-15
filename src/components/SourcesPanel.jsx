import React, { useState } from 'react'

export default function SourcesPanel({ company }) {
  const cites = company.sourceCitations
  if (!cites || !Object.keys(cites).length) return null
  const [open, setOpen] = useState(false)
  const entries = Object.entries(cites)

  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Source Citations</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="section-hint hover:text-[#6D28D9] transition-colors"
        >
          {open ? 'Hide' : 'Show all'} ({entries.length} fiscal years)
        </button>
      </div>
      <div className="card p-5">
        <div className="text-[12.5px] text-[#334E68] mb-3 leading-relaxed">
          {company.modelSource}
        </div>
        {open && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            {entries.map(([fy, src]) => (
              <div key={fy} className="border border-[#E5EAF1] rounded-lg px-3 py-2 bg-[#FAFBFE]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6D28D9]">{fy}</div>
                <div className="text-[11px] text-[#334E68] mt-0.5 leading-snug">{src}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
