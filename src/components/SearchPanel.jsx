import { useState } from 'react'

function SearchPanel({ onSearch, loading }) {
  const [ccn, setCcn] = useState('')
  const [nameOverride, setNameOverride] = useState('')

  function handleSearch() {
    if (!ccn.trim()) {
      alert('Please enter a CCN')
      return
    }
    onSearch(ccn.trim(), nameOverride.trim())
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
            onChange={e => setCcn(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="field-group">
          <label>Facility Name Override (optional)</label>
          <input
            type="text"
            placeholder="Leave blank to use official CMS name"
            value={nameOverride}
            onChange={e => setNameOverride(e.target.value)}
          />
        </div>

        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Facility Data'}
        </button>

      </div>
    </div>
  )
}

export default SearchPanel