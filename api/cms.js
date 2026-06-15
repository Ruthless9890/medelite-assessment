export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url parameter' })

  try {
    const response = await fetch(decodeURIComponent(url))
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}