/**
 * Webhook and Notification Utilities
 * Send contact form submissions to multiple services (Slack, Discord, Email, etc.)
 */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
  userAgent?: string;
  referrer?: string;
}

export interface WebhookConfig {
  slack?: {
    webhookUrl: string;
    channel?: string;
    username?: string;
  };
  discord?: {
    webhookUrl: string;
    username?: string;
  };
  telegram?: {
    botToken: string;
    chatId: string;
  };
  email?: {
    enabled: boolean;
    apiEndpoint?: string;
  };
}

/**
 * Format contact form data for Slack
 */
function formatSlackMessage(data: ContactFormData): any {
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
          {
            type: 'mrkdwn',
            text: `*Name:*\n${data.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${data.email}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Subject:*\n${data.subject || 'No subject'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${data.timestamp || new Date().toISOString()}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${data.message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `User Agent: ${data.userAgent || 'Unknown'} | Referrer: ${data.referrer || 'Direct'}`,
          },
        ],
      },
    ],
  };
}

/**
 * Format contact form data for Discord
 */
function formatDiscordMessage(data: ContactFormData): any {
  return {
    username: 'Portfolio Contact Form',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    embeds: [
      {
        title: '📧 New Contact Form Submission',
        color: 0x0ea5e9, // Sky blue
        fields: [
          {
            name: '👤 Name',
            value: data.name,
            inline: true,
          },
          {
            name: '📧 Email',
            value: data.email,
            inline: true,
          },
          {
            name: '📝 Subject',
            value: data.subject || 'No subject',
            inline: false,
          },
          {
            name: '💬 Message',
            value: data.message.length > 1000 ? `${data.message.substring(0, 1000)}...` : data.message,
            inline: false,
          },
        ],
        footer: {
          text: `Received at ${data.timestamp || new Date().toLocaleString()}`,
        },
      },
    ],
  };
}

/**
 * Format contact form data for Telegram
 */
function formatTelegramMessage(data: ContactFormData): string {
  return `
🆕 *New Contact Form Submission*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📝 *Subject:* ${data.subject || 'No subject'}

💬 *Message:*
${data.message}

🕐 *Time:* ${data.timestamp || new Date().toLocaleString()}
  `.trim();
}

/**
 * Send notification to Slack
 */
async function sendToSlack(data: ContactFormData, config: WebhookConfig['slack']): Promise<void> {
  if (!config?.webhookUrl) return;

  const payload = formatSlackMessage(data);

  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`);
  }
}

/**
 * Send notification to Discord
 */
async function sendToDiscord(data: ContactFormData, config: WebhookConfig['discord']): Promise<void> {
  if (!config?.webhookUrl) return;

  const payload = formatDiscordMessage(data);

  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.statusText}`);
  }
}

/**
 * Send notification to Telegram
 */
async function sendToTelegram(data: ContactFormData, config: WebhookConfig['telegram']): Promise<void> {
  if (!config?.botToken || !config?.chatId) return;

  const message = formatTelegramMessage(data);
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram webhook failed: ${response.statusText}`);
  }
}

/**
 * Send contact form data to configured webhooks
 */
export async function sendWebhookNotifications(
  formData: ContactFormData,
  config: WebhookConfig
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Enrich form data with metadata
  const enrichedData: ContactFormData = {
    ...formData,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    referrer: typeof document !== 'undefined' ? document.referrer : 'Unknown',
  };

  // Send to all configured services in parallel
  const promises: Promise<void>[] = [];

  if (config.slack?.webhookUrl) {
    promises.push(
      sendToSlack(enrichedData, config.slack).catch((error) => {
        errors.push(`Slack: ${error.message}`);
      })
    );
  }

  if (config.discord?.webhookUrl) {
    promises.push(
      sendToDiscord(enrichedData, config.discord).catch((error) => {
        errors.push(`Discord: ${error.message}`);
      })
    );
  }

  if (config.telegram?.botToken && config.telegram?.chatId) {
    promises.push(
      sendToTelegram(enrichedData, config.telegram).catch((error) => {
        errors.push(`Telegram: ${error.message}`);
      })
    );
  }

  await Promise.allSettled(promises);

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Default webhook configuration from environment variables
 */
export function getWebhookConfig(): WebhookConfig {
  return {
    slack: {
      webhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL || '',
      channel: import.meta.env.VITE_SLACK_CHANNEL || '#contact-forms',
      username: 'Portfolio Bot',
    },
    discord: {
      webhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL || '',
      username: 'Portfolio Contact Form',
    },
    telegram: {
      botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
      chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
    },
    email: {
      enabled: true,
      apiEndpoint: import.meta.env.VITE_EMAIL_API_ENDPOINT,
    },
  };
}

/**
 * Analytics tracking for form submissions
 */
export function trackFormSubmission(formData: ContactFormData): void {
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'form_submission', {
      event_category: 'Contact',
      event_label: formData.subject || 'No subject',
      value: 1,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('📧 Contact form submitted:', formData);
  }
}
