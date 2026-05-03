
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
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    
    let body = {};
    let isMultipart = contentType.includes('multipart/form-data');
    
    if (contentType.includes('application/json')) {
      body = JSON.parse(rawBody);
    }

    // 1. Send Text Message to Telegram
    if (body.message) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: body.message,
          parse_mode: 'Markdown'
        })
      });
    }

    // 2. Send Data to Google Sheets (if URL is set)
    if (process.env.GOOGLE_SHEET_URL && body.message) {
      // Parse structured data from message or pass raw body
      // We can pass a cleaner version for the sheet
      await fetch(process.env.GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body.formData || { raw: body.message })
      });
    }
    
    if (isMultipart) {
      // Proxy the multipart request directly to Telegram for photos
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: Buffer.concat(chunks) // Forward the raw multipart body
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
}
