
## T5 — Serverless Webhook API (2026-03-31)

### Pattern: Vercel Serverless Handler
- `api/contact.ts` follows the same pattern as `api/update-resume.js`
- Export default async function handler(req: VercelRequest, res: VercelResponse)
- Use `@vercel/node` types for typed request/response
- No frameworks needed — plain Node.js fetch works in Vercel serverless functions

### Security: VITE_* vs process.env
- `import.meta.env.VITE_*` vars are inlined into client bundle at build time (visible in DevTools)
- `process.env.*` in `api/` functions stays server-side — never shipped to client
- Pattern to eliminate exposure: stop calling getWebhookConfig() from client; POST to /api/contact instead
- After change: grep -rl "SLACK_WEBHOOK|DISCORD_WEBHOOK|TELEGRAM_BOT" build/assets/ → ZERO results

### Contact Form Architecture
- Formspree remains primary submission (handles email delivery, spam protection)
- /api/contact is secondary (sends Slack/Discord/Telegram notifications after Formspree succeeds)
- This dual approach: user-visible success tied to Formspree; notification delivery is fire-and-forget

### TypeScript for api/ directory
- api/ functions compile via the root tsconfig.json (tsc picks them up)
- VercelRequest/VercelResponse types available via @vercel/node (already installed)
