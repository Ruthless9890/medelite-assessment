import { useState } from 'react'
import { useCMS } from './hooks/useCMS'
import SearchPanel from './components/SearchPanel'
import ManualInputs from './components/ManualInputs'
import ReportView from './components/ReportView'

function App() {
  // CMS data from our custom hook
  const { facility, claims, stateAvgs, loading, error, fetchFacility } = useCMS()

  // Manual inputs state — one object holds all fields
  const [manualInputs, setManualInputs] = useState({
    emr: '',
    census: '',
    patientType: '',
    prevCoverage: '',
    prevPerf: '',
    medCoverage: ''
  })

  // Track the CCN and name override separately
  const [currentCCN, setCurrentCCN] = useState('')
  const [nameOverride, setNameOverride] = useState('')

  // This runs when user clicks "Fetch Facility Data"
  function handleSearch(ccn, name) {
    setCurrentCCN(ccn)
    setNameOverride(name)
    fetchFacility(ccn)
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-lockup">
            <div className="brand-name">INFINITE — Managed by MEDELITE</div>
            <div className="brand-sub">Facility Intelligence Platform</div>
          </div>
          <div className="header-badge">Assessment Tool</div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* STEP 1 — always visible */}
        <SearchPanel onSearch={handleSearch} loading={loading} />

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-bar">
            ⚠ {error}
          </div>
        )}

        {/* LOADING MESSAGE */}
        {loading && (
          <div className="loading-bar">
            ⏳ Fetching facility data from CMS...
          </div>
        )}

        {/* STEP 2 — only shows after facility is loaded */}
        {facility && (
          <ManualInputs
            values={manualInputs}
            onChange={setManualInputs}
          />
        )}

        {/* STEP 3 — report, only shows after facility is loaded */}
        {facility && (
          <ReportView
            facility={facility}
            claims={claims}
            stateAvgs={stateAvgs}
            manualInputs={manualInputs}
            nameOverride={nameOverride}
            ccn={currentCCN}
          />
        )}

      </main>

      <footer>
        INFINITE — Managed by MEDELITE · Facility Assessment Report Generator · Data sourced from CMS Provider Data Catalog
      </footer>

    </div>
  )
}

export default App