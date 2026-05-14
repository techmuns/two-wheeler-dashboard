import React from 'react'
import { SECTOR_META } from '../data.js'

export default function Footer() {
  return (
    <footer className="mt-8 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
      <div>{SECTOR_META.footer}</div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Data refreshed 8h ago
      </div>
    </footer>
  )
}
