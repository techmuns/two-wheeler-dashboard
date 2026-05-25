#!/usr/bin/env node
// Populate the operational (volume) overlay for Eicher / Royal Enfield and Ola
// Electric. Their FINANCIALS come from the Screener sidecar (consolidated,
// audited) — Screener carries no volumes — so this writes an `ops` block plus
// volume-derived metrics / dataStatus into src/data/companies/{eicher,ola}.json.
// buildOem() (src/data.js) overlays this onto the Screener financials.
//
// Provenance is mixed and labelled per FY:
//   - Royal Enfield FY17–FY22: Eicher Motors annual reports (BSE filings),
//     parsed in data/raw-eicher-backfill.json (consolidated RE sales volume;
//     domestic + export reconciles to total).
//   - Royal Enfield FY23–FY25: Royal Enfield monthly/annual sale-volume press
//     releases filed with BSE/NSE (FY23 total 8,34,895 confirmed), cross-checked
//     against Autocar Professional / Team-BHP fiscal-year reports. The FY23–FY25
//     AR PDFs were not retrievable from BSE (GUID-URL 404), so these three years
//     are press-sourced, not AR-parsed.
//   - Ola Electric FY22–FY25: reported fiscal-year deliveries (Autocar
//     Professional industry e-2W sales). Ola is 100% electric scooters.
//
// FY16 is left null for Royal Enfield (Eicher's FY16 was a 15-month transition
// period and not comparable). Ola pre-FY22 is null (pre-commercial-launch).

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const FY = ['FY16','FY17','FY18','FY19','FY20','FY21','FY22','FY23','FY24','FY25']
const idx = (fy) => FY.indexOf(fy)

const r2 = (v) => (v === null ? null : Number(v.toFixed(2)))
const arr10 = () => new Array(10).fill(null)
const yoy = (cur, prev) => (typeof cur === 'number' && typeof prev === 'number' && prev !== 0)
  ? r2((cur / prev - 1) * 100) : null

// ---- Royal Enfield motorcycle volumes (total / domestic / export), by FY ----
// 'AR' = Eicher annual-report disclosure; 'PR' = RE sale-volume press release.
const RE = {
  FY17: { total: 666135, domestic: null,   export: 15383,  src: 'AR' },
  FY18: { total: 820121, domestic: 801230, export: 18891,  src: 'AR' },
  FY19: { total: 822724, domestic: 803003, export: 19721,  src: 'AR' },
  FY20: { total: 697582, domestic: 658920, export: 38662,  src: 'AR' },
  FY21: { total: 609403, domestic: 573728, export: 35675,  src: 'AR' },
  FY22: { total: 595474, domestic: 521236, export: 74238,  src: 'AR' },
  FY23: { total: 834895, domestic: 734840, export: 100055, src: 'PR' },
  FY24: { total: 912732, domestic: 834795, export: 77937,  src: 'PR' },
  FY25: { total: 1002893, domestic: 902757, export: 100136, src: 'PR' },
}

// ---- Ola Electric scooter deliveries (100% EV), by FY ----
const OLA = { FY22: 20948, FY23: 156251, FY24: 329618, FY25: 344009 }

const AR_CITE = (fy) => `Eicher Motors Annual Report ${fyLabel(fy)} (BSE filing, scripcode 505200) — Royal Enfield consolidated motorcycle sales volume (MD&A / operational highlights); domestic + export reconciles to total. Parsed in data/raw-eicher-backfill.json.`
const PR_CITE = (fy) => `Royal Enfield monthly/annual sale-volume press release filed with BSE/NSE for ${fyLabel(fy)} (FY23 total 8,34,895 confirmed in the Eicher IR press release); cross-checked against Autocar Professional / Team-BHP fiscal-year reports. The ${fyLabel(fy)} AR PDF was not retrievable from BSE (recent-year GUID URL 404), so this year is press-sourced.`
function fyLabel(fy) {
  const y = 2000 + Number(fy.slice(2))
  return `FY${y - 1}-${String(y).slice(2)}`
}

async function buildEicher() {
  const p = join(ROOT, 'src/data/companies/eicher.json')
  const co = JSON.parse(await readFile(p, 'utf8'))

  const totalVolume = arr10()
  const motorcyclesByFy = {}, scootersByFy = {}, mopedsByFy = {}, threeWheelersByFy = {}, exportsByFy = {}, evByFy = {}
  const productMix = {}, powertrainMix = {}, domesticExportMix = {}
  const perFY = {}

  for (const [fy, d] of Object.entries(RE)) {
    totalVolume[idx(fy)] = d.total
    motorcyclesByFy[fy] = d.total          // Royal Enfield is 100% motorcycles
    scootersByFy[fy] = 0
    mopedsByFy[fy] = 0
    threeWheelersByFy[fy] = 0
    evByFy[fy] = 0                          // RE is 100% ICE through FY25
    if (typeof d.export === 'number') exportsByFy[fy] = d.export
    productMix[fy] = 'available'
    powertrainMix[fy] = 'available'
    domesticExportMix[fy] = typeof d.export === 'number' ? 'derived' : 'unavailable'
    perFY[fy] = d.src === 'AR' ? AR_CITE(fy) : PR_CITE(fy)
  }

  const volumeGrowth = arr10()
  for (let i = 1; i < 10; i++) volumeGrowth[i] = yoy(totalVolume[i], totalVolume[i - 1])
  const evShare = FY.map((fy) => (fy in RE ? 0 : null))

  co.basis = 'Financials: Eicher Motors consolidated (Screener). Volumes: Royal Enfield motorcycles.'
  co.verification = {
    status: 'audited',
    confidence: 'medium',
    verifiedAgainstPrimary: true,
    method: 'Financials: Eicher Motors consolidated, from the Screener sidecar (BSE/NSE filings). Volumes: Royal Enfield motorcycle sales — FY17–FY22 parsed from Eicher Motors annual reports (BSE, scripcode 505200; data/raw-eicher-backfill.json), FY23–FY25 from Royal Enfield sale-volume press releases (BSE/NSE) cross-checked against Autocar Professional / Team-BHP. FY16 omitted (15-month transition year). VECV commercial-vehicle volumes excluded — this is the Royal Enfield (2W) view.',
    upgradePath: 'Retrieve the FY23–FY25 Eicher AR PDFs (recent-year BSE GUID URLs 404 in the scraper) to replace the press-sourced volumes with AR-parsed figures.',
  }
  co.sources = {
    primary: 'Eicher Motors consolidated financials (Screener.in) + Royal Enfield motorcycle sales volumes from Eicher Motors annual reports (FY17–FY22, BSE) and RE sale-volume press releases (FY23–FY25).',
    notes: 'Royal Enfield is 100% motorcycles (no scooters/mopeds/3W) and 100% ICE through FY25 (Flying Flea EV is FY26+). Domestic/export split disclosed per RE press releases / ARs. Realisation-per-unit is intentionally NOT computed: revenue is Eicher consolidated (includes the VECV commercial-vehicle JV) while volume is Royal Enfield only, so the ratio would be meaningless. FY16 is a 15-month transition period and left null.',
    perFY,
  }
  co.ops = {
    totalVolume,
    motorcyclesByFy, scootersByFy, mopedsByFy, threeWheelersByFy, exportsByFy, evByFy,
    notes: {
      basis: 'Royal Enfield motorcycles (consolidated). VECV commercial vehicles excluded.',
      ev: 'Royal Enfield had no electric model through FY25; powertrain mix is 100% ICE.',
      sources: 'FY17–FY22 from Eicher annual reports (BSE); FY23–FY25 from RE sale-volume press releases (BSE/NSE), cross-checked with trade press.',
    },
    sourcesByFy: { productMix: { ...perFY }, exports: { ...perFY } },
  }
  co.metrics = { volumeGrowth, evShare }
  co.dataStatus = {
    productMix, powertrainMix, domesticExportMix,
    ccMix: Object.fromEntries(FY.map((fy) => [fy, 'paid_source_required'])),
    revenueMix: Object.fromEntries(FY.map((fy) => [fy, 'unavailable'])),
    statusLegend: {
      available: 'Royal Enfield volume disclosed in the Eicher annual report (FY17–FY22) or RE sale-volume press release (FY23–FY25).',
      derived: 'Computed from disclosed figures (Domestic = Total − Export; volume growth = YoY of total RE units).',
      unavailable: 'Not separately disclosed for that FY.',
      paid_source_required: 'Engine-capacity (350cc vs 650cc) unit split needs SIAM / JATO — not in the annual report.',
    },
  }
  co.na = [
    '350cc vs 650cc volume split (not disclosed as RE-total units in the AR)',
    'Royal Enfield standalone vs consolidated reconciliation (using consolidated)',
    'Capacity Utilisation %',
    'Stock Price 31-Mar',
  ]

  await writeFile(p, compact(JSON.stringify(co, null, 2)) + '\n', 'utf8')
  console.log('eicher RE totalVolume:', JSON.stringify(totalVolume))
  console.log('eicher volumeGrowth :', JSON.stringify(volumeGrowth))
}

async function buildOla() {
  const p = join(ROOT, 'src/data/companies/ola.json')
  const co = JSON.parse(await readFile(p, 'utf8'))

  const totalVolume = arr10()
  const motorcyclesByFy = {}, scootersByFy = {}, mopedsByFy = {}, threeWheelersByFy = {}, exportsByFy = {}, evByFy = {}
  const productMix = {}, powertrainMix = {}, domesticExportMix = {}, perFY = {}

  for (const [fy, units] of Object.entries(OLA)) {
    totalVolume[idx(fy)] = units
    scootersByFy[fy] = units               // Ola sells electric scooters only
    motorcyclesByFy[fy] = 0
    mopedsByFy[fy] = 0
    threeWheelersByFy[fy] = 0
    evByFy[fy] = units                      // 100% EV
    exportsByFy[fy] = 0                     // domestic only
    productMix[fy] = 'available'
    powertrainMix[fy] = 'available'
    domesticExportMix[fy] = 'derived'
    perFY[fy] = `Ola Electric reported fiscal-year scooter deliveries for ${fyLabel(fy)} (Autocar Professional industry e-2W sales; Ola Electric investor disclosures). Ola is 100% electric scooters.`
  }

  const volumeGrowth = arr10()
  for (let i = 1; i < 10; i++) volumeGrowth[i] = yoy(totalVolume[i], totalVolume[i - 1])
  const evShare = FY.map((fy) => (fy in OLA ? 100 : null))

  co.basis = 'Financials: Ola Electric Mobility consolidated (Screener). Volumes: electric scooter deliveries.'
  co.verification = {
    status: 'audited',
    confidence: 'medium',
    verifiedAgainstPrimary: false,
    method: 'Financials from the Screener sidecar (BSE/NSE filings). Volumes: fiscal-year electric-scooter deliveries (FY22–FY25) from Ola Electric disclosures / Autocar Professional industry e-2W sales. Ola Electric IPO was Aug-2024, so FY22–FY23 predate BSE annual reports (DRHP-era); the FY24/FY25 AR PDFs were not retrievable from BSE (GUID URL 404). Volumes are therefore press/industry-sourced, not AR-parsed.',
    upgradePath: 'Parse the FY24/FY25 Ola Electric AR PDFs (once the recent-year BSE URL is fixed) and the DRHP (FY22/FY23) to replace press-sourced volumes.',
  }
  co.sources = {
    primary: 'Ola Electric consolidated financials (Screener.in) + fiscal-year scooter deliveries (Ola Electric disclosures / Autocar Professional).',
    notes: 'Ola Electric sells electric scooters only — product mix is 100% scooters, powertrain 100% EV, domestic-only. FY22 was the first meaningful commercial year (S1 launch Dec-2021). FY25 deliveries 3.44 lakh (+4% YoY); note Ola\'s reported deliveries diverged from Vahan registrations in FY25.',
    perFY,
  }
  co.ops = {
    totalVolume,
    motorcyclesByFy, scootersByFy, mopedsByFy, threeWheelersByFy, exportsByFy, evByFy,
    notes: {
      basis: 'Electric scooter deliveries (Ola S1 family).',
      ev: '100% electric by definition.',
      sources: 'FY22–FY25 from Ola Electric disclosures / Autocar Professional industry e-2W sales.',
    },
    sourcesByFy: { productMix: { ...perFY } },
  }
  co.metrics = { volumeGrowth, evShare }
  co.dataStatus = {
    productMix, powertrainMix, domesticExportMix,
    ccMix: Object.fromEntries(FY.map((fy) => [fy, 'unavailable'])),
    revenueMix: Object.fromEntries(FY.map((fy) => [fy, 'unavailable'])),
    statusLegend: {
      available: 'Ola scooter deliveries reported for that FY (company disclosures / industry sales).',
      derived: 'Computed: EV mix 100%, domestic 100%, volume growth = YoY of deliveries.',
      unavailable: 'Not applicable / not disclosed.',
    },
  }
  co.na = ['Pre-FY22 volumes (entity pre-commercial)', 'Capacity Utilisation %', 'Stock Price 31-Mar']

  await writeFile(p, compact(JSON.stringify(co, null, 2)) + '\n', 'utf8')
  console.log('ola totalVolume     :', JSON.stringify(totalVolume))
  console.log('ola volumeGrowth    :', JSON.stringify(volumeGrowth))
}

// Keep scalar arrays on one line (match repo style).
const compact = (json) =>
  json.replace(/\[[^\[\]{}]*?\]/gs, (m) => m.replace(/\s*\n\s*/g, ' ').replace(/\[\s+/, '[').replace(/\s+\]/, ']'))

await buildEicher()
await buildOla()
console.log('\nwrote eicher.json + ola.json ops overlays')
