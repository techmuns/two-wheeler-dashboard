// CSV export bundling all dashboard sections for the active company.

const csvCell = (v) => {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

const rowsToCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\n')

export function exportCompanyCsv(company, FY) {
  const sections = []

  sections.push([`# ${company.name} — 2W Industry Dashboard export`])
  sections.push([`# Generated ${new Date().toISOString()}`])
  sections.push([''])

  sections.push(['## Buy-side signal'])
  sections.push(['Rating', company.buySide.rating])
  sections.push(['Confidence', company.buySide.confidence])
  sections.push(['Note', company.signalNote])
  company.buySide.bullets.forEach((b, i) => sections.push([`Bullet ${i + 1}`, b]))
  sections.push([''])

  sections.push(['## KPIs'])
  sections.push(['Label', 'Value', 'Sub', 'Delta'])
  company.kpis.forEach((k) => sections.push([k.label, k.value, k.sub, k.delta]))
  sections.push([''])

  sections.push(['## Top Models'])
  sections.push(['Model', 'Segment', 'FY25 Units', 'Growth', 'Tag'])
  company.topModels.forEach((m) =>
    sections.push([m.name, m.segment, m.units, m.growth, m.tag]),
  )
  sections.push([''])

  sections.push(['## Supporting Data'])
  Object.entries(company.supportingData).forEach(([block, d]) => {
    sections.push([`# ${block}`])
    sections.push(['Metric', ...d.columns])
    sections.push(['FY24', ...d.fy24])
    sections.push(['FY25', ...d.fy25])
    sections.push(['Change', ...d.change])
    sections.push(['Read', ...d.read])
    sections.push([''])
  })

  sections.push(['## Chart series (FY16..FY27)'])
  Object.entries(company.charts).forEach(([block, series]) => {
    sections.push([`# ${block}`])
    sections.push(['Series', ...FY])
    series.forEach((s) => sections.push([s.name, ...s.values]))
    sections.push([''])
  })

  sections.push(['## Governance'])
  sections.push(['Field', 'Value'])
  Object.entries(company.governance).forEach(([k, v]) => sections.push([k, v]))
  sections.push([''])
  sections.push(['Source', company.governanceSource])

  const csv = rowsToCsv(sections)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `2w-dashboard-${company.id}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
