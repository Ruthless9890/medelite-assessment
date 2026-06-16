import { useState } from 'react'

function SearchPanel({ onSearch, loading }) {
  const [ccn, setCcn] = useState('')
  const [nameOverride, setNameOverride] = useState('')
  const [validationError, setValidationError] = useState(null)

  function validateCCN(value) {
    if (!value.trim()) return 'Please enter a CCN'
    if (!/^\d+$/.test(value.trim())) return 'CCN must contain numbers only'
    if (value.trim().length !== 6) return 'CCN must be exactly 6 digits'
    return null
  }

  function handleSearch() {
    const error = validateCCN(ccn)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    onSearch(ccn.trim(), nameOverride.trim())
  }

  function handleCCNChange(e) {
    const val = e.target.value
    setCcn(val)
    if (validationError) setValidationError(validateCCN(val))
  }

  return (
    <div className="search-panel">
      <h2>Facility Lookup</h2>
      <div className="search-row">

        <div className="field-group">
          <label>CCN (CMS Certification Number)</label>
          <input
            type="text"
            placeholder="e.g. 686123"
            value={ccn}
            onChange={handleCCNChange}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSearch()}
            maxLength={6}
            className="ccn-input"
            style={validationError ? { borderColor: '#EF4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' } : {}}
          />
          {validationError && (
            <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', fontWeight: '600' }}>
              ⚠ {validationError}
            </span>
          )}
        </div>

        <div className="field-group grow">
          <label>Facility Name Override (optional)</label>
          <input
            type="text"
            placeholder="Leave blank to use official CMS name"
            value={nameOverride}
            onChange={e => setNameOverride(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? '⏳ Fetching...' : '→ Fetch Facility Data'}
        </button>

      </div>
    </div>
  )
}

export default SearchPanel