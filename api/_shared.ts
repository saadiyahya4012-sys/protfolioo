import nodemailer from 'nodemailer';

export interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot fields — real users leave them empty. `website` is the field the frontend sends; `company` is a legacy alias. */
  website?: unknown;
  company?: unknown;
  /** Frontend render timestamp (ms) for "filled too fast" bot detection. */
  startedAt?: unknown;
}

export interface ValidatedContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  data?: ValidatedContact;
  isSpamBot?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 254 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 },
} as const;

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Shared server-side validation. Mirrors the frontend rules. */
export function validateContactPayload(body: ContactPayload): ValidationResult {
  // Anti-spam honeypot: bots fill hidden fields. Pretend success upstream.
  if (toText(body.website).length > 0 || toText(body.company).length > 0) {
    return { ok: true, errors: {}, isSpamBot: true };
  }

  const errors: Record<string, string> = {};
  const name = toText(body.name);
  const email = toText(body.email);
  const subject = toText(body.subject);
  const message = toText(body.message);

  if (!name) errors.name = 'Name is required.';
  else if (name.length < CONTACT_LIMITS.name.min) errors.name = 'Name must be at least 2 characters.';
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = 'Name must be under 100 characters.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > CONTACT_LIMITS.email.max) errors.email = 'Email is too long.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  if (!subject) errors.subject = 'Subject is required.';
  else if (subject.length < CONTACT_LIMITS.subject.min) errors.subject = 'Subject must be at least 3 characters.';
  else if (subject.length > CONTACT_LIMITS.subject.max) errors.subject = 'Subject must be under 200 characters.';

  if (!message) errors.message = 'Message is required.';
  else if (message.length < CONTACT_LIMITS.message.min) errors.message = 'Message must be at least 10 characters.';
  else if (message.length > CONTACT_LIMITS.message.max) errors.message = 'Message must be under 5000 characters.';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, errors: {}, data: { name, email, subject, message } };
}

export interface SmtpEnv {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
}

export function getSmtpEnv(env: NodeJS.ProcessEnv = process.env): { config?: SmtpEnv; missing: string[] } {
  const host = (env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number.parseInt(env.SMTP_PORT || '465', 10) || 465;
  const secure = String(env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false';
  const user = (env.SMTP_USER || '').trim();
  const pass = (env.SMTP_PASS || '').trim();
  const to = (env.CONTACT_TO_EMAIL || '').trim();

  const missing: string[] = [];
  if (!user) missing.push('SMTP_USER');
  if (!pass) missing.push('SMTP_PASS');
  if (!to) missing.push('CONTACT_TO_EMAIL');

  if (missing.length > 0) return { missing };
  return { config: { host, port, secure, user, pass, to }, missing: [] };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactEmail(data: ValidatedContact, smtp: SmtpEnv): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const textBody = [
    `New portfolio contact message`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    ``,
    data.message,
  ].join('\n');

  const htmlBody = `
    <h2>New portfolio contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <hr />
    <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
  `;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${smtp.user}>`,
    to: smtp.to,
    replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`,
    subject: `[Portfolio] ${data.subject} — from ${data.name}`,
    text: textBody,
    html: htmlBody,
  });
}

// ---------------------------------------------------------------------------
// Tiny in-memory rate limiter (per runtime instance).
// Vercel serverless instances don't share memory, so this is best-effort
// there; the Express dev server gets full protection.
// ---------------------------------------------------------------------------
const hitsByIp = new Map<string, number[]>();

export function isRateLimited(ip: string, max = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const list = (hitsByIp.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hitsByIp.set(ip, list);
  return list.length > max;
}
