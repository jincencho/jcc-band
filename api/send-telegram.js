
export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram configuration missing on server' });
  }

  const contentType = req.headers['content-type'] || '';
  
  try {
    if (contentType.includes('application/json')) {
      // Handle Text Only
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: body.message,
          parse_mode: 'Markdown'
        })
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } 
    
    if (contentType.includes('multipart/form-data')) {
      // Proxy the multipart request directly to Telegram
      // We can use the raw request stream
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType
        },
        body: req // Stream the request body
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    res.status(400).json({ error: 'Unsupported content type' });
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
}
