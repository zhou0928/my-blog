export default async function handler(req, res) {
  const { url } = req.query

  const UMAMI_TOKEN = process.env.UMAMI_TOKEN
  const UMAMI_WEBSITE_ID = '38552e62-796d-44dd-ba7b-9685dd57c1dd'

  if (!UMAMI_TOKEN) {
    return res.status(500).json({ error: 'UMAMI_TOKEN not set' })
  }

  try {
    const start = Date.now() - 365 * 24 * 60 * 60 * 1000
    const end = Date.now()

    const apiRes = await fetch(
      `https://analytics.umami.is/api/websites/${UMAMI_WEBSITE_ID}/pageviews?start_at=${start}&end_at=${end}${url ? `&url=${encodeURIComponent(url)}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${UMAMI_TOKEN}`,
        },
      }
    )

    const data = await apiRes.json()

    // 汇总所有 pageview 记录
    if (Array.isArray(data.pageviews)) {
      const total = data.pageviews.reduce((sum, p) => sum + (p.y || 0), 0)
      return res.status(200).json({ views: total })
    }

    return res.status(200).json({ views: 0 })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
