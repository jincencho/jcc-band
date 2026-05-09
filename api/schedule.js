
export default async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'KV configuration missing' });
  }

  const key = 'jcc_blocked_times_v2';

  if (req.method === 'GET') {
    try {
      const response = await fetch(kvUrl, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['GET', key])
      });
      const data = await response.json();
      
      let value = {};
      if (data.result) {
        try {
          // data.result is the string we stored
          value = JSON.parse(data.result);
          // Failsafe: if it's still a string, parse again
          if (typeof value === 'string') {
            value = JSON.parse(value);
          }
        } catch (e) {
          console.error('Parse error:', e);
          value = {};
        }
      }
      return res.status(200).json(value);
    } catch (error) {
      console.error('KV GET Error:', error);
      return res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const response = await fetch(kvUrl, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', key, JSON.stringify(body)])
      });
      const data = await response.json();
      if (data.result === 'OK') {
        return res.status(200).json({ success: true });
      } else {
        throw new Error(data.error || 'KV Set Failed');
      }
    } catch (error) {
      console.error('KV POST Error:', error);
      return res.status(500).json({ error: 'Failed to save schedule' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
