import React, { useEffect, useRef, useState } from 'react'
import { SECTOR_META } from '../data.js'

const SignalPillTone = {
  Positive: 'bg-emerald-100 text-emerald-700',
  Negative: 'bg-rose-100 text-rose-700',
  Neutral: 'bg-slate-200 text-slate-700',
  Fresh: 'bg-emerald-100 text-emerald-700',
  Stale: 'bg-amber-100 text-amber-700',
}

function Caret({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 17h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header({ company, companies, onSelectCompany, onExport }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [])

  return (
    <div
      className="w-full text-white"
      style={{ background: 'linear-gradient(95deg, #7c3aed 0%, #8b5cf6 38%, #c084fc 78%, #f0abfc 100%)' }}
    >
      <div className="max-w-[1480px] mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-3 py-2 backdrop-blur">
          <div className="w-9 h-9 rounded-lg bg-white/95 text-brand-700 font-bold flex items-center justify-center">
            {SECTOR_META.badge}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1 font-semibold text-[15px]">
              {SECTOR_META.title}
              <Caret className="opacity-80" />
            </div>
            <div className="text-[11px] text-white/85">{SECTOR_META.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/85">
          Latest Data
          <span className="pill pill-on-header text-[11px]">{SECTOR_META.latestFy}</span>
        </div>

        <div className="flex items-center gap-2 relative" ref={ref}>
          <div className="text-[11px] tracking-widest uppercase text-white/85">Company</div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 bg-white text-slate-800 rounded-xl px-3 py-2 min-w-[200px] justify-between shadow-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: company.dotColor }} />
              <span className="font-medium">{company.name}</span>
            </span>
            <Caret />
          </button>
          {open && (
            <div className="absolute top-full left-[88px] mt-2 w-[220px] bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 overflow-hidden z-30">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCompany(c.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm hover:bg-brand-50 ${
                    c.id === company.id ? 'bg-brand-50 text-brand-700 font-semibold' : ''
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.dotColor }} />
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/85">
          Signal
          <span className={`pill ${SignalPillTone[company.signal] || SignalPillTone.Neutral} normal-case tracking-normal`}>
            {company.signal}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/85">
          Updated
          <span className="pill pill-on-header normal-case tracking-normal">{company.updated}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/85">
          Data
          <span className={`pill ${SignalPillTone[company.dataFresh] || SignalPillTone.Neutral} normal-case tracking-normal`}>
            {company.dataFresh}
          </span>
        </div>

        <div className="ml-auto">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 bg-white text-brand-700 font-semibold rounded-xl px-4 py-2 shadow-sm hover:bg-brand-50"
          >
            <DownloadIcon />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
