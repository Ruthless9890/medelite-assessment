import { useState } from 'react'

function ManualInputs({ values, onChange }) {
  function handle(field, value) {
    onChange({ ...values, [field]: value })
  }

  return (
    <div className="manual-panel">
      <h2>Operational Details</h2>
      <div className="manual-grid">

        <div className="field-group">
          <label>EMR System</label>
          <input
            type="text"
            placeholder="e.g. PCC, MatrixCare"
            value={values.emr}
            onChange={e => handle('emr', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Current Census</label>
          <input
            type="number"
            placeholder="e.g. 112"
            value={values.census}
            onChange={e => handle('census', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Type of Patient</label>
          <input
            type="text"
            placeholder="e.g. Long-term & Short-term"
            value={values.patientType}
            onChange={e => handle('patientType', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Previous Coverage from Medelite</label>
          <select
            value={values.prevCoverage}
            onChange={e => handle('prevCoverage', e.target.value)}
          >
            <option value="">— Select —</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="field-group">
          <label>Previous Provider Performance</label>
          <input
            type="text"
            placeholder="e.g. About 30 patients/day"
            value={values.prevPerf}
            onChange={e => handle('prevPerf', e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Medical Coverage</label>
          <input
            type="text"
            placeholder="e.g. Optometry, PCP, Podiatry"
            value={values.medCoverage}
            onChange={e => handle('medCoverage', e.target.value)}
          />
        </div>

      </div>
    </div>
  )
}

export default ManualInputs