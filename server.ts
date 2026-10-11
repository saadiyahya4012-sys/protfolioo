/**
 * Local development API server — mirrors `api/contact.ts` for `npm run dev`.
 *
 * Why this file exists: Vite alone serves only static frontend assets and
 * CANNOT run serverless functions or Nodemailer (SMTP secrets must never
 * reach the browser). So locally we run:
 *
 *   Terminal 1:  npm run dev:api   (this Express server on :3001)
 *   Terminal 2:  npm run dev       (Vite on :3000, proxies /api -> :3001)
 *
 * Or a single command:  npm run dev:full
 *
 * Env is loaded from `.env.local` first, then `.env` (server-side only).
 */
import path from 'node:path';
import express from 'express';
import dotenv from 'dotenv';

const root = process.cwd();
dotenv.config({ path: path.join(root, '.env.local') });
dotenv.config({ path: path.join(root, '.env') });

async function main() {
  // Dynamic import keeps tsx + Vercel bundling happy.
  const { isRateLimited, sendContactEmail, validateContactPayload, getSmtpEnv } = await import('./api/_shared.js');

  const app = express();
  // Bind IPv4 loopback explicitly so the Vite proxy target
  // http://127.0.0.1:3001 always resolves (avoids localhost -> ::1 issues).
  const HOST = process.env.CONTACT_API_HOST || '127.0.0.1';
  const PORT = Number(process.env.CONTACT_API_PORT || 3001);

  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    const { missing } = getSmtpEnv(process.env);
    res.json({ ok: true, smtpConfigured: missing.length === 0, missing });
  });

  app.post('/api/contact', async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ ok: false, error: 'Too many messages. Please wait a few minutes and try again.' });
    }

    const rawBody = ((req.body || {}) as Record<string, unknown>);

    // Anti-spam: reject submissions filled in suspiciously fast (< 2s).
    const startedAt = Number(rawBody.startedAt);
    if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000) {
      return res.status(429).json({ ok: false, error: 'Please wait a moment and try again.' });
    }

    const result = validateContactPayload(rawBody);

    if (result.isSpamBot) {
      return res.status(200).json({ ok: true, message: 'Message sent successfully.' });
    }

    if (!result.ok || !result.data) {
      return res.status(400).json({ ok: false, error: 'Please fix the highlighted fields.', fields: result.errors });
    }

    const { config, missing } = getSmtpEnv(process.env);
    if (!config) {
      console.error(`[contact] missing env vars: ${missing.join(', ')}. Copy .env.example -> .env.local and fill SMTP_* values.`);
      return res
        .status(500)
        .json({ ok: false, error: 'Email service is not configured on the server. Set SMTP credentials in .env.local.' });
    }

    try {
      await sendContactEmail(result.data, config);
      console.log(`[contact] sent message from ${result.data.email} (${result.data.name})`);
      return res.status(200).json({ ok: true, message: 'Message sent successfully.' });
    } catch (err) {
      console.error('[contact] nodemailer send failed:', err);
      return res.status(500).json({ ok: false, error: 'Could not send your message. Please try again later.' });
    }
  });

  const server = app.listen(PORT, HOST, () => {
    const { missing } = getSmtpEnv(process.env);
    // Address log only — never log secrets (no SMTP_USER/PASS values here).
    console.log(`[contact-api] listening on http://${HOST}:${PORT}`);
    console.log(`[contact-api] routes: GET /api/health, POST /api/contact`);
    if (missing.length > 0) {
      console.warn(`[contact-api] WARNING: missing ${missing.join(', ')} — POST /api/contact will return 500 until .env.local is filled.`);
    } else {
      console.log('[contact-api] SMTP env looks configured.');
    }
  });
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[contact-api] port ${PORT} is already in use. Stop the other process or set CONTACT_API_PORT.`);
    } else {
      console.error('[contact-api] server error:', err);
    }
    process.exit(1);
  });
}

main().catch((err) => {
  console.error('[contact-api] failed to start:', err);
  process.exit(1);
});
