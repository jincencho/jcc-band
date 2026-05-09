
export default async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'KV configuration missing' });
  }

  const key = 'jcc_blocked_times_v2';

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${kvUrl}/get/${key}`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      const data = await response.json();
      const value = data.result ? JSON.parse(data.result) : {};
      return res.status(200).json(value);
    } catch (error) {
      console.error('KV Get Error:', error);
      return res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const response = await fetch(`${kvUrl}/set/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}` },
        body: JSON.stringify(JSON.stringify(body)) // Redis SET value must be a string
      });
      const data = await response.json();
      if (data.result === 'OK') {
        return res.status(200).json({ success: true });
      } else {
        throw new Error('KV Set Failed');
      }
    } catch (error) {
      console.error('KV Set Error:', error);
      return res.status(500).json({ error: 'Failed to save schedule' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
