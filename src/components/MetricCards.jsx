function MetricCards({ metrics }) {
  function getStatus(facility, national, lowerIsBetter = true) {
    if (!facility || !national) return 'neutral'
    const f = parseFloat(facility)
    const n = parseFloat(national)
    if (lowerIsBetter) return f < n ? 'better' : 'worse'
    return f > n ? 'better' : 'worse'
  }

  function getDiff(facility, national, unit) {
    if (!facility || !national) return null
    const diff = parseFloat(facility) - parseFloat(national)
    const sign = diff > 0 ? '+' : ''
    return `${sign}${diff.toFixed(2)}${unit} vs national`
  }

  const statusStyles = {
    better: {
      card: { borderLeft: '4px solid #10B981', background: '#F0FDF4' },
      badge: { background: '#DCFCE7', color: '#15803D' },
      label: 'Below National Avg ✓'
    },
    worse: {
      card: { borderLeft: '4px solid #EF4444', background: '#FFF1F2' },
      badge: { background: '#FFE4E6', color: '#DC2626' },
      label: 'Above National Avg !'
    },
    neutral: {
      card: { borderLeft: '4px solid #94A3B8', background: '#F8FAFC' },
      badge: { background: '#F1F5F9', color: '#64748B' },
      label: 'No Data'
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#64748B',
        marginBottom: '16px',
        paddingBottom: '10px',
        borderBottom: '1px solid #E2E8F0'
      }}>
        Performance at a Glance
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {metrics.map(m => {
          const status = getStatus(m.facility, m.national)
          const styles = statusStyles[status]
          const diff = getDiff(m.facility, m.national, m.unit)

          return (
            <div key={m.label} style={{
              ...styles.card,
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid #E2E8F0',
              ...styles.card
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '8px'
              }}>
                {m.label}
              </div>

              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#0F172A',
                marginBottom: '4px'
              }}>
                {m.facility
                  ? `${parseFloat(m.facility).toFixed(2)}${m.unit}`
                  : '—'}
              </div>

              {diff && (
                <div style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '700',
                  marginBottom: '6px',
                  ...styles.badge
                }}>
                  {diff}
                </div>
              )}

              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                National: {m.national ? `${parseFloat(m.national).toFixed(2)}${m.unit}` : '—'}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                State: {m.state ? `${parseFloat(m.state).toFixed(2)}${m.unit}` : '—'}
              </div>

              <div style={{
                marginTop: '8px',
                fontSize: '10px',
                fontWeight: '700',
                ...styles.badge,
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {styles.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricCards