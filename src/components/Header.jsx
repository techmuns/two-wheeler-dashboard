import React, { useEffect, useRef, useState } from 'react'
import { SECTOR_META } from '../data.js'

const SignalPillTone = {
  Positive: 'bg-emerald-100 text-emerald-700',
  Negative: 'bg-rose-100 text-rose-700',
  Neutral: 'bg-slate-200 text-slate-700',
  Fresh: 'bg-emerald-100 text-emerald-700',
  Stale: 'bg-amber-100 text-amber-700',
  Pending: 'bg-amber-100 text-amber-700',
  Missing: 'bg-slate-200 text-slate-600',
}

function Caret({ className = '' }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 17h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const Label = ({ children }) => (
  <span className="text-[10px] tracking-[0.14em] uppercase text-white/80 font-semibold">{children}</span>
)

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
      <div className="max-w-[1480px] mx-auto px-6 h-[64px] flex items-center gap-5 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2.5 bg-white/15 rounded-xl px-2.5 py-1.5 backdrop-blur shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/95 text-brand-700 font-bold text-sm flex items-center justify-center">
            {SECTOR_META.badge}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1 font-semibold text-[14px]">
              {SECTOR_META.title}
              <Caret className="opacity-80" />
            </div>
            <div className="text-[10.5px] text-white/85">{SECTOR_META.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Label>Latest Data</Label>
          <span className="pill pill-on-header text-[11px] normal-case">{SECTOR_META.latestFy}</span>
        </div>

        <div className="flex items-center gap-1.5 relative shrink-0" ref={ref}>
          <Label>Company</Label>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 bg-white text-slate-800 rounded-lg pl-2.5 pr-2 py-1.5 min-w-[180px] justify-between shadow-sm text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: company.dotColor }} />
              <span className="font-medium">{company.name}</span>
            </span>
            <Caret />
          </button>
          {open && (
            <div className="absolute top-full left-[68px] mt-1 w-[210px] bg-white text-slate-800 rounded-xl shadow-lg border border-slate-100 overflow-hidden z-30">
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
                  <span className="w-2 h-2 rounded-full" style={{ background: c.dotColor }} />
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Label>Signal</Label>
          <span className={`pill ${SignalPillTone[company.signal] || SignalPillTone.Neutral} text-[11px] normal-case`}>
            {company.signal}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Label>Updated</Label>
          <span className="pill pill-on-header text-[11px] normal-case">{company.updated}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Label>Data</Label>
          <span className={`pill ${SignalPillTone[company.dataFresh] || SignalPillTone.Neutral} text-[11px] normal-case`}>
            {company.dataFresh}
          </span>
        </div>

        <div className="ml-auto shrink-0">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 bg-white text-brand-700 font-semibold rounded-lg px-3 py-1.5 shadow-sm hover:bg-brand-50 text-sm"
          >
            <DownloadIcon />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
