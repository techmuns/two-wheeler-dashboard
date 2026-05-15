// Two-Wheeler dashboard data.
//
// TVS is built from the uploaded audited annual-report workbook
// (src/data/companies/tvs.json) — every populated cell is real and cited.
// All other companies are intentionally left blank (no placeholders) until
// their own audited workbook is provided. The UI renders these as 'Pending'
// — same chrome, no synthetic numbers.

import { buildFromActuals } from './data/buildFromActuals.js'
import tvsRaw from './data/companies/tvs.json'

const FY_AXIS = ['FY16', 'FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27']

// ---------- TVS (real, audited) ----------
const tvs = buildFromActuals(tvsRaw, {
  id: 'tvs',
  name: 'TVS Motor Company Ltd',
  publicName: 'TVS',
  shortName: 'TVS',
  brandText: 'TVS',
  brandColor: '#0066B3',
  dotColor: '#0ea5e9',
})

// ---------- Blank companies (no source data yet) ----------
const industry = buildFromActuals(null, {
  id: 'industry',
  name: 'Industry',
  publicName: 'Industry',
  shortName: '2W Industry',
  brandText: '2W INDUSTRY',
  brandColor: '#6D28D9',
  dotColor: '#6b7280',
  heroOverride: {
    title: 'Indian Two-Wheeler Industry Cockpit',
    subtitle: 'Pending — segment-wide data pipeline not yet wired',
    fy: 'FY25',
  },
})

const bajaj = buildFromActuals(null, {
  id: 'bajaj',
  name: 'Bajaj Auto Ltd',
  publicName: 'Bajaj Auto',
  shortName: 'Bajaj',
  brandText: 'BAJAJ',
  brandColor: '#003DA5',
  dotColor: '#1d4ed8',
})

const hero = buildFromActuals(null, {
  id: 'hero',
  name: 'Hero MotoCorp Ltd',
  publicName: 'Hero MotoCorp',
  shortName: 'Hero',
  brandText: 'HERO',
  brandColor: '#E11D48',
  dotColor: '#dc2626',
})

const eicher = buildFromActuals(null, {
  id: 'eicher',
  name: 'Eicher Motors / Royal Enfield',
  publicName: 'Eicher / Royal Enfield',
  shortName: 'Royal Enfield',
  brandText: 'ROYAL ENFIELD',
  brandColor: '#7B3F00',
  dotColor: '#b45309',
})

const ola = buildFromActuals(null, {
  id: 'ola',
  name: 'Ola Electric Mobility Ltd',
  publicName: 'Ola Electric',
  shortName: 'Ola',
  brandText: 'OLA',
  brandColor: '#16A34A',
  dotColor: '#16a34a',
})

export const FY = FY_AXIS
export const COMPANIES = [industry, tvs, bajaj, hero, eicher, ola]
export const SUPPORT_BLOCKS = ['Growth', 'Margins', 'Balance Sheet', 'Cash Flow', 'Product Mix', 'Market Share']

export const SECTOR_META = {
  title: 'Two-Wheeler Industry Cockpit',
  subtitle: 'Auto sector research · segment switcher',
  badge: '2W',
  latestFy: 'FY25',
  footer:
    'Sources: Company annual reports (standalone audited) · audited Q4 result packages · SIAM monthly bulletins · Vahan registrations dashboard',
}
