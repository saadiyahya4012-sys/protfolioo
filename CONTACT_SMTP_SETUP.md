# SMTP Contact Form — Setup & Testing Guide

## What was implemented

- `api/_shared.ts` — shared server-side validation, Gmail SMTP send via Nodemailer, in-memory rate limiting (5 msgs / 15 min per IP), honeypot spam check. Never imported by React.
- `api/contact.ts` — Vercel serverless function for `POST /api/contact`. Used automatically after deployment.
- `server.ts` — local Express dev server on port 3001 that runs the same logic. Vite alone cannot run SMTP/serverless code, so this is required locally.
- `vite.config.ts` — proxies `/api/*` to `http://localhost:3001` during `npm run dev`.
- `src/components/Contact.tsx` — same dark-theme/responsive design, now `fetch('/api/contact')`. Validates Name/Email/Subject/Message, honeypot field, loading/success/error states. Success shows ONLY on HTTP 200 `{ok:true}` from the server.
- `package.json` — added `nodemailer`, `@types/nodemailer`, `concurrently`; scripts `dev:api`, `dev:full`. Removed EmailJS usage.
- `.env.example` — SMTP placeholders only. `.env.local` — gitignored template (fill with real values).
- `vercel.json` — function timeout for `/api/contact`.

## What still needs YOUR credentials (not done — by design)

No Gmail address or password is in the code. Email delivery is **not working yet** until you add real values to `.env.local` and run a real test.

## 1. Create a Google App Password (securely, ~2 min)

1. Go to your Google Account → **Security** → enable **2-Step Verification** (required).
2. Then **Security → App passwords** (or search "App passwords").
3. Create one for **Mail** / custom name "Portfolio contact".
4. Google shows a 16-character code like `abcd efgh ijkl mnop` — copy it.
5. This code goes ONLY into `.env.local` as `SMTP_PASS` and later into Vercel env vars. Never paste it into source code, chat logs, or GitHub.

## 2. Configure locally

Edit `.env.local`:

```ini
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@gmail.com
SMTP_PASS=abcdefghijklmnop   # the 16-char App Password, no spaces
CONTACT_TO_EMAIL=you@gmail.com
```

Restart the dev servers after editing (env is read at startup).

## 3. Run + test locally

```powershell
npm install
npm run dev:full
```

This starts the API (`:3001`) and Vite (`:3000`) together. Or two terminals:

```powershell
npm run dev:api   # terminal 1
npm run dev       # terminal 2
```

Checks:

1. `http://localhost:3001/api/health` → `smtpConfigured: true` once creds are set.
2. Open `http://localhost:3000`, scroll to Contact, submit with a real email you control → you receive a `[Portfolio] ...` message in Gmail.
3. Invalid submit (bad email, short message) → inline field errors, no success banner.
4. With empty `.env.local` → server returns 500 and the form shows an error (never a false success).

## 4. Deploy to Vercel later (no deploy required now)

1. Push to GitHub (secrets are gitignored — verify with `git status`).
2. `vercel` import the repo.
3. In Vercel dashboard → Project → Settings → Environment Variables, add (Production + Preview):
   `SMTP_HOST`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`.
4. Redeploy. The frontend calls the same relative `/api/contact`, now served by `api/contact.ts`. No code changes needed.

## Anti-spam & safety notes

- Honeypot field `company` (hidden via CSS): bots fill it, server returns fake success without sending.
- Rate limit: 5 POSTs / 15 min per IP per runtime instance.
- Body size capped at 32 KB; lengths capped (name 100, subject 200, message 5000).
- Server errors return generic messages; SMTP internals only appear in server logs.
