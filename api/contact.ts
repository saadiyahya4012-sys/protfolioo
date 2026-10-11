import { getSmtpEnv, isRateLimited, sendContactEmail, validateContactPayload } from './_shared.js';

// Vercel Serverless Function — secure server-side SMTP endpoint.
// Env vars (Vercel dashboard only, NEVER VITE_ prefixed):
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL

interface VercelReq {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const MAX_BODY_CHARS = 20_000;

function getClientIp(req: VercelReq): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (first) return first.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  if (isRateLimited(getClientIp(req))) {
    res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
    return;
  }

  const body = ((req.body ?? {}) as Record<string, unknown>);

  if (JSON.stringify(body).length > MAX_BODY_CHARS) {
    res.status(413).json({ ok: false, error: 'Message is too large.' });
    return;
  }

  // Anti-spam: reject submissions filled in suspiciously fast (< 2s).
  const startedAt = Number((body as Record<string, unknown>).startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000) {
    res.status(429).json({ ok: false, error: 'Please wait a moment and try again.' });
    return;
  }

  // Shared validation + sanitization + honeypot (`website`/`company`).
  const result = validateContactPayload(body);

  // Honeypot hit — fake success so bots can't probe the endpoint.
  if (result.isSpamBot) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!result.ok || !result.data) {
    const firstError = Object.values(result.errors)[0] ?? 'Please check the form and try again.';
    res.status(400).json({ ok: false, error: firstError, fields: result.errors });
    return;
  }

  // Reject obvious link spam (more than 3 URLs).
  const linkCount = (result.data.message.match(/https?:\/\//gi) ?? []).length;
  if (linkCount > 3) {
    res.status(400).json({ ok: false, error: 'Message looks like spam. Please remove extra links.' });
    return;
  }

  const { config, missing } = getSmtpEnv(process.env);
  if (!config) {
    // Generic message on purpose — never reveal which variable is missing.
    console.error(`Contact API misconfigured, missing: ${missing.join(', ')}`);
    res.status(500).json({ ok: false, error: 'Email service is not configured. Please try again later.' });
    return;
  }

  try {
    await sendContactEmail(result.data, config);
    // Only report success after sendMail resolves — never faked.
    res.status(200).json({ ok: true });
  } catch (err) {
    // Log full error server-side, return a generic message to the client.
    console.error('Contact API sendMail failed:', err);
    res.status(502).json({ ok: false, error: 'Could not send your message. Please try again later.' });
  }
}
