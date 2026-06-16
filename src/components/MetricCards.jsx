function MetricCards({ metrics }) {
  function getStatus(facility, national) {
    if (!facility || !national) return 'neutral'
    return parseFloat(facility) < parseFloat(national) ? 'better' : 'worse'
  }

  function getDiff(facility, national, unit) {
    if (!facility || !national) return null
    const diff = parseFloat(facility) - parseFloat(national)
    const sign = diff > 0 ? '+' : ''
    return `${sign}${diff.toFixed(2)}${unit} vs national`
  }

  const shortLabel = {
    'Short Term Hospitalization': 'STR Hospitalization',
    'STR ED Visit': 'STR ED Visit',
    'LT Hospitalization': 'LT Hospitalization',
    'LT ED Visit': 'LT ED Visit',
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      padding: '24px 28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#94A3B8',
        }}>
          Performance at a Glance
        </span>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        <span style={{
          fontSize: '10px',
          color: '#94A3B8',
          fontWeight: '500',
        }}>
          vs. National Average
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {metrics.map(m => {
          const status = getStatus(m.facility, m.national)
          const diff = getDiff(m.facility, m.national, m.unit)
          const label = shortLabel[m.label] || m.label

          const colors = {
            better: {
              border: '#10B981',
              bg: 'linear-gradient(145deg, #F0FDF4, #DCFCE7)',
              badge: { bg: '#DCFCE7', color: '#15803D' },
              indicator: '▼ Below',
              indicatorColor: '#15803D',
            },
            worse: {
              border: '#EF4444',
              bg: 'linear-gradient(145deg, #FFF1F2, #FFE4E6)',
              badge: { bg: '#FFE4E6', color: '#DC2626' },
              indicator: '▲ Above',
              indicatorColor: '#DC2626',
            },
            neutral: {
              border: '#CBD5E1',
              bg: 'linear-gradient(145deg, #F8FAFC, #F1F5F9)',
              badge: { bg: '#F1F5F9', color: '#64748B' },
              indicator: '— N/A',
              indicatorColor: '#94A3B8',
            },
          }

          const c = colors[status]

          return (
            <div key={m.label} style={{
              borderLeft: `3px solid ${c.border}`,
              background: c.bg,
              borderRadius: '10px',
              padding: '16px',
              border: `1px solid ${c.border}22`,
              borderLeftWidth: '3px',
              borderLeftColor: c.border,
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minHeight: '160px',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                lineHeight: '1.3',
              }}>
                {label}
              </div>

              <div style={{
                fontSize: '26px',
                fontWeight: '800',
                color: '#0F172A',
                lineHeight: '1',
                marginTop: '2px',
              }}>
                {m.facility
                  ? `${parseFloat(m.facility).toFixed(2)}${m.unit}`
                  : '—'}
              </div>

              {diff && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: c.badge.bg,
                  color: c.badge.color,
                  width: 'fit-content',
                }}>
                  {diff}
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px' }}>
                  Nat. {m.national ? `${parseFloat(m.national).toFixed(2)}${m.unit}` : '—'}
                  &nbsp;·&nbsp;
                  State {m.state ? `${parseFloat(m.state).toFixed(2)}${m.unit}` : '—'}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: c.indicatorColor,
                }}>
                  {c.indicator} National Avg
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricCards