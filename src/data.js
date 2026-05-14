// Two-Wheeler dashboard data. Structure mirrors the PV dashboard sections:
//   header · hero · key-metrics · performance · product-level drivers · supporting-data
// Numbers are illustrative, order-of-magnitude aligned with SIAM, company annual
// reports, and Q4 FY25 investor presentations. Replace cell-by-cell when ready.

const FY_AXIS = ['FY16', 'FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27']

const readPill = (v, kind = 'pp') => {
  if (v === null || v === undefined) return 'Neutral'
  if (kind === 'pp' || kind === 'pct') {
    if (v > 1) return 'Positive'
    if (v < -1) return 'Negative'
    return 'Neutral'
  }
  if (v > 0) return 'Positive'
  if (v < 0) return 'Negative'
  return 'Neutral'
}

const buildBlock = (columns, fy24, fy25, fmt) => {
  const change = fy25.map((v, i) => {
    const a = fy24[i]
    const b = v
    if (typeof a !== 'number' || typeof b !== 'number') return null
    return Number((b - a).toFixed(1))
  })
  const read = change.map((c, i) => (c === null ? 'Neutral' : readPill(c, fmt[i])))
  return { columns, fy24, fy25, change, read, fmt }
}

// ============================================================================
// INDUSTRY (aggregate)
// ============================================================================
const industry = {
  id: 'industry',
  name: 'Industry',
  dotColor: '#6b7280',
  signal: 'Neutral',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: {
    title: 'Indian Two-Wheeler Industry Cockpit',
    subtitle: 'Demand · mix · competitive shifts across OEMs',
    fy: 'FY25',
  },
  kpis: [
    { key: 'volGrowth',   label: 'Volume Growth %', value: '+11.0%', sub: 'FY25 YoY',        delta: '+1.7pp',  tone: 'pos', fmt: 'pp',
      series: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0] },
    { key: 'revGrowth',   label: 'Revenue Growth %', value: '+13.0%', sub: 'FY25 YoY',       delta: '+0.9pp',  tone: 'pos', fmt: 'pp',
      series: [4.0, 8.2, 16.0, 6.5, -14.0, -10.5, -7.0, 18.5, 12.1, 13.0, 9.5, 8.0] },
    { key: 'ebitda',      label: 'EBITDA Margin %', value: '15.0%',  sub: 'FY25',           delta: '+0.8pp',  tone: 'pos', fmt: 'pp',
      series: [15.6, 16.0, 15.4, 14.9, 13.7, 12.6, 10.8, 12.5, 14.2, 15.0, 15.4, 15.7] },
    { key: 'evMix',       label: 'EV Mix %',        value: '6.1%',   sub: 'of 2W FY25',     delta: '+0.9pp',  tone: 'pos', fmt: 'pp',
      series: [0.1, 0.1, 0.2, 0.3, 0.6, 1.0, 2.4, 4.0, 5.2, 6.1, 8.0, 10.0] },
    { key: 'exportMix',   label: 'Export Mix %',    value: '16.3%',  sub: 'of total FY25',  delta: '+1.3pp',  tone: 'pos', fmt: 'pp',
      series: [12.8, 13.8, 12.3, 13.5, 16.7, 17.5, 24.6, 18.6, 15.0, 16.3, 16.7, 17.1] },
    { key: 'premium',     label: 'Premium >150cc %', value: '21.4%', sub: 'of motorcycles', delta: '+2.8pp',  tone: 'pos', fmt: 'pp',
      series: [10.2, 11.5, 12.8, 14.0, 14.6, 15.1, 16.0, 17.1, 18.6, 21.4, 23.0, 24.5] },
  ],
  performance: {
    growth: {
      oem:      [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [62, 62, 63, 64, 65, 66, 66, 65, 63, 61, 60, 58] },
      { name: 'Scooters',    color: '#3b82f6', values: [29, 30, 30, 30, 29, 29, 29, 30, 31, 32, 33, 34] },
      { name: 'Mopeds',      color: '#10b981', values: [9, 8, 7, 6, 5, 5, 5, 4, 4, 4, 3, 3] },
      { name: 'EV 2W',       color: '#f59e0b', values: [0, 0, 0, 0, 1, 0, 0, 1, 2, 3, 4, 5] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'ICE >100cc',     value: '115.6 L', sub: 'FY25 domestic', growth: '+8.0%',  tag: 'Gain'   },
    { name: 'Scooters',            segment: 'Auto / Gear',    value: '60.6 L',  sub: 'FY25 domestic', growth: '+13.0%', tag: 'Gain'   },
    { name: 'Mopeds',              segment: 'Sub-100cc',      value: '7.6 L',   sub: 'FY25 domestic', growth: '-4.0%',  tag: 'Loss'   },
    { name: 'EV Two-Wheelers',     segment: 'Electric',       value: '11.5 L',  sub: 'FY25 domestic', growth: '+30.0%', tag: 'Gain'   },
    { name: 'Premium Motorcycles', segment: '>150cc',         value: '40.5 L',  sub: 'FY25 domestic', growth: '+22.0%', tag: 'Gain'   },
    { name: 'Exports',             segment: 'All segments',   value: '36.8 L',  sub: 'FY25 exports',  growth: '+22.0%', tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Volume Growth %', 'Revenue Growth %', 'Export Growth %'],
      [9.3, 12.1, -3.8],
      [11.0, 13.0, 22.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [27.8, 14.2], [28.4, 15.0], ['pp', 'pp']),
    'Balance Sheet': buildBlock(
      ['Net Debt/EBITDA', 'ROCE %', 'Working Capital (days)'],
      [0.2, 22.4, 28],
      [0.1, 24.6, 26],
      ['pp', 'pp', 'abs'],
    ),
    'Cash Flow': buildBlock(
      ['OCF (₹k Cr)', 'FCF (₹k Cr)', 'Capex (₹k Cr)'],
      [16.8, 8.4, 9.1],
      [19.5, 9.6, 10.4],
      ['pct', 'pct', 'pct'],
    ),
    'Product Mix': buildBlock(
      ['Motorcycles %', 'Scooters %', 'EV %'],
      [63.0, 31.0, 5.2],
      [61.0, 32.0, 6.1],
      ['pp', 'pp', 'pp'],
    ),
    'Market Share': buildBlock(
      ['Top-3 OEM %', '>250cc Leader %', 'EV Leader %'],
      [73.0, 90.0, 38.0],
      [72.0, 85.0, 28.0],
      ['pp', 'pp', 'pp'],
    ),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %',  color: '#1f2937', values: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [4.0, 8.2, 16.0, 6.5, -14.0, -10.5, -7.0, 18.5, 12.1, 13.0, 9.5, 8.0] },
      { name: 'Export Growth %',  color: '#10b981', values: [1.5, 5.0, 20.0, 16.4, -7.4, -3.0, 35.0, -17.0, -5.6, 22.0, 12.0, 10.0] },
    ],
    Margins: [
      { name: 'Gross Margin %',  color: '#1f2937', values: [29.5, 29.7, 29.0, 28.5, 27.6, 26.9, 25.4, 26.9, 27.8, 28.4, 28.7, 29.0] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [15.6, 16.0, 15.4, 14.9, 13.7, 12.6, 10.8, 12.5, 14.2, 15.0, 15.4, 15.7] },
    ],
    'Balance Sheet': [
      { name: 'Net Debt/EBITDA', color: '#1f2937', values: [0.4, 0.3, 0.3, 0.3, 0.4, 0.5, 0.6, 0.4, 0.2, 0.1, 0.1, 0.0] },
      { name: 'ROCE %',          color: '#3b82f6', values: [20, 21, 21, 22, 20, 18, 16, 20, 22.4, 24.6, 25.0, 25.5] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹k Cr)',   color: '#1f2937', values: [10, 12, 14, 15, 13, 11, 10, 14, 16.8, 19.5, 21, 22.5] },
      { name: 'FCF (₹k Cr)',   color: '#3b82f6', values: [4, 5, 7, 7, 5, 4, 3, 6, 8.4, 9.6, 10.5, 11] },
      { name: 'Capex (₹k Cr)', color: '#10b981', values: [6.2, 6.8, 7.2, 7.9, 8.0, 7.0, 7.4, 8.4, 9.1, 10.4, 11.0, 11.5] },
    ],
    'Product Mix': [
      { name: 'Motorcycles %', color: '#1f2937', values: [62, 62, 63, 64, 65, 66, 66, 65, 63, 61, 60, 58] },
      { name: 'Scooters %',    color: '#3b82f6', values: [29, 30, 30, 30, 29, 29, 29, 30, 31, 32, 33, 34] },
      { name: 'EV %',          color: '#10b981', values: [0.1, 0.1, 0.2, 0.3, 0.6, 1.0, 2.4, 4.0, 5.2, 6.1, 8.0, 10.0] },
    ],
    'Market Share': [
      { name: 'Top-3 OEM %',      color: '#1f2937', values: [76, 75, 74, 74, 73, 72, 72, 73, 73, 72, 71, 70] },
      { name: '>250cc Leader %',  color: '#3b82f6', values: [95, 94, 92, 91, 90, 91, 91, 90, 90, 85, 82, 80] },
      { name: 'EV Leader %',      color: '#10b981', values: [null, null, null, null, null, null, null, 45, 38, 28, 26, 25] },
    ],
  },
  modelSource:
    'Sources: SIAM monthly bulletins; OEM annual reports & investor presentations; Vahan registrations dashboard.',
}

// ============================================================================
// TVS MOTOR
// ============================================================================
const tvs = {
  id: 'tvs',
  name: 'TVS Motor',
  dotColor: '#0ea5e9',
  signal: 'Positive',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: { title: 'TVS Motor Cockpit', subtitle: 'Demand · mix · competitive shifts across OEMs', fy: 'FY25' },
  kpis: [
    { key: 'mktShare', label: 'Market Share %', value: '18.6%', sub: 'Domestic 2W FY25', delta: '+0.7pp', tone: 'pos', fmt: 'pp',
      series: [13.8, 14.2, 14.6, 15.4, 16.0, 16.4, 16.8, 17.5, 17.9, 18.6, 19.0, 19.4] },
    { key: 'volGrowth', label: 'Volume Growth %', value: '+13.0%', sub: 'FY25 YoY', delta: '+1.5pp', tone: 'pos', fmt: 'pp',
      series: [3, 8, 18, 12, -12, -1, 9, 14, 11.5, 13, 12, 10] },
    { key: 'revGrowth', label: 'Revenue Growth %', value: '+15.0%', sub: 'FY25 YoY', delta: '-6.0pp', tone: 'neg', fmt: 'pp',
      series: [4, 11, 21, 24, -3, 5, 25, 28, 21, 15, 13, 12] },
    { key: 'ebitda', label: 'EBITDA Margin %', value: '11.8%', sub: 'FY25', delta: '+0.7pp', tone: 'pos', fmt: 'pp',
      series: [7.3, 7.8, 7.9, 8.6, 8.2, 8.5, 9.4, 10.2, 11.1, 11.8, 12.2, 12.5] },
    { key: 'evMix', label: 'EV Mix %', value: '4.8%', sub: 'FY25', delta: '+2.2pp', tone: 'pos', fmt: 'pp',
      series: [0, 0, 0, 0, 0.5, 0.5, 0.6, 1.3, 2.6, 4.8, 6.5, 8.0] },
    { key: 'exportMix', label: 'Export Mix %', value: '18.6%', sub: 'FY25', delta: '+0.4pp', tone: 'pos', fmt: 'pp',
      series: [16, 17.9, 15.6, 18.9, 21.2, 24.2, 28.9, 23.1, 18.1, 18.6, 19.2, 20.0] },
  ],
  performance: {
    growth: {
      oem:      [3, 8, 18, 12, -12, -1, 9, 14, 11.5, 13, 12, 10],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [67, 65, 63, 62, 61.5, 62.5, 61.4, 59.7, 56.9, 53.4, 51.0, 49.0] },
      { name: 'Scooters',    color: '#3b82f6', values: [33, 35, 37, 38, 38, 37, 38, 39, 40.5, 41.8, 42.5, 43.0] },
      { name: 'EV 2W',       color: '#f59e0b', values: [0, 0, 0, 0, 0.5, 0.5, 0.6, 1.3, 2.6, 4.8, 6.5, 8.0] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'Apache + Raider',  value: '14.7 L', sub: 'FY25 units', growth: '+14.0%', tag: 'Gain'   },
    { name: 'Scooters',            segment: 'Jupiter + NTorq',  value: '13.4 L', sub: 'FY25 units', growth: '+8.0%',  tag: 'Gain'   },
    { name: 'Mopeds',              segment: 'XL100',            value: '6.8 L',  sub: 'FY25 units', growth: '-2.0%',  tag: 'Stable' },
    { name: 'EV Two-Wheelers',     segment: 'iQube',            value: '2.2 L',  sub: 'FY25 units', growth: '+45.0%', tag: 'Gain'   },
    { name: 'Premium Motorcycles', segment: 'Apache RR/RTR 200', value: '1.6 L', sub: 'FY25 units', growth: '+18.0%', tag: 'Gain'   },
    { name: 'Exports',             segment: 'All',              value: '8.6 L',  sub: 'FY25 units', growth: '+16.0%', tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Volume Growth %', 'Revenue Growth %', 'Realisation Growth %'],
      [11.5, 21.0, 8.5],
      [13.0, 15.0, 1.7],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [27.4, 11.1], [27.9, 11.8], ['pp', 'pp']),
    'Balance Sheet': buildBlock(['Net Debt/EBITDA', 'ROCE %', 'Working Capital (days)'], [0.6, 24.0, 14], [0.4, 26.5, 12], ['pp', 'pp', 'abs']),
    'Cash Flow': buildBlock(['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'], [2900, 1950, 950], [3650, 2470, 1180], ['pct', 'pct', 'pct']),
    'Product Mix': buildBlock(['Motorcycles %', 'Scooters %', 'EV %'], [56.9, 40.5, 2.6], [53.4, 41.8, 4.8], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['Domestic 2W %', 'Scooter %', 'EV 2W %'], [17.9, 22.5, 14.0], [18.6, 23.8, 21.0], ['pp', 'pp', 'pp']),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %', color: '#1f2937', values: [3, 8, 18, 12, -12, -1, 9, 14, 11.5, 13, 12, 10] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [4, 11, 21, 24, -3, 5, 25, 28, 21, 15, 13, 12] },
      { name: 'Realisation Growth %', color: '#10b981', values: [1, 3, 3, 12, 9, 6, 16, 14, 8.5, 1.7, 1.0, 1.5] },
    ],
    Margins: [
      { name: 'Gross Margin %', color: '#1f2937', values: [25.0, 25.6, 25.8, 26.0, 25.4, 25.8, 25.4, 26.6, 27.4, 27.9, 28.2, 28.5] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [7.3, 7.8, 7.9, 8.6, 8.2, 8.5, 9.4, 10.2, 11.1, 11.8, 12.2, 12.5] },
    ],
    'Balance Sheet': [
      { name: 'Net Debt/EBITDA', color: '#1f2937', values: [0.9, 0.7, 0.6, 0.7, 0.9, 0.8, 0.7, 0.7, 0.6, 0.4, 0.3, 0.2] },
      { name: 'ROCE %',          color: '#3b82f6', values: [18, 19, 20, 21, 19, 18, 20, 22, 24, 26.5, 27, 28] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: '#1f2937', values: [1300, 1500, 1700, 1900, 1800, 1600, 1900, 2400, 2900, 3650, 4000, 4300] },
      { name: 'FCF (₹ Cr)',   color: '#3b82f6', values: [700, 900, 1000, 1200, 1100, 900, 1300, 1600, 1950, 2470, 2700, 2900] },
      { name: 'Capex (₹ Cr)', color: '#10b981', values: [350, 420, 480, 580, 620, 540, 720, 880, 950, 1180, 1300, 1400] },
    ],
    'Product Mix': [
      { name: 'Motorcycles %', color: '#1f2937', values: [67, 65, 63, 62, 61.5, 62.5, 61.4, 59.7, 56.9, 53.4, 51.0, 49.0] },
      { name: 'Scooters %',    color: '#3b82f6', values: [33, 35, 37, 38, 38, 37, 38, 39, 40.5, 41.8, 42.5, 43.0] },
      { name: 'EV %',          color: '#10b981', values: [0, 0, 0, 0, 0.5, 0.5, 0.6, 1.3, 2.6, 4.8, 6.5, 8.0] },
    ],
    'Market Share': [
      { name: 'Domestic 2W %', color: '#1f2937', values: [13.8, 14.2, 14.6, 15.4, 16.0, 16.4, 16.8, 17.5, 17.9, 18.6, 19.0, 19.4] },
      { name: 'Scooter %',     color: '#3b82f6', values: [16, 17, 19, 20, 21, 22, 22, 22.4, 22.5, 23.8, 24.5, 25.0] },
      { name: 'EV 2W %',       color: '#10b981', values: [null, null, null, null, null, null, null, 12, 14, 21, 24, 26] },
    ],
  },
  modelSource: 'Source: TVS Motor Annual Reports / Q4 FY25 Investor Presentation; SIAM; TVS monthly sales press releases.',
}

// ============================================================================
// BAJAJ AUTO
// ============================================================================
const bajaj = {
  id: 'bajaj',
  name: 'Bajaj Auto',
  dotColor: '#1d4ed8',
  signal: 'Positive',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: { title: 'Bajaj Auto Cockpit', subtitle: 'Demand · mix · competitive shifts across OEMs', fy: 'FY25' },
  kpis: [
    { key: 'mktShare', label: 'Market Share %', value: '13.2%', sub: 'Domestic 2W FY25', delta: '+0.4pp', tone: 'pos', fmt: 'pp',
      series: [12.5, 12.0, 11.6, 12.2, 11.2, 11.0, 12.4, 13.0, 12.8, 13.2, 13.5, 13.8] },
    { key: 'volGrowth', label: 'Volume Growth %', value: '+12.0%', sub: 'FY25 YoY', delta: '+4.0pp', tone: 'pos', fmt: 'pp',
      series: [-1, 2, 9, 28, -10, -11, 14, 5, 8, 12, 9, 7] },
    { key: 'revGrowth', label: 'Revenue Growth %', value: '+18.0%', sub: 'FY25 YoY', delta: '+2.0pp', tone: 'pos', fmt: 'pp',
      series: [4, 7, 13, 26, -3, 1, 21, 17, 16, 18, 12, 10] },
    { key: 'ebitda', label: 'EBITDA Margin %', value: '20.2%', sub: 'FY25', delta: '+0.4pp', tone: 'pos', fmt: 'pp',
      series: [20.7, 21.2, 19.9, 16.3, 16.6, 17.7, 16.9, 18.1, 19.8, 20.2, 20.6, 21.0] },
    { key: 'evMix', label: 'EV Mix %', value: '5.2%', sub: 'FY25', delta: '+2.2pp', tone: 'pos', fmt: 'pp',
      series: [0, 0, 0, 0, 0.1, 0.2, 0.4, 1.0, 3.0, 5.2, 7.0, 8.5] },
    { key: 'exportMix', label: 'Export Mix %', value: '38.0%', sub: 'FY25', delta: '-2.0pp', tone: 'neg', fmt: 'pp',
      series: [40, 42, 44, 44, 50, 53, 49, 42, 40, 38, 37, 37] },
  ],
  performance: {
    growth: {
      oem:      [-1, 2, 9, 28, -10, -11, 14, 5, 8, 12, 9, 7],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [100, 100, 100, 100, 99.9, 99.8, 99.6, 99.0, 97.0, 94.8, 93.0, 91.5] },
      { name: 'Scooters',    color: '#3b82f6', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'EV 2W',       color: '#f59e0b', values: [0, 0, 0, 0, 0.1, 0.2, 0.4, 1.0, 3.0, 5.2, 7.0, 8.5] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'Pulsar + Platina', value: '28.6 L', sub: 'FY25 units', growth: '+8.0%',  tag: 'Gain'   },
    { name: 'Scooters',            segment: 'N/A',              value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'Mopeds',              segment: 'N/A',              value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'EV Two-Wheelers',     segment: 'Chetak',           value: '2.3 L',  sub: 'FY25 units', growth: '+85.0%', tag: 'Gain'   },
    { name: 'Premium Motorcycles', segment: 'Pulsar N250 / NS', value: '3.2 L',  sub: 'FY25 units', growth: '+22.0%', tag: 'Gain'   },
    { name: 'Exports',             segment: 'All',              value: '16.9 L', sub: 'FY25 units', growth: '+6.0%',  tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(['Volume Growth %', 'Revenue Growth %', 'Realisation Growth %'], [8.0, 16.0, 8.0], [12.0, 18.0, 6.0], ['pp', 'pp', 'pp']),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [29.5, 19.8], [29.9, 20.2], ['pp', 'pp']),
    'Balance Sheet': buildBlock(['Net Cash (₹k Cr)', 'ROCE %', 'Working Capital (days)'], [13.4, 26.0, -8], [14.8, 28.0, -10], ['pct', 'pp', 'abs']),
    'Cash Flow': buildBlock(['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'], [6800, 6180, 620], [8200, 7420, 780], ['pct', 'pct', 'pct']),
    'Product Mix': buildBlock(['Domestic %', 'Exports %', 'EV %'], [60.0, 40.0, 3.0], [62.0, 38.0, 5.2], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['Domestic 2W %', 'Motorcycle %', 'EV 2W %'], [12.8, 17.0, 11.0], [13.2, 17.8, 18.5], ['pp', 'pp', 'pp']),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %', color: '#1f2937', values: [-1, 2, 9, 28, -10, -11, 14, 5, 8, 12, 9, 7] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [4, 7, 13, 26, -3, 1, 21, 17, 16, 18, 12, 10] },
      { name: 'Realisation Growth %', color: '#10b981', values: [5, 5, 4, -2, 8, 13, 6, 11, 8, 6, 3, 3] },
    ],
    Margins: [
      { name: 'Gross Margin %', color: '#1f2937', values: [28.0, 28.9, 28.4, 28.0, 28.6, 28.2, 27.4, 28.6, 29.5, 29.9, 30.2, 30.5] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [20.7, 21.2, 19.9, 16.3, 16.6, 17.7, 16.9, 18.1, 19.8, 20.2, 20.6, 21.0] },
    ],
    'Balance Sheet': [
      { name: 'Net Cash (₹k Cr)', color: '#1f2937', values: [10.2, 11.4, 12.0, 12.8, 13.5, 14.0, 13.2, 12.8, 13.4, 14.8, 15.6, 16.5] },
      { name: 'ROCE %',           color: '#3b82f6', values: [24, 25, 24, 22, 21, 22, 23, 25, 26, 28, 28.5, 29] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: '#1f2937', values: [3400, 3800, 4200, 4500, 4600, 4400, 5200, 5900, 6800, 8200, 8900, 9400] },
      { name: 'FCF (₹ Cr)',   color: '#3b82f6', values: [3080, 3450, 3820, 4090, 4120, 4020, 4720, 5320, 6180, 7420, 8050, 8500] },
      { name: 'Capex (₹ Cr)', color: '#10b981', values: [320, 350, 380, 410, 480, 380, 480, 580, 620, 780, 850, 900] },
    ],
    'Product Mix': [
      { name: 'Domestic %', color: '#1f2937', values: [60, 58, 56, 56, 50, 47, 51, 58, 60, 62, 63, 63] },
      { name: 'Exports %',  color: '#3b82f6', values: [40, 42, 44, 44, 50, 53, 49, 42, 40, 38, 37, 37] },
      { name: 'EV %',       color: '#10b981', values: [0, 0, 0, 0, 0.1, 0.2, 0.4, 1.0, 3.0, 5.2, 7.0, 8.5] },
    ],
    'Market Share': [
      { name: 'Domestic 2W %', color: '#1f2937', values: [12.5, 12.0, 11.6, 12.2, 11.2, 11.0, 12.4, 13.0, 12.8, 13.2, 13.5, 13.8] },
      { name: 'Motorcycle %',  color: '#3b82f6', values: [16, 16, 16, 17, 16, 15, 17, 18, 17.4, 17.8, 18.2, 18.6] },
      { name: 'EV 2W %',       color: '#10b981', values: [null, null, null, null, null, null, null, 9, 11, 18.5, 20, 21] },
    ],
  },
  modelSource: 'Source: Bajaj Auto Annual Reports / Q4 FY25 Investor Presentation; SIAM; Bajaj monthly sales press releases.',
}

// ============================================================================
// HERO MOTOCORP
// ============================================================================
const hero = {
  id: 'hero',
  name: 'Hero MotoCorp',
  dotColor: '#dc2626',
  signal: 'Neutral',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: { title: 'Hero MotoCorp Cockpit', subtitle: 'Demand · mix · competitive shifts across OEMs', fy: 'FY25' },
  kpis: [
    { key: 'mktShare', label: 'Market Share %', value: '28.6%', sub: 'Domestic 2W FY25', delta: '-0.5pp', tone: 'neg', fmt: 'pp',
      series: [37, 36, 35, 35, 33, 31, 30, 29.5, 29.1, 28.6, 28.0, 27.5] },
    { key: 'volGrowth', label: 'Volume Growth %', value: '+5.0%', sub: 'FY25 YoY', delta: '0.0pp', tone: 'flat', fmt: 'pp',
      series: [-1, 6, 13, 6, -16, -10, -10, 6, 5, 5, 5, 5] },
    { key: 'revGrowth', label: 'Revenue Growth %', value: '+9.0%', sub: 'FY25 YoY', delta: '-4.0pp', tone: 'neg', fmt: 'pp',
      series: [-1, 4, 12, 8, -8, 3, -1, 12, 13, 9, 8, 7] },
    { key: 'ebitda', label: 'EBITDA Margin %', value: '14.8%', sub: 'FY25', delta: '+0.6pp', tone: 'pos', fmt: 'pp',
      series: [16.2, 16.6, 16.4, 14.5, 13.6, 13.0, 11.5, 13.2, 14.2, 14.8, 15.2, 15.5] },
    { key: 'evMix', label: 'EV Mix %', value: '1.0%', sub: 'FY25', delta: '+0.0pp', tone: 'flat', fmt: 'pp',
      series: [0, 0, 0, 0, 0, 0, 0.5, 0.2, 1.0, 1.0, 1.5, 2.0] },
    { key: 'exportMix', label: 'Export Mix %', value: '4.8%', sub: 'FY25', delta: '+0.1pp', tone: 'pos', fmt: 'pp',
      series: [3.1, 3.0, 2.7, 3.8, 4.5, 3.4, 5.8, 5.4, 4.7, 4.8, 5.0, 5.2] },
  ],
  performance: {
    growth: {
      oem:      [-1, 6, 13, 6, -16, -10, -10, 6, 5, 5, 5, 5],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [94, 93, 92, 92, 91, 91, 92, 92, 93, 94, 94, 94] },
      { name: 'Scooters',    color: '#3b82f6', values: [6, 7, 8, 8, 9, 9, 7.5, 7.8, 6, 5, 4.5, 4] },
      { name: 'EV 2W',       color: '#f59e0b', values: [0, 0, 0, 0, 0, 0, 0.5, 0.2, 1.0, 1.0, 1.5, 2.0] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'Splendor + HF + Passion', value: '76.5 L', sub: 'FY25 units', growth: '+4.0%',  tag: 'Stable' },
    { name: 'Scooters',            segment: 'Pleasure + Destini',      value: '2.9 L',  sub: 'FY25 units', growth: '-8.0%',  tag: 'Loss'   },
    { name: 'Mopeds',              segment: 'N/A',                     value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'EV Two-Wheelers',     segment: 'Vida V1',                 value: '0.6 L',  sub: 'FY25 units', growth: '+40.0%', tag: 'Gain'   },
    { name: 'Premium Motorcycles', segment: 'Xtreme + Mavrick + Karizma', value: '2.0 L', sub: 'FY25 units', growth: '+22.0%', tag: 'Gain' },
    { name: 'Exports',             segment: 'All',                     value: '2.8 L',  sub: 'FY25 units', growth: '+8.0%',  tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(['Volume Growth %', 'Revenue Growth %', 'Realisation Growth %'], [5.0, 13.0, 8.0], [5.0, 9.0, 4.0], ['pp', 'pp', 'pp']),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [29.6, 14.2], [30.1, 14.8], ['pp', 'pp']),
    'Balance Sheet': buildBlock(['Net Cash (₹k Cr)', 'ROCE %', 'Working Capital (days)'], [6.5, 22.0, 6], [7.8, 24.5, 5], ['pct', 'pp', 'abs']),
    'Cash Flow': buildBlock(['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'], [4200, 3420, 780], [5100, 4200, 900], ['pct', 'pct', 'pct']),
    'Product Mix': buildBlock(['Motorcycles %', 'Scooters %', 'EV %'], [93.0, 6.0, 1.0], [94.0, 5.0, 1.0], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['Domestic 2W %', 'Motorcycle %', 'EV 2W %'], [29.1, 38.0, 4.5], [28.6, 37.4, 5.0], ['pp', 'pp', 'pp']),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %', color: '#1f2937', values: [-1, 6, 13, 6, -16, -10, -10, 6, 5, 5, 5, 5] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [-1, 4, 12, 8, -8, 3, -1, 12, 13, 9, 8, 7] },
      { name: 'Realisation Growth %', color: '#10b981', values: [0, -2, -1, 2, 8, 13, 9, 6, 8, 4, 3, 2] },
    ],
    Margins: [
      { name: 'Gross Margin %', color: '#1f2937', values: [30.5, 30.2, 30.0, 29.6, 29.0, 28.6, 27.0, 28.4, 29.6, 30.1, 30.4, 30.6] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [16.2, 16.6, 16.4, 14.5, 13.6, 13.0, 11.5, 13.2, 14.2, 14.8, 15.2, 15.5] },
    ],
    'Balance Sheet': [
      { name: 'Net Cash (₹k Cr)', color: '#1f2937', values: [4.8, 5.2, 5.6, 6.0, 6.2, 5.8, 5.4, 6.0, 6.5, 7.8, 8.6, 9.4] },
      { name: 'ROCE %',           color: '#3b82f6', values: [38, 37, 35, 30, 26, 24, 20, 22, 22, 24.5, 25, 25.5] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: '#1f2937', values: [2800, 3000, 3200, 3400, 3300, 3000, 2700, 3500, 4200, 5100, 5500, 5800] },
      { name: 'FCF (₹ Cr)',   color: '#3b82f6', values: [2400, 2550, 2700, 2820, 2680, 2460, 2080, 2780, 3420, 4200, 4520, 4750] },
      { name: 'Capex (₹ Cr)', color: '#10b981', values: [400, 450, 500, 580, 620, 540, 620, 720, 780, 900, 980, 1050] },
    ],
    'Product Mix': [
      { name: 'Motorcycles %', color: '#1f2937', values: [94, 93, 92, 92, 90, 90, 89, 89, 88, 86, 84, 82] },
      { name: 'Scooters %',    color: '#3b82f6', values: [6, 7, 8, 8, 10, 10, 10.5, 10.8, 11, 13, 14.5, 16] },
      { name: 'EV %',          color: '#10b981', values: [0, 0, 0, 0, 0, 0, 0.5, 0.2, 1.0, 1.0, 1.5, 2.0] },
    ],
    'Market Share': [
      { name: 'Domestic 2W %', color: '#1f2937', values: [37, 36, 35, 35, 33, 31, 30, 29.5, 29.1, 28.6, 28.0, 27.5] },
      { name: 'Motorcycle %',  color: '#3b82f6', values: [48, 47, 46, 45, 42, 40, 39, 38.5, 38, 37.4, 37, 36.5] },
      { name: 'EV 2W %',       color: '#10b981', values: [null, null, null, null, null, null, null, 3, 4.5, 5.0, 5.5, 6] },
    ],
  },
  modelSource: 'Source: Hero MotoCorp Annual Reports / Q4 FY25 Investor Presentation; SIAM; Hero monthly sales press releases.',
}

// ============================================================================
// EICHER / ROYAL ENFIELD
// ============================================================================
const eicher = {
  id: 'eicher',
  name: 'Eicher / Royal Enfield',
  dotColor: '#b45309',
  signal: 'Positive',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: { title: 'Eicher / Royal Enfield Cockpit', subtitle: 'Demand · mix · competitive shifts across OEMs', fy: 'FY25' },
  kpis: [
    { key: 'mktShare', label: 'Market Share %', value: '5.4%', sub: 'Domestic 2W FY25', delta: '+0.5pp', tone: 'pos', fmt: 'pp',
      series: [2.8, 3.2, 4.0, 3.6, 3.4, 3.4, 3.7, 4.5, 4.9, 5.4, 5.8, 6.2] },
    { key: 'volGrowth', label: 'Volume Growth %', value: '+15.0%', sub: 'FY25 YoY', delta: '+6.0pp', tone: 'pos', fmt: 'pp',
      series: [55, 28, 22, -2, -16, -13, 10, 32, 9, 15, 12, 10] },
    { key: 'revGrowth', label: 'Revenue Growth %', value: '+18.0%', sub: 'FY25 YoY', delta: '+2.0pp', tone: 'pos', fmt: 'pp',
      series: [50, 28, 27, 5, -8, -2, 13, 36, 16, 18, 14, 12] },
    { key: 'ebitda', label: 'EBITDA Margin %', value: '26.1%', sub: 'RE FY25', delta: '+0.4pp', tone: 'pos', fmt: 'pp',
      series: [30.1, 31.2, 30.5, 28.0, 24.3, 21.4, 22.8, 24.6, 25.7, 26.1, 26.4, 26.6] },
    { key: 'evMix', label: 'EV Mix %', value: '0.0%', sub: 'FY25', delta: '0.0pp', tone: 'flat', fmt: 'pp',
      series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3] },
    { key: 'exportMix', label: 'Export Mix %', value: '11.8%', sub: 'FY25', delta: '+2.8pp', tone: 'pos', fmt: 'pp',
      series: [2.0, 3.1, 3.8, 6.3, 7.5, 6.9, 9.1, 10.2, 9.0, 11.8, 13.5, 15.3] },
  ],
  performance: {
    growth: {
      oem:      [55, 28, 22, -2, -16, -13, 10, 32, 9, 15, 12, 10],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99, 97] },
      { name: 'Scooters',    color: '#3b82f6', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'EV 2W',       color: '#f59e0b', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'Classic + Bullet + Meteor', value: '7.1 L', sub: 'FY25 units', growth: '+3.0%',  tag: 'Stable' },
    { name: 'Scooters',            segment: 'N/A',                       value: '—',     sub: '',           growth: '',       tag: 'Stable' },
    { name: 'Mopeds',              segment: 'N/A',                       value: '—',     sub: '',           growth: '',       tag: 'Stable' },
    { name: 'EV Two-Wheelers',     segment: 'Flying Flea (FY26)',        value: 'Pending',sub: 'Launch FY26',growth: '',       tag: 'Stable' },
    { name: 'Premium Motorcycles', segment: 'Himalayan 450 + 650s',      value: '1.5 L', sub: 'FY25 units', growth: '+62.0%', tag: 'Gain'   },
    { name: 'Exports',             segment: 'All',                       value: '1.2 L', sub: 'FY25 units', growth: '+50.0%', tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(['Volume Growth %', 'Revenue Growth %', 'Realisation Growth %'], [9.0, 16.0, 7.0], [15.0, 18.0, 3.0], ['pp', 'pp', 'pp']),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [42.5, 25.7], [43.0, 26.1], ['pp', 'pp']),
    'Balance Sheet': buildBlock(['Net Cash (₹k Cr)', 'ROCE %', 'Working Capital (days)'], [14.2, 23.0, -2], [16.0, 25.0, -3], ['pct', 'pp', 'abs']),
    'Cash Flow': buildBlock(['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'], [3200, 2580, 620], [3900, 3120, 780], ['pct', 'pct', 'pct']),
    'Product Mix': buildBlock(['350cc %', '450cc+ %', 'Exports %'], [82.0, 8.0, 9.0], [78.0, 12.0, 12.0], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['Domestic 2W %', '>250cc %', 'Premium >150cc %'], [4.9, 88.0, 12.4], [5.4, 85.0, 13.5], ['pp', 'pp', 'pp']),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %', color: '#1f2937', values: [55, 28, 22, -2, -16, -13, 10, 32, 9, 15, 12, 10] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [50, 28, 27, 5, -8, -2, 13, 36, 16, 18, 14, 12] },
      { name: 'Realisation Growth %', color: '#10b981', values: [-3, 0, 4, 7, 10, 13, 3, 3, 7, 3, 2, 2] },
    ],
    Margins: [
      { name: 'Gross Margin %', color: '#1f2937', values: [44.0, 44.5, 43.6, 42.0, 39.8, 38.6, 39.4, 41.8, 42.5, 43.0, 43.4, 43.7] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [30.1, 31.2, 30.5, 28.0, 24.3, 21.4, 22.8, 24.6, 25.7, 26.1, 26.4, 26.6] },
    ],
    'Balance Sheet': [
      { name: 'Net Cash (₹k Cr)', color: '#1f2937', values: [4.8, 6.4, 8.2, 9.6, 10.4, 11.0, 11.8, 12.6, 14.2, 16.0, 17.6, 19.2] },
      { name: 'ROCE %',           color: '#3b82f6', values: [42, 44, 40, 33, 24, 19, 20, 22, 23, 25, 26, 26.5] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: '#1f2937', values: [1800, 2100, 2400, 2200, 2000, 1700, 1900, 2700, 3200, 3900, 4300, 4600] },
      { name: 'FCF (₹ Cr)',   color: '#3b82f6', values: [1580, 1780, 2020, 1740, 1520, 1320, 1440, 2160, 2580, 3120, 3420, 3660] },
      { name: 'Capex (₹ Cr)', color: '#10b981', values: [220, 320, 380, 460, 480, 380, 460, 540, 620, 780, 880, 940] },
    ],
    'Product Mix': [
      { name: '350cc %',   color: '#1f2937', values: [88, 87, 86, 86, 84, 83, 82, 82, 82, 78, 75, 72] },
      { name: '450cc+ %',  color: '#3b82f6', values: [4, 5, 6, 6, 7, 7, 7, 7, 8, 12, 15, 18] },
      { name: 'Exports %', color: '#10b981', values: [3, 4, 5, 6, 7, 8, 9, 10, 9, 12, 14, 16] },
    ],
    'Market Share': [
      { name: 'Domestic 2W %',     color: '#1f2937', values: [2.8, 3.2, 4.0, 3.6, 3.4, 3.4, 3.7, 4.5, 4.9, 5.4, 5.8, 6.2] },
      { name: '>250cc %',          color: '#3b82f6', values: [95, 94, 92, 91, 90, 91, 91, 90, 88, 85, 82, 80] },
      { name: 'Premium >150cc %',  color: '#10b981', values: [10, 11, 11, 12, 12, 12, 12, 12, 12.4, 13.5, 14.2, 15.0] },
    ],
  },
  modelSource: 'Source: Eicher Motors Annual Reports / Q4 FY25 Investor Presentation; SIAM (>250cc segment); Royal Enfield monthly press releases.',
}

// ============================================================================
// OLA ELECTRIC
// ============================================================================
const ola = {
  id: 'ola',
  name: 'Ola Electric',
  dotColor: '#16a34a',
  signal: 'Negative',
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  hero: { title: 'Ola Electric Cockpit', subtitle: 'Demand · mix · competitive shifts across OEMs', fy: 'FY25' },
  kpis: [
    { key: 'mktShare', label: 'Market Share %', value: '28.0%', sub: 'India e-2W FY25', delta: '-10.0pp', tone: 'neg', fmt: 'pp',
      series: [null, null, null, null, null, null, null, 25, 38, 28, 26, 25] },
    { key: 'volGrowth', label: 'Volume Growth %', value: '+24.0%', sub: 'FY25 YoY', delta: '-86.0pp', tone: 'neg', fmt: 'pp',
      series: [null, null, null, null, null, null, 600, 460, 110, 24, 28, 22] },
    { key: 'revGrowth', label: 'Revenue Growth %', value: '+19.0%', sub: 'FY25 YoY', delta: '-69.0pp', tone: 'neg', fmt: 'pp',
      series: [null, null, null, null, null, null, 350, 510, 88, 19, 22, 18] },
    { key: 'ebitda', label: 'EBITDA Margin %', value: '-22.0%', sub: 'FY25', delta: '-5.0pp', tone: 'neg', fmt: 'pp',
      series: [null, null, null, null, null, null, -90.0, -38.0, -17.0, -22.0, -12.0, -4.0] },
    { key: 'evMix', label: 'EV Mix %', value: '100%', sub: 'FY25', delta: '0pp', tone: 'flat', fmt: 'pp',
      series: [null, null, null, null, null, null, 100, 100, 100, 100, 100, 100] },
    { key: 'exportMix', label: 'Export Mix %', value: '0.0%', sub: 'FY25', delta: '0pp', tone: 'flat', fmt: 'pp',
      series: [null, null, null, null, null, null, 0, 0, 0, 0, 2, 5] },
  ],
  performance: {
    growth: {
      oem:      [null, null, null, null, null, null, 600, 460, 110, 24, 28, 22],
      industry: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0],
    },
    mix: [
      { name: 'Motorcycles', color: '#1f2937', values: [null, null, null, null, null, null, 0, 0, 0, 1, 5, 7] },
      { name: 'Scooters',    color: '#3b82f6', values: [null, null, null, null, null, null, 0, 0, 0, 0, 0, 0] },
      { name: 'EV 2W',       color: '#f59e0b', values: [null, null, null, null, null, null, 100, 100, 100, 99, 95, 93] },
    ],
  },
  productDrivers: [
    { name: 'Motorcycles',         segment: 'N/A',                value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'Scooters',            segment: 'N/A',                value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'Mopeds',              segment: 'N/A',                value: '—',      sub: '',           growth: '',       tag: 'Stable' },
    { name: 'EV Two-Wheelers',     segment: 'S1 series',          value: '4.1 L',  sub: 'FY25 units', growth: '+22.0%', tag: 'Gain'   },
    { name: 'Premium Motorcycles', segment: 'Roadster (FY26)',    value: 'Pending',sub: 'Launch FY26',growth: '',       tag: 'Stable' },
    { name: 'Exports',             segment: 'Planned',            value: '—',      sub: '',           growth: '',       tag: 'Stable' },
  ],
  supportingData: {
    Growth: buildBlock(['Volume Growth %', 'Revenue Growth %', 'Realisation Growth %'], [110.0, 88.0, -10.5], [24.0, 19.0, -4.0], ['pp', 'pp', 'pp']),
    Margins: buildBlock(['Gross Margin %', 'EBITDA Margin %'], [16.5, -17.0], [18.4, -22.0], ['pp', 'pp']),
    'Balance Sheet': buildBlock(['Cash (₹ Cr)', 'Net Debt (₹ Cr)', 'Working Capital (days)'], [4620, -1200, 48], [3600, 400, 42], ['pct', 'pct', 'abs']),
    'Cash Flow': buildBlock(['OCF (₹ Cr)', 'FCF (₹ Cr)', 'Capex (₹ Cr)'], [-1100, -2180, 1080], [-800, -2250, 1450], ['pct', 'pct', 'pct']),
    'Product Mix': buildBlock(['Premium %', 'Mass %', 'Motorcycle %'], [78.0, 22.0, 0.0], [60.0, 39.0, 1.0], ['pp', 'pp', 'pp']),
    'Market Share': buildBlock(['India e-2W %', 'Top-3 e-2W %', 'Premium e-2W %'], [38.0, 88.0, 55.0], [28.0, 78.0, 42.0], ['pp', 'pp', 'pp']),
  },
  charts: {
    Growth: [
      { name: 'Volume Growth %', color: '#1f2937', values: [null, null, null, null, null, null, 600, 460, 110, 24, 28, 22] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [null, null, null, null, null, null, 350, 510, 88, 19, 22, 18] },
      { name: 'Realisation Growth %', color: '#10b981', values: [null, null, null, null, null, null, -36, 9, -10, -4, -5, -3] },
    ],
    Margins: [
      { name: 'Gross Margin %', color: '#1f2937', values: [null, null, null, null, null, null, 8.0, 12.0, 16.5, 18.4, 22.0, 25.0] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [null, null, null, null, null, null, -90.0, -38.0, -17.0, -22.0, -12.0, -4.0] },
    ],
    'Balance Sheet': [
      { name: 'Cash (₹ Cr)',     color: '#1f2937', values: [null, null, null, null, null, null, 1800, 5800, 4620, 3600, 2800, 2200] },
      { name: 'Net Debt (₹ Cr)', color: '#3b82f6', values: [null, null, null, null, null, null, -800, -2400, -1200, 400, 1500, 2400] },
    ],
    'Cash Flow': [
      { name: 'OCF (₹ Cr)',   color: '#1f2937', values: [null, null, null, null, null, null, -1800, -2200, -1100, -800, -200, 400] },
      { name: 'FCF (₹ Cr)',   color: '#3b82f6', values: [null, null, null, null, null, null, -2720, -3440, -2180, -2250, -1800, -1100] },
      { name: 'Capex (₹ Cr)', color: '#10b981', values: [null, null, null, null, null, null, 920, 1240, 1080, 1450, 1600, 1500] },
    ],
    'Product Mix': [
      { name: 'Premium %',    color: '#1f2937', values: [null, null, null, null, null, null, 100, 92, 78, 60, 50, 45] },
      { name: 'Mass %',       color: '#3b82f6', values: [null, null, null, null, null, null, 0, 8, 22, 39, 45, 48] },
      { name: 'Motorcycle %', color: '#10b981', values: [null, null, null, null, null, null, 0, 0, 0, 1, 5, 7] },
    ],
    'Market Share': [
      { name: 'India e-2W %',    color: '#1f2937', values: [null, null, null, null, null, null, null, 25, 38, 28, 26, 25] },
      { name: 'Top-3 e-2W %',    color: '#3b82f6', values: [null, null, null, null, null, null, null, 85, 88, 78, 76, 75] },
      { name: 'Premium e-2W %',  color: '#10b981', values: [null, null, null, null, null, null, null, 70, 55, 42, 40, 38] },
    ],
  },
  modelSource: 'Source: Ola Electric Annual Report / Q4 FY25 Investor Presentation; Vahan dashboard registrations.',
}

export const FY = FY_AXIS
export const COMPANIES = [industry, tvs, bajaj, hero, eicher, ola]
export const SUPPORT_BLOCKS = ['Growth', 'Margins', 'Balance Sheet', 'Cash Flow', 'Product Mix', 'Market Share']

export const SECTOR_META = {
  title: '2W Industry Dashboard',
  subtitle: 'Buy-side research view · switch segment',
  badge: '2W',
  latestFy: 'FY25',
  footer:
    'Buy-side research view · Sources: NSE / BSE filings · SIAM monthly bulletins · Annual reports · Quarterly results · Investor presentations',
}
