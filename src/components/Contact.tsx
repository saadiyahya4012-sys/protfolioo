import React, { useRef, useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, MapPin, Github, Linkedin, Loader2 } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';
import { SectionGlow } from './AnimatedBackground';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  // startedAt enables server-side "filled too fast" bot detection.
  const startedAtRef = useRef<number>(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot — must stay empty, hidden from real users
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== 'website') {
      setFieldErrors((prev) => (prev[field as keyof FormErrors] ? { ...prev, [field]: undefined } : prev));
    }
    if (errorMsg) setErrorMsg('');
    if (submitted) setSubmitted(false);
  };

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) errors.name = 'Please enter your name.';
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';

    if (!email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

    if (!subject) errors.subject = 'Please enter a subject.';
    else if (subject.length < 3) errors.subject = 'Subject must be at least 3 characters.';

    if (!message) errors.message = 'Please enter your message.';
    else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent duplicate submissions (double-click / Enter spam)
    if (submitting) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      setErrorMsg('Please fix the highlighted fields before sending.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          website: formData.website,
          startedAt: startedAtRef.current,
        }),
      });

      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        data = {};
      }

      // Success is only shown after the server confirms the SMTP send.
      if (res.ok && data.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
        setFieldErrors({});
        startedAtRef.current = Date.now();
      } else {
        setErrorMsg(
          data.error ?? 'Something went wrong while sending your message. Please try again, or email me directly at ' + PORTFOLIO_CONFIG.email + '.'
        );
      }
    } catch (err) {
      console.error('Contact submit failed:', err);
      setErrorMsg(
        'Could not reach the email service. Please check your connection and try again, or email me directly at ' +
          PORTFOLIO_CONFIG.email +
          '.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    'w-full bg-zinc-950/70 text-sm text-zinc-100 placeholder-zinc-600 px-3.5 py-2.5 rounded-xl border transition-colors focus:outline-none focus:border-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed';
  const inputBorder = (hasError?: string) =>
    hasError ? 'border-rose-700 focus:border-rose-500' : 'border-zinc-800';

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <SectionGlow variant="contact" />
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Let&apos;s Build Something Exceptional
        </h2>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          Have an interesting project, an engineering role, or an open-source idea? Drop me a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
        {/* Left Column: Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-6">
            <h3 className="text-lg font-bold text-white">Contact Information</h3>

            <div className="flex items-start gap-3.5 text-sm text-zinc-300">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 border border-zinc-700/50 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-medium">Email</span>
                <a
                  href={`mailto:${PORTFOLIO_CONFIG.email}`}
                  className="font-medium hover:text-cyan-400 transition-colors"
                >
                  {PORTFOLIO_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-sm text-zinc-300">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-indigo-400 border border-zinc-700/50 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-medium">Location</span>
                <span className="font-medium">{PORTFOLIO_CONFIG.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-sm text-zinc-300">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 border border-zinc-700/50 shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-medium">GitHub</span>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-cyan-400 hover:underline"
                >
                  @{GITHUB_USERNAME}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-sm text-zinc-300">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-sky-400 border border-zinc-700/50 shrink-0">
                <Linkedin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs text-zinc-500 font-medium">LinkedIn</span>
                <a
                  href={PORTFOLIO_CONFIG.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-400 hover:underline"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 border border-cyan-800/30 text-xs text-zinc-300 leading-relaxed">
            <span className="font-semibold text-cyan-300 block mb-1">Fast Response Guarantee</span>
            I typically reply within 24 hours. For urgent inquiries or contracts, feel free to reach out directly via email or GitHub discussions.
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4" role="status" aria-live="polite">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Thank you for reaching out. Your email has been delivered and I will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={submitting}>
                {errorMsg && (
                  <div
                    className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300"
                    role="alert"
                    aria-live="assertive"
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Honeypot — hidden from sighted users and screen readers */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Your Name <span className="text-cyan-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={submitting}
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jane Doe"
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                      className={`${inputBase} ${inputBorder(fieldErrors.name)}`}
                    />
                    {fieldErrors.name && (
                      <p id="contact-name-error" className="mt-1 text-xs text-rose-400" role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Your Email <span className="text-cyan-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={submitting}
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jane@example.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                      className={`${inputBase} ${inputBorder(fieldErrors.email)}`}
                    />
                    {fieldErrors.email && (
                      <p id="contact-email-error" className="mt-1 text-xs text-rose-400" role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Subject <span className="text-cyan-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    autoComplete="off"
                    required
                    disabled={submitting}
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    placeholder="Project Inquiry / Job Opportunity"
                    aria-invalid={Boolean(fieldErrors.subject)}
                    aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
                    className={`${inputBase} ${inputBorder(fieldErrors.subject)}`}
                  />
                  {fieldErrors.subject && (
                    <p id="contact-subject-error" className="mt-1 text-xs text-rose-400" role="alert">
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Message <span className="text-cyan-400" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    disabled={submitting}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell me about your project, timeline, or requirements..."
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    className={`${inputBase} ${inputBorder(fieldErrors.message)} resize-none`}
                  />
                  {fieldErrors.message && (
                    <p id="contact-message-error" className="mt-1 text-xs text-rose-400" role="alert">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span aria-live="polite">Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-zinc-500 text-center">
                  Messages are sent securely via our mail server. No data is stored in a database.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
