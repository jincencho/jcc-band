
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
    const { formData } = body;
    if (formData) {
      const typeLabel = formData.view === 'premium' ? '매장방문' : '비대면';
      const getTimeRange = (hour) => {
        if (hour === 9) return "09:00 ~ 12:00";
        if (hour === 14) return "14:00 ~ 17:00";
        if (hour === 17) return "17:00 ~ 20:00";
        return `${hour}:00`;
      };

      let formattedMessage = 
        `🔔 *새 상담 신청 (${typeLabel})*\n\n` +
        `👤 *이름:* ${formData.name}\n` +
        `📞 *연락처:* ${formData.phone}${formData.phone2 ? ` / ${formData.phone2}` : ''}\n` +
        `📋 *상담 분야:* ${formData.topic.replace('문의', '').replace('가전', '')}\n`;

      if (formData.view === 'premium') {
        formattedMessage += `📅 *희망 날짜:* ${formData.date} (${getTimeRange(formData.time)})\n`;
      }
      
      formattedMessage += `💬 *추가 요청:* ${formData.details || '없음'}\n\n`;

      if (formData.utm && formData.utm.utm_source) {
        formattedMessage += 
          `🌐 *유입 경로*\n` +
          `- 출처: ${formData.utm.utm_source || '-'}\n` +
          `- 캠페인: ${formData.utm.utm_campaign || '-'}\n` +
          `- 포스트: ${formData.utm.utm_content || '-'}\n` +
          `- 단지/지역: ${formData.utm.utm_term || '-'}\n`;
      }

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: formattedMessage,
          parse_mode: 'Markdown'
        })
      });
    } else if (body.message) {
      // Fallback for simple message requests
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
      // We add chat_id as a query parameter because it's missing in the raw body from the frontend
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}`, {
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
