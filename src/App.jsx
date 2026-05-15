import React, { useMemo, useState } from 'react'
import { COMPANIES, FY } from './data.js'
import { exportCompanyCsv } from './export.js'
import Header from './components/Header.jsx'
import HeroCard from './components/HeroCard.jsx'
import DataQualityPanel from './components/DataQualityPanel.jsx'
import KpiCards from './components/KpiCards.jsx'
import PerformanceSection from './components/PerformanceSection.jsx'
import ProductDrivers from './components/ProductDrivers.jsx'
import SupportingData from './components/SupportingData.jsx'
import SourcesPanel from './components/SourcesPanel.jsx'
import KpiModal from './components/KpiModal.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [activeId, setActiveId] = useState('tvs')
  const [modalKpi, setModalKpi] = useState(null)

  const company = useMemo(
    () => COMPANIES.find((c) => c.id === activeId) || COMPANIES[0],
    [activeId],
  )

  return (
    <div className="min-h-full relative">
      <div className="watermark" aria-hidden="true" />
      <Header
        company={company}
        companies={COMPANIES}
        onSelectCompany={setActiveId}
        onExport={() => exportCompanyCsv(company, FY)}
      />
      <main className="max-w-[1400px] mx-auto px-6 py-7 space-y-7 relative">
        <HeroCard company={company} />
        <DataQualityPanel company={company} />
        <KpiCards kpis={company.kpis} onKpiClick={setModalKpi} />
        <PerformanceSection company={company} />
        <ProductDrivers drivers={company.productDrivers} />
        <SupportingData company={company} />
        <SourcesPanel company={company} />
        <Footer />
      </main>
      <KpiModal open={!!modalKpi} kpi={modalKpi} company={company} onClose={() => setModalKpi(null)} />
    </div>
  )
}
