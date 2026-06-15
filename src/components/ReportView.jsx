import StarRating from './StarRating'
import { jsPDF } from 'jspdf'

function ReportView({ facility, claims, stateAvgs, manualInputs, nameOverride, ccn }) {

  const displayName = nameOverride || facility.provider_name
  const state = facility.state || ''
  const medUrl = `https://www.medicare.gov/care-compare/details/nursing-home/${ccn}`

  function downloadPDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    const W = 612
    let y = 0

    // --- HEADER ---
    doc.setFillColor(26, 26, 46)
    doc.rect(0, 0, W, 95, 'F')
    doc.setFillColor(192, 38, 211)
    doc.rect(0, 92, W, 3, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text('MANAGED BY MEDELITE', 36, 20)

    doc.setFont('times', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(255, 255, 255)
    doc.text('INFINITE', 36, 50)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(220, 220, 220)
    doc.text('FACILITY ASSESSMENT SNAPSHOT', 36, 72)

    doc.setFontSize(8)
    doc.setTextColor(217, 70, 239)
    doc.text(state, 36 + doc.getTextWidth('FACILITY ASSESSMENT SNAPSHOT') + 14, 72)

    y = 110

    // --- TABLE HELPERS ---
    const col1 = 36
    const col2 = 260
    const tableW = W - 72
    const rowH = 22

    function drawRow(label, value, even) {
      if (even) {
        doc.setFillColor(248, 250, 252)
        doc.rect(col1, y, tableW, rowH, 'F')
      }
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(col1, y + rowH, col1 + tableW, y + rowH)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(71, 85, 105)
      doc.text(String(label), col1 + 8, y + 14)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(15, 23, 42)
      doc.text(String(value || '—'), col2 + 4, y + 14)
      y += rowH
    }

    function drawSectionTitle(title) {
      doc.setFillColor(241, 245, 249)
      doc.rect(col1, y, tableW, 18, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(148, 163, 184)
      doc.text(title.toUpperCase(), col1 + 6, y + 12)
      y += 18
    }

    function drawStarRow(label, rating, even) {
        if (even) {
            doc.setFillColor(248, 250, 252)
            doc.rect(col1, y, tableW, rowH, 'F')
        }
        doc.setDrawColor(226, 232, 240)
        doc.setLineWidth(0.3)
        doc.line(col1, y + rowH, col1 + tableW, y + rowH)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8.5)
        doc.setTextColor(71, 85, 105)
        doc.text(String(label), col1 + 8, y + 14)

        const r = parseInt(rating) || 0
        for (let i = 1; i <= 5; i++) {
            doc.setFillColor(...(i <= r ? [245, 158, 11] : [209, 213, 219]))
            doc.roundedRect(col2 + 4 + (i - 1) * 16, y + 6, 10, 10, 2, 2, 'F')
        }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(100, 116, 139)
        doc.text(`${r}/5`, col2 + 90, y + 14)
        y += rowH
    }

    // --- SECTIONS ---
    drawSectionTitle('Facility Information')
    const address = [facility.provider_address, facility.citytown, facility.state, facility.zip_code].filter(Boolean).join(', ')
    ;[
      ['Name of Facility', displayName],
      ['Location', address],
      ['EMR', manualInputs.emr || '—'],
      ['Census Capacity', facility.number_of_certified_beds || '—'],
      ['Current Census', manualInputs.census || '—'],
      ['Type of Patient', manualInputs.patientType || '—'],
    ].forEach(([l, v], i) => drawRow(l, v, i % 2 === 1))

    drawSectionTitle('Medelite History')
    ;[
      ['Previous Coverage from Medelite', manualInputs.prevCoverage || '—'],
      ['Previous Provider Performance', manualInputs.prevPerf || '—'],
      ['Medical Coverage', manualInputs.medCoverage || '—'],
    ].forEach(([l, v], i) => drawRow(l, v, i % 2 === 1))

    drawSectionTitle('CMS Star Ratings')
    ;[
      ['Overall Star Rating', facility.overall_rating],
      ['Health Inspection', facility.health_inspection_rating],
      ['Staffing', facility.staffing_rating],
      ['Quality of Resident Care', facility.qm_rating],
    ].forEach(([l, v], i) => drawStarRow(l, v, i % 2 === 1))

    // --- FOOTER WITH HYPERLINK ---
    const footerY = 730
    doc.setFillColor(248, 250, 252)
    doc.rect(0, footerY - 10, W, 80, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.line(0, footerY - 10, W, footerY - 10)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(148, 163, 184)
    doc.text('Data sourced from CMS Provider Data Catalog  |  INFINITE — Managed by MEDELITE', 36, footerY + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(14, 165, 233)
    doc.textWithLink('View Full Profile on Medicare Care Compare', 36, footerY + 22, { url: medUrl })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text(medUrl, 36, footerY + 35)

    // --- SAVE ---
    const safeName = displayName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    doc.save(`Medelite_Assessment_${safeName}_${ccn}.pdf`)
  }

  return (
    <div className="results">

      <div className="export-bar">
        <button className="btn-export" onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
        <a href={medUrl} target="_blank" rel="noreferrer" className="medicare-link">
          View on Medicare Care Compare →
        </a>
      </div>

      <div className="report-card">

        <div className="report-header">
          <div className="rh-sub">MANAGED BY MEDELITE</div>
          <div className="rh-title">INFINITE</div>
          <div className="rh-snapshot">FACILITY ASSESSMENT SNAPSHOT <span className="rh-state">{state}</span></div>
        </div>

        <table className="report-table">
          <tbody>
            <tr className="section-title"><td colSpan={2}>Facility Information</td></tr>
            <tr><td>Name of Facility</td><td>{displayName}</td></tr>
            <tr><td>Location</td><td>{[facility.provider_address, facility.citytown, facility.state, facility.zip_code].filter(Boolean).join(', ')}</td></tr>
            <tr><td>EMR</td><td>{manualInputs.emr || '—'}</td></tr>
            <tr><td>Census Capacity</td><td>{facility.number_of_certified_beds || '—'}</td></tr>
            <tr><td>Current Census</td><td>{manualInputs.census || '—'}</td></tr>
            <tr><td>Type of Patient</td><td>{manualInputs.patientType || '—'}</td></tr>

            <tr className="section-title"><td colSpan={2}>Medelite History</td></tr>
            <tr><td>Previous Coverage from Medelite</td><td>{manualInputs.prevCoverage || '—'}</td></tr>
            <tr><td>Previous Provider Performance</td><td>{manualInputs.prevPerf || '—'}</td></tr>
            <tr><td>Medical Coverage</td><td>{manualInputs.medCoverage || '—'}</td></tr>

            <tr className="section-title"><td colSpan={2}>CMS Star Ratings</td></tr>
            <tr><td>Overall Star Rating</td><td><StarRating rating={parseInt(facility.overall_rating)} /></td></tr>
            <tr><td>Health Inspection</td><td><StarRating rating={parseInt(facility.health_inspection_rating)} /></td></tr>
            <tr><td>Staffing</td><td><StarRating rating={parseInt(facility.staffing_rating)} /></td></tr>
            <tr><td>Quality of Resident Care</td><td><StarRating rating={parseInt(facility.qm_rating)} /></td></tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ReportView