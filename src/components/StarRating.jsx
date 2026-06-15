function StarRating({ rating }) {
  const stars = [1, 2, 3, 4, 5]
  const numRating = parseInt(rating) || 0

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {stars.map(i => (
        <span
          key={i}
          style={{ color: i <= numRating ? '#F59E0B' : '#D1D5DB', fontSize: '18px' }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: '6px', color: '#64748B', fontSize: '13px' }}>
        {numRating}/5
      </span>
    </div>
  )
}

export default StarRating