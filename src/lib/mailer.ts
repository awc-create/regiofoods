// src/lib/mailer.ts — optional email copies of website enquiries.
// Uses Resend when RESEND_ENABLED=true (same as Prince Foods), otherwise SMTP_* if set.
import nodemailer from 'nodemailer';

type Mail = { to: string; subject: string; text: string; replyTo?: string };

function resendOn() {
  return process.env.RESEND_ENABLED === 'true' && Boolean(process.env.RESEND_API_KEY);
}

function smtpOn() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function isMailConfigured() {
  return resendOn() || smtpOn();
}

const fromAddress = () =>
  process.env.RESEND_FROM ||
  process.env.EMAIL_FROM ||
  process.env.SMTP_FROM ||
  process.env.SMTP_USER ||
  'Regio Foods <info@regiofoods.in>';

export async function sendMail(opts: Mail): Promise<boolean> {
  if (resendOn()) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: opts.to
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        subject: opts.subject,
        text: opts.text,
        reply_to: opts.replyTo || process.env.RESEND_REPLY_TO || undefined,
      }),
    });
    if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
    return true;
  }

  if (smtpOn()) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: fromAddress(),
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    return true;
  }

  return false;
}
