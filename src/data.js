// Two-Wheeler dashboard data.
// Numbers are illustrative, in line with public order-of-magnitude reporting
// from company annual reports, SIAM, and quarterly investor presentations.
// Volumes are stated in Lakh (L) units unless otherwise noted.

const FY_AXIS = ['FY16', 'FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27']

const readPill = (v, kind = 'pp') => {
  // kind 'pp' for percentage-point deltas, 'pct' for percent change, 'abs' for absolute
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

// Build a supporting-data block from row arrays.
const buildBlock = (columns, fy24, fy25, fmt) => {
  const change = fy25.map((v, i) => {
    const a = fy24[i]
    const b = v
    if (typeof a !== 'number' || typeof b !== 'number') return null
    return Number((b - a).toFixed(1))
  })
  const read = change.map((c, i) => {
    if (c === null) return 'Neutral'
    return readPill(c, fmt[i])
  })
  return { columns, fy24, fy25, change, read, fmt }
}

// Series helper — build labelled chart series for the supporting blocks.
const series = (entries) => entries // [{name, color, values:[12]}]

// ---------- INDUSTRY ----------
const industry = {
  id: 'industry',
  name: 'Industry',
  dotColor: '#6b7280',
  signal: 'Neutral',
  signalNote: 'Industry-wide buy-side read',
  buySide: {
    rating: 'HOLD',
    confidence: 'Moderate',
    bullets: [
      'FY25 domestic 2W volumes near 190L — recovery vs FY20–22 trough but still below FY19 peak.',
      'Premiumisation driving mix; entry-commuter still soft on rural sentiment.',
      'EV penetration at ~6% of 2W; subsidy rationalisation a near-term overhang.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Domestic Volume', value: '189.4 L', sub: 'FY25', delta: '+11.0%', tone: 'pos' },
    { label: 'Exports', value: '36.8 L', sub: 'FY25', delta: '+22.0%', tone: 'pos' },
    { label: 'EV Share', value: '6.1%', sub: 'of 2W', delta: '+0.9pp', tone: 'pos' },
    { label: 'Industry Revenue', value: '₹1.42 L Cr', sub: 'FY25E', delta: '+13.0%', tone: 'pos' },
    { label: 'Avg ASP', value: '₹86k', sub: 'FY25', delta: '+4.0%', tone: 'pos' },
    { label: 'Channel Inventory', value: '38 days', sub: 'Apr-26', delta: '+3 d', tone: 'neg' },
  ],
  topModels: [
    { name: 'Splendor', segment: 'Commuter', units: '50.2 L', sub: 'FY25 units', growth: '+6.0%', tag: 'Stable' },
    { name: 'Activa',   segment: 'Scooter',  units: '30.4 L', sub: 'FY25 units', growth: '+8.0%', tag: 'Gain'   },
    { name: 'HF Deluxe',segment: 'Entry Commuter', units: '20.1 L', sub: 'FY25 units', growth: '-3.0%', tag: 'Loss'   },
    { name: 'Pulsar',   segment: 'Premium Motorcycle', units: '14.0 L', sub: 'FY25 units', growth: '+9.0%', tag: 'Gain'   },
    { name: 'Apache',   segment: 'Sports',   units: '6.5 L',  sub: 'FY25 units', growth: '+11.0%', tag: 'Gain'  },
    { name: 'Classic 350',segment: 'Cruiser',units: '5.1 L',  sub: 'FY25 units', growth: '+4.0%', tag: 'Stable' },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Volume Growth %', 'Revenue Growth %', 'Export Growth %'],
      [9.3, 12.1, -3.8],
      [11.0, 13.0, 22.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [27.8, 14.2],
      [28.4, 15.0],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['ICE Share %', 'EV Share %', 'Premium >150cc %'],
      [94.8, 5.2, 18.6],
      [93.9, 6.1, 21.4],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [170.6, 30.2, 200.8],
      [189.4, 36.8, 226.2],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹k Cr)', 'R&D % of Sales', 'Net Debt / EBITDA'],
      [9.1, 2.8, 0.2],
      [10.4, 3.1, 0.1],
      ['pct', 'pp', 'pp'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [21, 14, 'Splendor'],
      [27, 19, 'Splendor'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Volume Growth %', color: '#1f2937', values: [3.0, 6.9, 14.8, 4.9, -17.8, -13.2, -10.6, 16.9, 9.3, 11.0, 8.5, 7.0] },
      { name: 'Revenue Growth %', color: '#3b82f6', values: [4.0, 8.2, 16.0, 6.5, -14.0, -10.5, -7.0, 18.5, 12.1, 13.0, 9.5, 8.0] },
      { name: 'Export Growth %',  color: '#10b981', values: [1.5, 5.0, 20.0, 16.4, -7.4, -3.0, 35.0, -17.0, -5.6, 22.0, 12.0, 10.0] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [29.5, 29.7, 29.0, 28.5, 27.6, 26.9, 25.4, 26.9, 27.8, 28.4, 28.7, 29.0] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [15.6, 16.0, 15.4, 14.9, 13.7, 12.6, 10.8, 12.5, 14.2, 15.0, 15.4, 15.7] },
    ]),
    Mix: series([
      { name: 'ICE Share %', color: '#1f2937', values: [99.9, 99.9, 99.8, 99.7, 99.4, 99.0, 97.6, 96.0, 94.8, 93.9, 92.0, 90.0] },
      { name: 'EV Share %',  color: '#3b82f6', values: [0.1, 0.1, 0.2, 0.3, 0.6, 1.0, 2.4, 4.0, 5.2, 6.1, 8.0, 10.0] },
      { name: 'Premium >150cc %', color: '#10b981', values: [10.2, 11.5, 12.8, 14.0, 14.6, 15.1, 16.0, 17.1, 18.6, 21.4, 23.0, 24.5] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [164, 175, 200, 211, 174, 151, 135, 158, 170.6, 189.4, 205, 218] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [24, 28, 28, 33, 35, 32, 44, 36, 30.2, 36.8, 41, 45] },
      { name: 'Total (L)',    color: '#10b981', values: [188, 203, 228, 244, 209, 183, 179, 194, 200.8, 226.2, 246, 263] },
    ]),
    Capital: series([
      { name: 'Capex (₹k Cr)', color: '#1f2937', values: [6.2, 6.8, 7.2, 7.9, 8.0, 7.0, 7.4, 8.4, 9.1, 10.4, 11.0, 11.5] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.5, 2.6, 2.8, 3.1, 3.3, 3.5] },
      { name: 'Net Debt / EBITDA', color: '#10b981', values: [0.4, 0.3, 0.3, 0.3, 0.4, 0.5, 0.6, 0.4, 0.2, 0.1, 0.1, 0.0] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [12, 14, 15, 16, 11, 10, 18, 22, 21, 27, 28, 30] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [8, 9, 10, 12, 8, 7, 11, 13, 14, 19, 20, 21] },
    ]),
  },
  governance: {
    CEO: '—',
    CFO: '—',
    COO: '—',
    'Credit Rating': '—',
    'Sales Outlets': '~28,500',
    Employees: '—',
  },
  governanceSource:
    'Sources: SIAM monthly bulletins · Company annual reports (Hero, Bajaj, TVS, Eicher, Ola Electric) · Vahan dashboard. Last updated 14/05/2026.',
  modelSource:
    'Source: SIAM (industry / segment volumes); company annual reports & monthly press releases for model-level volumes.',
}

// ---------- TVS MOTOR ----------
const tvs = {
  id: 'tvs',
  name: 'TVS Motor',
  dotColor: '#0ea5e9',
  signal: 'Positive',
  signalNote: 'Outperforming on premium scooter & EV ramp',
  buySide: {
    rating: 'BUY',
    confidence: 'High',
    bullets: [
      'iQube electric scooter scaled past 2L units; #2 e-2W player by FY25.',
      'Apache RTR & Raider sustaining double-digit growth — premiumisation tailwind intact.',
      'EBITDA margin at 11.8% (FY25), with operating leverage from scooter mix.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Volume',         value: '46.2 L', sub: 'FY25',     delta: '+13.0%', tone: 'pos' },
    { label: 'Market Share',   value: '18.6%',  sub: 'Domestic 2W FY25', delta: '+0.7pp', tone: 'pos' },
    { label: 'Revenue',        value: '₹36.1k Cr', sub: 'FY25',  delta: '+15.0%', tone: 'pos' },
    { label: 'EBITDA Margin',  value: '11.8%',  sub: 'FY25',     delta: '+0.7pp', tone: 'pos' },
    { label: 'PAT',            value: '₹2,310 Cr', sub: 'FY25',  delta: '+24.0%', tone: 'pos' },
    { label: 'ROE',            value: '28.4%',  sub: 'FY25',     delta: '+2.5pp', tone: 'pos' },
  ],
  topModels: [
    { name: 'Jupiter',   segment: 'Scooter',          units: '10.4 L', sub: 'FY25 units', growth: '+9.0%',  tag: 'Gain'   },
    { name: 'Apache',    segment: 'Sports',           units: '6.5 L',  sub: 'FY25 units', growth: '+12.0%', tag: 'Gain'   },
    { name: 'Raider 125',segment: 'Commuter',         units: '5.1 L',  sub: 'FY25 units', growth: '+18.0%', tag: 'Gain'   },
    { name: 'Star City+',segment: 'Commuter',         units: '4.2 L',  sub: 'FY25 units', growth: '+2.0%',  tag: 'Stable' },
    { name: 'NTorq',     segment: 'Scooter',          units: '3.0 L',  sub: 'FY25 units', growth: '+5.0%',  tag: 'Stable' },
    { name: 'iQube',     segment: 'Electric Scooter', units: '2.2 L',  sub: 'FY25 units', growth: '+45.0%', tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [21.0, 11.5, 8.5],
      [15.0, 13.0, 1.7],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [27.4, 11.1],
      [27.9, 11.8],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['Scooter %', 'Motorcycle %', 'EV %'],
      [40.5, 56.9, 2.6],
      [41.8, 53.4, 4.8],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [33.4, 7.4, 40.8],
      [37.6, 8.6, 46.2],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹ Cr)', 'R&D % of Sales', 'Net Debt / EBITDA'],
      [950, 4.6, 0.6],
      [1180, 5.0, 0.4],
      ['pct', 'pp', 'pp'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [4, 3, 'Jupiter'],
      [5, 4, 'Jupiter'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Revenue Growth %', color: '#1f2937', values: [4, 11, 21, 24, -3, 5, 25, 28, 21, 15, 13, 12] },
      { name: 'Volume Growth %',  color: '#3b82f6', values: [3, 8, 18, 12, -12, -1, 9, 14, 11.5, 13, 12, 10] },
      { name: 'Realisation Growth %', color: '#10b981', values: [1, 3, 3, 12, 9, 6, 16, 14, 8.5, 1.7, 1.0, 1.5] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [25.0, 25.6, 25.8, 26.0, 25.4, 25.8, 25.4, 26.6, 27.4, 27.9, 28.2, 28.5] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [7.3, 7.8, 7.9, 8.6, 8.2, 8.5, 9.4, 10.2, 11.1, 11.8, 12.2, 12.5] },
    ]),
    Mix: series([
      { name: 'Scooter %', color: '#1f2937', values: [33, 35, 37, 38, 38, 37, 38, 39, 40.5, 41.8, 42.5, 43.0] },
      { name: 'Motorcycle %', color: '#3b82f6', values: [67, 65, 63, 62, 61.5, 62.5, 61.4, 59.7, 56.9, 53.4, 51.0, 49.0] },
      { name: 'EV %', color: '#10b981', values: [0, 0, 0, 0, 0.5, 0.5, 0.6, 1.3, 2.6, 4.8, 6.5, 8.0] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [21, 23, 27, 30, 26, 25, 27, 30, 33.4, 37.6, 40, 42] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [4, 5, 5, 7, 7, 8, 11, 9, 7.4, 8.6, 9.5, 10.5] },
      { name: 'Total (L)',    color: '#10b981', values: [25, 28, 32, 37, 33, 33, 38, 39, 40.8, 46.2, 49.5, 52.5] },
    ]),
    Capital: series([
      { name: 'Capex (₹ Cr)', color: '#1f2937', values: [350, 420, 480, 580, 620, 540, 720, 880, 950, 1180, 1300, 1400] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [2.4, 2.7, 3.0, 3.4, 3.7, 4.0, 4.2, 4.4, 4.6, 5.0, 5.2, 5.4] },
      { name: 'Net Debt / EBITDA', color: '#10b981', values: [0.7, 0.5, 0.4, 0.5, 0.8, 0.7, 0.6, 0.6, 0.6, 0.4, 0.3, 0.2] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [3, 4, 4, 5, 3, 2, 4, 5, 4, 5, 5, 6] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [2, 3, 3, 4, 2, 2, 3, 4, 3, 4, 4, 5] },
    ]),
  },
  governance: {
    CEO: 'K.N. Radhakrishnan',
    CFO: 'K. Gopala Desikan',
    COO: '—',
    'Credit Rating': 'CRISIL AA+ / Stable',
    'Sales Outlets': '~5,200',
    Employees: '~6,800',
  },
  governanceSource:
    'KMP per https://www.tvsmotor.com/en/About-Us/Leadership · Credit rating per https://www.crisilratings.com · Dealers / employees per TVS Motor FY25 annual report. Last updated 14/05/2026.',
  modelSource:
    'Source: TVS Motor Annual Reports / Q4 FY25 Investor Presentation; SIAM (segment volumes); TVS monthly sales press releases.',
}

// ---------- BAJAJ AUTO ----------
const bajaj = {
  id: 'bajaj',
  name: 'Bajaj Auto',
  dotColor: '#1d4ed8',
  signal: 'Positive',
  signalNote: 'Strong export rebound + Pulsar refresh momentum',
  buySide: {
    rating: 'BUY',
    confidence: 'High',
    bullets: [
      'Exports recovered to ~17L units (FY25) — Africa & LatAm volumes back online.',
      'Chetak EV crossed 2L; #3 e-2W with improving unit economics.',
      'EBITDA margin at industry-best 20.2%, supported by 125cc Pulsar mix shift.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Volume',         value: '44.5 L', sub: 'FY25',     delta: '+12.0%', tone: 'pos' },
    { label: 'Market Share',   value: '13.2%',  sub: 'Domestic 2W FY25', delta: '+0.4pp', tone: 'pos' },
    { label: 'Revenue',        value: '₹50.1k Cr', sub: 'FY25',  delta: '+18.0%', tone: 'pos' },
    { label: 'EBITDA Margin',  value: '20.2%',  sub: 'FY25',     delta: '+0.4pp', tone: 'pos' },
    { label: 'PAT',            value: '₹7,860 Cr', sub: 'FY25',  delta: '+19.0%', tone: 'pos' },
    { label: 'ROE',            value: '25.6%',  sub: 'FY25',     delta: '+1.6pp', tone: 'pos' },
  ],
  topModels: [
    { name: 'Pulsar',     segment: 'Premium Motorcycle', units: '14.2 L', sub: 'FY25 units', growth: '+10.0%', tag: 'Gain'   },
    { name: 'Platina',    segment: 'Entry Commuter',     units: '7.0 L',  sub: 'FY25 units', growth: '+4.0%',  tag: 'Stable' },
    { name: 'CT 100/110', segment: 'Entry Commuter',     units: '6.1 L',  sub: 'FY25 units', growth: '-6.0%',  tag: 'Loss'   },
    { name: 'Chetak',     segment: 'Electric Scooter',   units: '2.3 L',  sub: 'FY25 units', growth: '+85.0%', tag: 'Gain'   },
    { name: 'Pulsar N250',segment: 'Premium Motorcycle', units: '1.5 L',  sub: 'FY25 units', growth: '+22.0%', tag: 'Gain'   },
    { name: 'Dominar',    segment: 'Touring',            units: '0.7 L',  sub: 'FY25 units', growth: '+1.0%',  tag: 'Stable' },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [16.0, 8.0, 8.0],
      [18.0, 12.0, 6.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [29.5, 19.8],
      [29.9, 20.2],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['Domestic %', 'Exports %', 'EV %'],
      [60.0, 40.0, 3.0],
      [62.0, 38.0, 5.2],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [23.8, 15.9, 39.7],
      [27.6, 16.9, 44.5],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹ Cr)', 'R&D % of Sales', 'Net Cash (₹k Cr)'],
      [620, 1.7, 13.4],
      [780, 2.0, 14.8],
      ['pct', 'pp', 'pp'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [3, 2, 'Pulsar'],
      [4, 3, 'Pulsar'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Revenue Growth %', color: '#1f2937', values: [4, 7, 13, 26, -3, 1, 21, 17, 16, 18, 12, 10] },
      { name: 'Volume Growth %',  color: '#3b82f6', values: [-1, 2, 9, 28, -10, -11, 14, 5, 8, 12, 9, 7] },
      { name: 'Realisation Growth %', color: '#10b981', values: [5, 5, 4, -2, 8, 13, 6, 11, 8, 6, 3, 3] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [28.0, 28.9, 28.4, 28.0, 28.6, 28.2, 27.4, 28.6, 29.5, 29.9, 30.2, 30.5] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [20.7, 21.2, 19.9, 16.3, 16.6, 17.7, 16.9, 18.1, 19.8, 20.2, 20.6, 21.0] },
    ]),
    Mix: series([
      { name: 'Domestic %', color: '#1f2937', values: [60, 58, 56, 56, 50, 47, 51, 58, 60, 62, 63, 63] },
      { name: 'Exports %',  color: '#3b82f6', values: [40, 42, 44, 44, 50, 53, 49, 42, 40, 38, 37, 37] },
      { name: 'EV %',       color: '#10b981', values: [0, 0, 0, 0, 0.1, 0.2, 0.4, 1.0, 3.0, 5.2, 7.0, 8.5] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [22, 20, 23, 28, 19, 18, 24, 24, 23.8, 27.6, 29, 30] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [15, 14, 17, 21, 18, 19, 22, 17, 15.9, 16.9, 18, 19] },
      { name: 'Total (L)',    color: '#10b981', values: [37, 34, 40, 49, 37, 37, 46, 41, 39.7, 44.5, 47, 49] },
    ]),
    Capital: series([
      { name: 'Capex (₹ Cr)', color: '#1f2937', values: [320, 350, 380, 410, 480, 380, 480, 580, 620, 780, 850, 900] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.5, 1.6, 1.7, 2.0, 2.2, 2.3] },
      { name: 'Net Cash (₹k Cr)', color: '#10b981', values: [10.2, 11.4, 12.0, 12.8, 13.5, 14.0, 13.2, 12.8, 13.4, 14.8, 15.6, 16.5] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [2, 2, 3, 4, 2, 2, 3, 4, 3, 4, 4, 5] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [2, 2, 2, 3, 1, 1, 2, 3, 2, 3, 3, 4] },
    ]),
  },
  governance: {
    CEO: 'Rajiv Bajaj (MD)',
    CFO: 'Dinesh Thapar',
    COO: '—',
    'Credit Rating': 'CRISIL AAA / Stable',
    'Sales Outlets': '~3,800',
    Employees: '~10,500',
  },
  governanceSource:
    'KMP per https://www.bajajauto.com/about-us/leadership · Credit rating per https://www.crisilratings.com · Dealers / employees per Bajaj Auto FY25 annual report. Last updated 14/05/2026.',
  modelSource:
    'Source: Bajaj Auto Annual Reports / Q4 FY25 Investor Presentation; SIAM (segment volumes); Bajaj monthly sales press releases.',
}

// ---------- HERO MOTOCORP ----------
const hero = {
  id: 'hero',
  name: 'Hero MotoCorp',
  dotColor: '#dc2626',
  signal: 'Neutral',
  signalNote: 'Volume leader; entry-commuter mix a drag',
  buySide: {
    rating: 'HOLD',
    confidence: 'Moderate',
    bullets: [
      'Splendor + HF Deluxe still drive ~70% of mix; entry segment slow on rural sentiment.',
      'Premium ramp via Karizma/Mavrick & Harley X440 partnership early — needs proof.',
      'Vida EV scale below plan; market share at sub-5% vs Ola/TVS/Bajaj.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Volume',         value: '57.8 L', sub: 'FY25',     delta: '+5.0%',  tone: 'pos' },
    { label: 'Market Share',   value: '28.6%',  sub: 'Domestic 2W FY25', delta: '-0.5pp', tone: 'neg' },
    { label: 'Revenue',        value: '₹40.9k Cr', sub: 'FY25',  delta: '+9.0%',  tone: 'pos' },
    { label: 'EBITDA Margin',  value: '14.8%',  sub: 'FY25',     delta: '+0.6pp', tone: 'pos' },
    { label: 'PAT',            value: '₹4,500 Cr', sub: 'FY25',  delta: '+19.0%', tone: 'pos' },
    { label: 'ROE',            value: '24.2%',  sub: 'FY25',     delta: '+2.1pp', tone: 'pos' },
  ],
  topModels: [
    { name: 'Splendor',  segment: 'Commuter',          units: '50.4 L', sub: 'FY25 units', growth: '+6.0%',  tag: 'Stable' },
    { name: 'HF Deluxe', segment: 'Entry Commuter',    units: '20.1 L', sub: 'FY25 units', growth: '-3.0%',  tag: 'Loss'   },
    { name: 'Passion',   segment: 'Commuter',          units: '6.0 L',  sub: 'FY25 units', growth: '+1.0%',  tag: 'Stable' },
    { name: 'Glamour',   segment: 'Commuter',          units: '4.0 L',  sub: 'FY25 units', growth: '+4.0%',  tag: 'Stable' },
    { name: 'Xtreme 160R',segment: 'Sports',           units: '1.5 L',  sub: 'FY25 units', growth: '+18.0%', tag: 'Gain'   },
    { name: 'Vida V1',   segment: 'Electric Scooter',  units: '0.6 L',  sub: 'FY25 units', growth: '+40.0%', tag: 'Gain'   },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [13.0, 5.0, 8.0],
      [9.0, 5.0, 4.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [29.6, 14.2],
      [30.1, 14.8],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['Entry/Commuter %', 'Premium %', 'EV %'],
      [88.0, 11.0, 1.0],
      [86.0, 13.0, 1.0],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [52.6, 2.6, 55.2],
      [55.0, 2.8, 57.8],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹ Cr)', 'R&D % of Sales', 'Net Cash (₹k Cr)'],
      [780, 2.5, 6.5],
      [900, 2.8, 7.8],
      ['pct', 'pp', 'pp'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [3, 2, 'Splendor'],
      [4, 3, 'Splendor'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Revenue Growth %', color: '#1f2937', values: [-1, 4, 12, 8, -8, 3, -1, 12, 13, 9, 8, 7] },
      { name: 'Volume Growth %',  color: '#3b82f6', values: [-1, 6, 13, 6, -16, -10, -10, 6, 5, 5, 5, 5] },
      { name: 'Realisation Growth %', color: '#10b981', values: [0, -2, -1, 2, 8, 13, 9, 6, 8, 4, 3, 2] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [30.5, 30.2, 30.0, 29.6, 29.0, 28.6, 27.0, 28.4, 29.6, 30.1, 30.4, 30.6] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [16.2, 16.6, 16.4, 14.5, 13.6, 13.0, 11.5, 13.2, 14.2, 14.8, 15.2, 15.5] },
    ]),
    Mix: series([
      { name: 'Entry/Commuter %', color: '#1f2937', values: [94, 93, 92, 92, 90, 90, 89, 89, 88, 86, 84, 82] },
      { name: 'Premium %', color: '#3b82f6', values: [6, 7, 8, 8, 10, 10, 10.5, 10.8, 11, 13, 14.5, 16] },
      { name: 'EV %',  color: '#10b981', values: [0, 0, 0, 0, 0, 0, 0.5, 0.2, 1.0, 1.0, 1.5, 2.0] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [62, 64, 73, 76, 64, 56, 49, 53, 52.6, 55.0, 57, 59] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [2, 2, 2, 3, 3, 2, 3, 3, 2.6, 2.8, 3.0, 3.2] },
      { name: 'Total (L)',    color: '#10b981', values: [64, 66, 75, 79, 67, 58, 52, 56, 55.2, 57.8, 60, 62] },
    ]),
    Capital: series([
      { name: 'Capex (₹ Cr)', color: '#1f2937', values: [400, 450, 500, 580, 620, 540, 620, 720, 780, 900, 980, 1050] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [1.6, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.8, 3.0, 3.2] },
      { name: 'Net Cash (₹k Cr)', color: '#10b981', values: [4.8, 5.2, 5.6, 6.0, 6.2, 5.8, 5.4, 6.0, 6.5, 7.8, 8.6, 9.4] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [2, 3, 3, 4, 2, 2, 3, 4, 3, 4, 5, 5] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [1, 2, 2, 3, 1, 1, 2, 3, 2, 3, 3, 4] },
    ]),
  },
  governance: {
    CEO: 'Niranjan Gupta',
    CFO: 'Vivek Anand',
    COO: '—',
    'Credit Rating': 'CRISIL AAA / Stable',
    'Sales Outlets': '~6,300',
    Employees: '~9,200',
  },
  governanceSource:
    'KMP per https://www.heromotocorp.com/en-in/about-us/leadership.html · Credit rating per https://www.crisilratings.com · Dealers / employees per Hero MotoCorp FY25 annual report. Last updated 14/05/2026.',
  modelSource:
    'Source: Hero MotoCorp Annual Reports / Q4 FY25 Investor Presentation; SIAM (segment volumes); Hero monthly sales press releases.',
}

// ---------- EICHER MOTORS / ROYAL ENFIELD ----------
const eicher = {
  id: 'eicher',
  name: 'Eicher / Royal Enfield',
  dotColor: '#b45309',
  signal: 'Positive',
  signalNote: 'Premium leadership intact; exports + 650cc upside',
  buySide: {
    rating: 'BUY',
    confidence: 'High',
    bullets: [
      'Hunter 350 sustaining new-rider acquisition; Classic 350 refresh defending core.',
      'Himalayan 450 + Guerrilla broadening 450cc platform — exports inflection from FY26.',
      'EBITDA margin at industry-best ~26%; pricing power intact.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Volume',         value: '10.2 L', sub: 'FY25',     delta: '+15.0%', tone: 'pos' },
    { label: 'Premium >250cc Share', value: '85.0%', sub: 'India >250cc FY25', delta: '+1.0pp', tone: 'pos' },
    { label: 'Revenue',        value: '₹19.1k Cr', sub: 'FY25 (RE only)', delta: '+18.0%', tone: 'pos' },
    { label: 'EBITDA Margin',  value: '26.1%',  sub: 'RE FY25',  delta: '+0.4pp', tone: 'pos' },
    { label: 'PAT',            value: '₹4,360 Cr', sub: 'FY25 (consol.)', delta: '+22.0%', tone: 'pos' },
    { label: 'ROE',            value: '23.0%',  sub: 'FY25',     delta: '+1.6pp', tone: 'pos' },
  ],
  topModels: [
    { name: 'Classic 350', segment: 'Cruiser',     units: '5.1 L',  sub: 'FY25 units', growth: '+4.0%',  tag: 'Stable' },
    { name: 'Hunter 350',  segment: 'Roadster',    units: '3.0 L',  sub: 'FY25 units', growth: '+10.0%', tag: 'Gain'   },
    { name: 'Meteor 350',  segment: 'Cruiser',     units: '1.5 L',  sub: 'FY25 units', growth: '+5.0%',  tag: 'Stable' },
    { name: 'Bullet 350',  segment: 'Cruiser',     units: '1.0 L',  sub: 'FY25 units', growth: '+2.0%',  tag: 'Stable' },
    { name: 'Himalayan 450',segment: 'Adventure',  units: '0.6 L',  sub: 'FY25 units', growth: '+90.0%', tag: 'Gain'   },
    { name: 'Continental GT 650', segment: 'Cafe Racer', units: '0.3 L', sub: 'FY25 units', growth: '+8.0%', tag: 'Stable' },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [16.0, 9.0, 7.0],
      [18.0, 15.0, 3.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [42.5, 25.7],
      [43.0, 26.1],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['350cc %', '450cc+ %', 'Exports %'],
      [82.0, 8.0, 9.0],
      [78.0, 12.0, 12.0],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [8.1, 0.8, 8.9],
      [9.0, 1.2, 10.2],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹ Cr)', 'R&D % of Sales', 'Net Cash (₹k Cr)'],
      [620, 2.6, 14.2],
      [780, 3.0, 16.0],
      ['pct', 'pp', 'pp'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [2, 2, 'Classic 350'],
      [3, 2, 'Classic 350'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Revenue Growth %', color: '#1f2937', values: [50, 28, 27, 5, -8, -2, 13, 36, 16, 18, 14, 12] },
      { name: 'Volume Growth %',  color: '#3b82f6', values: [55, 28, 22, -2, -16, -13, 10, 32, 9, 15, 12, 10] },
      { name: 'Realisation Growth %', color: '#10b981', values: [-3, 0, 4, 7, 10, 13, 3, 3, 7, 3, 2, 2] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [44.0, 44.5, 43.6, 42.0, 39.8, 38.6, 39.4, 41.8, 42.5, 43.0, 43.4, 43.7] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [30.1, 31.2, 30.5, 28.0, 24.3, 21.4, 22.8, 24.6, 25.7, 26.1, 26.4, 26.6] },
    ]),
    Mix: series([
      { name: '350cc %', color: '#1f2937', values: [88, 87, 86, 86, 84, 83, 82, 82, 82, 78, 75, 72] },
      { name: '450cc+ %', color: '#3b82f6', values: [4, 5, 6, 6, 7, 7, 7, 7, 8, 12, 15, 18] },
      { name: 'Exports %', color: '#10b981', values: [3, 4, 5, 6, 7, 8, 9, 10, 9, 12, 14, 16] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [4.8, 6.2, 7.6, 7.4, 6.2, 5.4, 6.0, 7.9, 8.1, 9.0, 9.6, 10.0] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [0.1, 0.2, 0.3, 0.5, 0.5, 0.4, 0.6, 0.9, 0.8, 1.2, 1.5, 1.8] },
      { name: 'Total (L)',    color: '#10b981', values: [4.9, 6.4, 7.9, 7.9, 6.7, 5.8, 6.6, 8.8, 8.9, 10.2, 11.1, 11.8] },
    ]),
    Capital: series([
      { name: 'Capex (₹ Cr)', color: '#1f2937', values: [220, 320, 380, 460, 480, 380, 460, 540, 620, 780, 880, 940] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [1.4, 1.6, 1.8, 2.0, 2.2, 2.3, 2.4, 2.5, 2.6, 3.0, 3.2, 3.4] },
      { name: 'Net Cash (₹k Cr)', color: '#10b981', values: [4.8, 6.4, 8.2, 9.6, 10.4, 11.0, 11.8, 12.6, 14.2, 16.0, 17.6, 19.2] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [1, 1, 2, 2, 1, 1, 2, 3, 2, 3, 3, 4] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 3, 3] },
    ]),
  },
  governance: {
    CEO: 'Siddhartha Lal (MD, Eicher)',
    CFO: 'Vinod Aggarwal',
    COO: 'B. Govindarajan (CEO, RE)',
    'Credit Rating': 'CRISIL AAA / Stable',
    'Sales Outlets': '~2,200',
    Employees: '~3,800',
  },
  governanceSource:
    'KMP per https://www.eichermotors.com/management · Credit rating per https://www.crisilratings.com · Dealers / employees per Eicher FY25 annual report. Last updated 14/05/2026.',
  modelSource:
    'Source: Eicher Motors Annual Reports / Q4 FY25 Investor Presentation; SIAM (>250cc segment); Royal Enfield monthly sales press releases.',
}

// ---------- OLA ELECTRIC ----------
const ola = {
  id: 'ola',
  name: 'Ola Electric',
  dotColor: '#16a34a',
  signal: 'Negative',
  signalNote: 'Share loss + margin pressure post FAME-II reset',
  buySide: {
    rating: 'SELL',
    confidence: 'Moderate',
    bullets: [
      'Market share down to ~28% (FY25) vs ~38% (FY24) — TVS/Bajaj catching up.',
      'Service complaints + warranty pressure weighing on EBITDA; cash burn elevated.',
      'Roadster motorcycle launch & cell manufacturing remain key catalysts; execution risk high.',
    ],
  },
  updated: '11 May 2026',
  dataFresh: 'Fresh',
  kpis: [
    { label: 'Volume',         value: '4.2 L',  sub: 'FY25',     delta: '+24.0%', tone: 'pos' },
    { label: 'E-2W Market Share', value: '28.0%', sub: 'India e-2W FY25', delta: '-10.0pp', tone: 'neg' },
    { label: 'Revenue',        value: '₹6,100 Cr', sub: 'FY25',  delta: '+19.0%', tone: 'pos' },
    { label: 'EBITDA Margin',  value: '-22.0%',  sub: 'FY25',    delta: '-5.0pp', tone: 'neg' },
    { label: 'PAT',            value: '-₹1,580 Cr', sub: 'FY25', delta: 'Wider',  tone: 'neg' },
    { label: 'Cash & Eq.',     value: '₹3,600 Cr', sub: 'Mar-26', delta: '-22.0%', tone: 'neg' },
  ],
  topModels: [
    { name: 'S1 Pro',     segment: 'Electric Scooter', units: '1.5 L',  sub: 'FY25 units', growth: '-12.0%', tag: 'Loss'   },
    { name: 'S1 Air',     segment: 'Electric Scooter', units: '1.0 L',  sub: 'FY25 units', growth: '+18.0%', tag: 'Gain'   },
    { name: 'S1 X+',      segment: 'Electric Scooter', units: '0.7 L',  sub: 'FY25 units', growth: '+26.0%', tag: 'Gain'   },
    { name: 'S1 X (3kWh)',segment: 'Electric Scooter', units: '0.5 L',  sub: 'FY25 units', growth: '+35.0%', tag: 'Gain'   },
    { name: 'S1 X (2kWh)',segment: 'Electric Scooter', units: '0.4 L',  sub: 'FY25 units', growth: '+22.0%', tag: 'Gain'   },
    { name: 'Roadster',   segment: 'Electric Motorcycle', units: '0.05 L', sub: 'FY25 units', growth: 'New', tag: 'Gain' },
  ],
  supportingData: {
    Growth: buildBlock(
      ['Revenue Growth %', 'Volume Growth %', 'Realisation Growth %'],
      [88.0, 110.0, -10.5],
      [19.0, 24.0, -4.0],
      ['pp', 'pp', 'pp'],
    ),
    Margins: buildBlock(
      ['Gross Margin %', 'EBITDA Margin %'],
      [16.5, -17.0],
      [18.4, -22.0],
      ['pp', 'pp'],
    ),
    Mix: buildBlock(
      ['Premium S1 Pro/Air %', 'Mass S1 X %', 'Motorcycle %'],
      [78.0, 22.0, 0.0],
      [60.0, 39.0, 1.0],
      ['pp', 'pp', 'pp'],
    ),
    Scale: buildBlock(
      ['Domestic (L)', 'Exports (L)', 'Total (L)'],
      [3.4, 0.0, 3.4],
      [4.2, 0.0, 4.2],
      ['pct', 'pct', 'pct'],
    ),
    Capital: buildBlock(
      ['Capex (₹ Cr)', 'R&D % of Sales', 'Cash Burn (₹ Cr)'],
      [1080, 12.0, 1900],
      [1450, 14.0, 1580],
      ['pct', 'pp', 'pct'],
    ),
    'Product Facts': buildBlock(
      ['New Model Launches', 'Facelift Launches', 'Top Selling Model'],
      [3, 1, 'S1 Pro'],
      [2, 2, 'S1 Pro'],
      ['abs', 'abs', 'abs'],
    ),
  },
  charts: {
    Growth: series([
      { name: 'Revenue Growth %', color: '#1f2937', values: [null, null, null, null, null, null, 350, 510, 88, 19, 22, 18] },
      { name: 'Volume Growth %',  color: '#3b82f6', values: [null, null, null, null, null, null, 600, 460, 110, 24, 28, 22] },
      { name: 'Realisation Growth %', color: '#10b981', values: [null, null, null, null, null, null, -36, 9, -10, -4, -5, -3] },
    ]),
    Margins: series([
      { name: 'Gross Margin %', color: '#1f2937', values: [null, null, null, null, null, null, 8.0, 12.0, 16.5, 18.4, 22.0, 25.0] },
      { name: 'EBITDA Margin %', color: '#3b82f6', values: [null, null, null, null, null, null, -90.0, -38.0, -17.0, -22.0, -12.0, -4.0] },
    ]),
    Mix: series([
      { name: 'Premium S1 Pro/Air %', color: '#1f2937', values: [null, null, null, null, null, null, 100, 92, 78, 60, 50, 45] },
      { name: 'Mass S1 X %', color: '#3b82f6', values: [null, null, null, null, null, null, 0, 8, 22, 39, 45, 48] },
      { name: 'Motorcycle %', color: '#10b981', values: [null, null, null, null, null, null, 0, 0, 0, 1, 5, 7] },
    ]),
    Scale: series([
      { name: 'Domestic (L)', color: '#1f2937', values: [null, null, null, null, null, null, 0.2, 1.5, 3.4, 4.2, 5.4, 6.6] },
      { name: 'Exports (L)',  color: '#3b82f6', values: [null, null, null, null, null, null, 0, 0, 0, 0, 0.1, 0.3] },
      { name: 'Total (L)',    color: '#10b981', values: [null, null, null, null, null, null, 0.2, 1.5, 3.4, 4.2, 5.5, 6.9] },
    ]),
    Capital: series([
      { name: 'Capex (₹ Cr)', color: '#1f2937', values: [null, null, null, null, null, 480, 920, 1240, 1080, 1450, 1600, 1700] },
      { name: 'R&D % of Sales', color: '#3b82f6', values: [null, null, null, null, null, null, 25, 18, 12, 14, 12, 10] },
      { name: 'Cash Burn (₹ Cr)', color: '#10b981', values: [null, null, null, null, null, null, 1400, 2400, 1900, 1580, 1100, 600] },
    ]),
    'Product Facts': series([
      { name: 'New Model Launches', color: '#1f2937', values: [null, null, null, null, null, null, 1, 2, 3, 2, 2, 2] },
      { name: 'Facelift Launches',  color: '#3b82f6', values: [null, null, null, null, null, null, 0, 1, 1, 2, 2, 2] },
    ]),
  },
  governance: {
    CEO: 'Bhavish Aggarwal',
    CFO: 'Harish Abichandani',
    COO: '—',
    'Credit Rating': 'CRISIL A / Negative',
    'Sales Outlets': '~770 stores',
    Employees: '~4,000',
  },
  governanceSource:
    'KMP per https://www.olaelectric.com/about-us · Credit rating per https://www.crisilratings.com · Stores / employees per Ola Electric FY25 annual report. Last updated 14/05/2026.',
  modelSource:
    'Source: Ola Electric Annual Report / Q4 FY25 Investor Presentation; Vahan dashboard (registrations); company monthly disclosures.',
}

export const FY = FY_AXIS

export const COMPANIES = [industry, tvs, bajaj, hero, eicher, ola]

export const SUPPORT_BLOCKS = ['Growth', 'Margins', 'Mix', 'Scale', 'Capital', 'Product Facts']

export const SECTOR_META = {
  title: '2W Industry Dashboard',
  subtitle: 'Buy-side research view · switch segment',
  badge: '2W',
  latestFy: 'FY25',
  footer:
    'Buy-side research view · Sources: NSE / BSE filings · SIAM monthly bulletins · Annual reports · Quarterly results · Investor presentations',
}
