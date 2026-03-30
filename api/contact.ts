import type {VercelRequest, VercelResponse} from '@vercel/node';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function formatSlackMessage(data: ContactFormData & {timestamp: string}): object {
  return {
    text: `🆕 New Contact Form Submission`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📧 New Contact Form Submission',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {type: 'mrkdwn', text: `*Name:*\n${data.name}`},
          {type: 'mrkdwn', text: `*Email:*\n${data.email}`},
        ],
      },
      {
        type: 'section',
        fields: [
          {type: 'mrkdwn', text: `*Subject:*\n${data.subject || 'No subject'}`},
          {type: 'mrkdwn', text: `*Time:*\n${data.timestamp}`},
        ],
      },
      {
        type: 'section',
        text: {type: 'mrkdwn', text: `*Message:*\n${data.message}`},
      },
    ],
  };
}

function formatDiscordMessage(data: ContactFormData & {timestamp: string}): object {
  return {
    username: 'Portfolio Contact Form',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    embeds: [
      {
        title: '📧 New Contact Form Submission',
        color: 0x0ea5e9,
        fields: [
          {name: '👤 Name', value: data.name, inline: true},
          {name: '📧 Email', value: data.email, inline: true},
          {name: '📝 Subject', value: data.subject || 'No subject', inline: false},
          {
            name: '💬 Message',
            value: data.message.length > 1000 ? `${data.message.substring(0, 1000)}...` : data.message,
            inline: false,
          },
        ],
        footer: {text: `Received at ${data.timestamp}`},
      },
    ],
  };
}

function formatTelegramMessage(data: ContactFormData & {timestamp: string}): string {
  return `
🆕 *New Contact Form Submission*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📝 *Subject:* ${data.subject || 'No subject'}

💬 *Message:*
${data.message}

🕐 *Time:* ${data.timestamp}
  `.trim();
}

async function sendToSlack(data: ContactFormData & {timestamp: string}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formatSlackMessage(data)),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`);
  }
}

async function sendToDiscord(data: ContactFormData & {timestamp: string}): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formatDiscordMessage(data)),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.statusText}`);
  }
}

async function sendToTelegram(data: ContactFormData & {timestamp: string}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(data),
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram webhook failed: ${response.statusText}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {name, email, subject, message} = req.body as Partial<ContactFormData>;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({error: 'Name is required'});
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({error: 'Email is required'});
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({error: 'Invalid email address'});
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({error: 'Message is required'});
  }

  const enrichedData = {
    name: name.trim(),
    email: email.trim(),
    subject: (subject || '').trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  const errors: string[] = [];

  await Promise.allSettled([
    sendToSlack(enrichedData).catch((err: Error) => {
      console.error('Slack error:', err.message);
      errors.push(`Slack: ${err.message}`);
    }),
    sendToDiscord(enrichedData).catch((err: Error) => {
      console.error('Discord error:', err.message);
      errors.push(`Discord: ${err.message}`);
    }),
    sendToTelegram(enrichedData).catch((err: Error) => {
      console.error('Telegram error:', err.message);
      errors.push(`Telegram: ${err.message}`);
    }),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Contact form submitted successfully',
    ...(errors.length > 0 && {warnings: errors}),
  });
}
