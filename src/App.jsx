import React, { useMemo, useState } from 'react'
import { COMPANIES, FY } from './data.js'
import { exportCompanyCsv } from './export.js'
import Header from './components/Header.jsx'
import KpiCards from './components/KpiCards.jsx'
import SignalBox from './components/SignalBox.jsx'
import ModelCards from './components/ModelCards.jsx'
import SupportingData from './components/SupportingData.jsx'
import Governance from './components/Governance.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [activeId, setActiveId] = useState('industry')
  const company = useMemo(
    () => COMPANIES.find((c) => c.id === activeId) || COMPANIES[0],
    [activeId],
  )

  return (
    <div className="min-h-full pb-10">
      <Header
        company={company}
        companies={COMPANIES}
        onSelectCompany={setActiveId}
        onExport={() => exportCompanyCsv(company, FY)}
      />
      <main className="max-w-[1480px] mx-auto px-6 mt-6 space-y-6">
        <KpiCards kpis={company.kpis} />
        <SignalBox company={company} />
        <ModelCards models={company.topModels} />
        <SupportingData company={company} />
        <Governance company={company} />
        <Footer />
      </main>
    </div>
  )
}
