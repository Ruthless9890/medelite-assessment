import { useState } from 'react'
import { useCMS } from './hooks/useCMS'
import SearchPanel from './components/SearchPanel'
import ManualInputs from './components/ManualInputs'
import ReportView from './components/ReportView'

function App() {
  const { facility, claims, stateAvgs, loading, error, fetchFacility } = useCMS()

  const [manualInputs, setManualInputs] = useState({
    emr: '',
    census: '',
    patientType: '',
    prevCoverage: '',
    prevPerf: '',
    medCoverage: ''
  })

  const [currentCCN, setCurrentCCN] = useState('')
  const [nameOverride, setNameOverride] = useState('')

  function handleSearch(ccn, name) {
    setCurrentCCN(ccn)
    setNameOverride(name)
    // Reset manual inputs on new search
    setManualInputs({
      emr: '',
      census: '',
      patientType: '',
      prevCoverage: '',
      prevPerf: '',
      medCoverage: ''
    })
    fetchFacility(ccn)
  }

  function getFriendlyError(err) {
    if (!err) return null
    if (err.includes('No facility found')) return `No facility found for CCN "${currentCCN}". Please check the number and try again.`
    if (err.includes('403')) return 'Access denied by CMS API. Please try again in a moment.'
    if (err.includes('404')) return 'CMS API endpoint not found. Please try again later.'
    if (err.includes('408')) return 'Request timed out. Please check your connection and try again.'
    if (err.includes('500')) return 'CMS server error. Please try again in a few minutes.'
    if (err.includes('Failed to fetch')) return 'Network error. Please check your internet connection and try again.'
    return `Something went wrong: ${err}`
  }

  const friendlyError = getFriendlyError(error)

  return (
    <div className="app">

      <header className="app-header">
        <div className="header-inner">
          <div className="brand-lockup">
            <div className="brand-name">INFINITE — Managed by MEDELITE</div>
            <div className="brand-sub">Facility Intelligence Platform</div>
          </div>
          <div className="header-badge">Assessment Tool</div>
        </div>
      </header>

      <main className="main">

        <SearchPanel onSearch={handleSearch} loading={loading} />

        {/* FRIENDLY ERROR */}
        {friendlyError && !loading && (
          <div className="status-bar status-error">
            <span>⚠</span>
            <div>
              <div style={{ fontWeight: '600' }}>{friendlyError}</div>
              <div style={{ fontSize: '11px', marginTop: '3px', opacity: 0.8 }}>
                Tip: CCNs are 6-digit numbers. Example: 686123
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="status-bar status-loading">
            <div className="spinner" />
            Fetching facility data from CMS...
          </div>
        )}

        {/* MANUAL INPUTS */}
        {facility && !loading && (
          <ManualInputs
            values={manualInputs}
            onChange={setManualInputs}
          />
        )}

        {/* REPORT */}
        {facility && !loading && (
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

      <footer className="app-footer">
        INFINITE — Managed by MEDELITE · Facility Assessment Report Generator · Data sourced from CMS Provider Data Catalog
      </footer>

    </div>
  )
}

export default App