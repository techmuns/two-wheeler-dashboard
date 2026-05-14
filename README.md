# 2W Industry Dashboard

Buy-side research dashboard for the Indian two-wheeler segment.

Mirrors the structure of the PV dashboard (`techmuns/neha`) — same header, company
selector, KPI row, buy-side signal box, model cards, supporting-data table + chart,
governance row, source panel and CSV export. Built standalone for now; the data
file and component shape are kept generic so the segment can later be merged
back into the parent auto dashboard.

## Companies

- Industry (aggregate)
- TVS Motor
- Bajaj Auto
- Hero MotoCorp
- Eicher Motors / Royal Enfield
- Ola Electric

## Stack

- Vite + React 18
- Tailwind CSS 3
- Recharts for the supporting-data line chart

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static output is written to `dist/` and can be hosted on Cloudflare Pages,
Workers Sites, GitHub Pages, Netlify or any static host.

## Data

All numbers live in `src/data.js`. To merge this back into the parent auto
dashboard later, lift the `COMPANIES` array into the parent `data/` layer
and import per segment.
