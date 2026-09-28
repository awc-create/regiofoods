import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getContent } from '@/lib/content';
import { contactPage, siteSettings } from '@/content/sections/pages';
import { sendMail } from '@/lib/mailer';
import { bad, readJson, str } from '@/lib/api';

// Simple in-memory rate limit: 5 messages per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad('Please fill in the form.');

  // Honeypot: real visitors never see this field.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return bad('Too many messages — please try again in a few minutes.', 429);

  const name = str(body.name, 200);
  const email = str(body.email, 200);
  const message = str(body.message, 5000);
  const company = str(body.company, 200) || null;
  const phone = str(body.phone, 60) || null;
  const source = str(body.source, 40) || 'contact';

  if (!name || !email || !message) return bad('Please fill in your name, email and message.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('Please enter a valid email address.');

  await prisma.contactMessage.create({ data: { name, email, message, company, phone, source } });

  // Optional email copy
  try {
    const [page, site] = await Promise.all([getContent(contactPage), getContent(siteSettings)]);
    const to = page.notifyEmail || site.email;
    if (to) {
      await sendMail({
        to,
        replyTo: email,
        subject: `New website enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : '',
          phone ? `Phone: ${phone}` : '',
          '',
          message,
        ]
          .filter(Boolean)
          .join('\n'),
      });
    }
  } catch (err) {
    console.error('contact email failed', err);
  }

  return NextResponse.json({ ok: true });
}
