import React, { useState } from 'react'
import {
  verificationsForCompany,
  rollupStatus,
  statusLabel,
  statusTone,
} from '../data/verification.js'

const StatusPill = ({ status, size = 'md' }) => {
  const t = statusTone(status)
  const cls = size === 'sm' ? 'text-[10.5px] px-2 py-0.5' : 'text-[11.5px] px-2.5 py-1'
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${cls}`}
      style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: t.fg, opacity: 0.7 }} />
      {statusLabel(status)}
    </span>
  )
}

export default function DataQualityPanel({ company }) {
  const verifications = verificationsForCompany(company.id)
  if (!verifications.length) return null
  const [open, setOpen] = useState(false)
  const rollup = rollupStatus(verifications)

  return (
    <section>
      <div className="section-head">
        <span className="section-eyebrow">Data Quality</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="section-hint hover:text-[#6D28D9] transition-colors"
        >
          {open ? 'Hide' : 'Show'} per-source breakdown
        </button>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-[13px] text-[#334E68]">
            <span className="font-semibold text-[#0B1F33]">Roll-up:</span>
          </div>
          <StatusPill status={rollup.status} />
          <div className="text-[12px] text-[#6B7280] flex items-center gap-3 ml-auto">
            <span>Audited <span className="font-semibold tabular-nums text-[#1F5C28]">{rollup.counts.audited}</span></span>
            <span>Approximate <span className="font-semibold tabular-nums text-[#7C3A07]">{rollup.counts.approximate}</span></span>
            <span>Pending <span className="font-semibold tabular-nums text-[#475569]">{rollup.counts.pending}</span></span>
          </div>
        </div>

        <p className="mt-3 text-[11.5px] text-[#475569] leading-relaxed">
          {rollup.status === 'audited' && 'Every data source on this view has been read directly from a primary document (uploaded annual report / audited result package) during this build.'}
          {rollup.status === 'approximate' && 'Some sources on this view are widely-cited approximations from analyst training data, not freshly fetched from the primary SIAM / Vahan / FADA endpoint. They are accurate in direction and within a small tolerance, but each cell should be re-verified before being used in published research.'}
          {rollup.status === 'pending' && 'No source data has been uploaded for this company yet.'}
        </p>

        {open && (
          <div className="mt-5">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#E5EAF1]">
                  <th className="text-left font-semibold uppercase tracking-wider text-[10.5px] text-[#6B7280] py-2 pr-3">Source</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[10.5px] text-[#6B7280] py-2 pr-3">Status</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[10.5px] text-[#6B7280] py-2 pr-3">Confidence</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[10.5px] text-[#6B7280] py-2 pr-3">Verified vs primary</th>
                  <th className="text-left font-semibold uppercase tracking-wider text-[10.5px] text-[#6B7280] py-2">File</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.key} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-[#0B1F33]">{v.label}</div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">{v.source}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <StatusPill status={v.meta?.status || 'pending'} size="sm" />
                    </td>
                    <td className="py-3 pr-3 text-[#334E68]">
                      {v.meta?.confidence || '—'}
                    </td>
                    <td className="py-3 pr-3 text-[#334E68]">
                      {v.meta?.verifiedAgainstPrimary ? 'Yes' : 'No'}
                    </td>
                    <td className="py-3">
                      <code className="text-[11px] text-[#6D28D9] bg-[#F4F7FB] px-1.5 py-0.5 rounded">{v.file}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-2">
              {verifications
                .filter((v) => v.meta?.method || v.meta?.upgradePath)
                .map((v) => (
                  <div key={`detail-${v.key}`} className="border-l-2 border-[#DDD0F2] pl-3 py-1">
                    <div className="text-[11.5px] font-semibold text-[#0B1F33]">{v.label}</div>
                    {v.meta?.method && (
                      <div className="text-[11px] text-[#475569] mt-1 leading-snug">
                        <span className="font-semibold text-[#6B7280]">Method:</span> {v.meta.method}
                      </div>
                    )}
                    {v.meta?.upgradePath && v.meta?.status !== 'audited' && (
                      <div className="text-[11px] text-[#6D28D9] mt-1 leading-snug">
                        <span className="font-semibold">Upgrade path:</span> {v.meta.upgradePath}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
