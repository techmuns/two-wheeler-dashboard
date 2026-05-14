import React from 'react'

const tone = {
  BUY:  { ring: 'ring-emerald-200', chip: 'bg-emerald-100 text-emerald-700', accent: 'bg-emerald-500' },
  HOLD: { ring: 'ring-slate-200',   chip: 'bg-slate-200 text-slate-700',     accent: 'bg-slate-400'   },
  SELL: { ring: 'ring-rose-200',    chip: 'bg-rose-100 text-rose-700',       accent: 'bg-rose-500'    },
}

export default function SignalBox({ company }) {
  const { buySide, name, signalNote } = company
  const t = tone[buySide.rating] || tone.HOLD
  return (
    <section className={`card p-5 ring-1 ${t.ring}`}>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <div className={`w-3 h-3 rounded-full ${t.accent} mb-2`} />
          <div className="text-[11px] tracking-widest uppercase text-slate-500">Buy-side signal</div>
          <div className={`pill ${t.chip} mt-1 text-[13px] px-3 py-1`}>{buySide.rating}</div>
          <div className="text-xs text-slate-500 mt-2">
            Confidence: <span className="font-semibold text-slate-700">{buySide.confidence}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-semibold text-slate-900">{name} · Buy-side read</h3>
            <span className="text-xs text-slate-500">{signalNote}</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {buySide.bullets.map((b, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-brand-500 mt-1">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
