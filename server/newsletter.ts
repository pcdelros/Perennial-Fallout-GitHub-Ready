/** Secure Cloudflare Pages + D1 + Resend API helpers. Browser never receives secrets. */
export interface DB {
  prepare(query: string): {
    bind(...params: unknown[]): { first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<{ success: boolean; meta?: { changes?: number } }> };
    first<T = Record<string, unknown>>(): Promise<T | null>;
  };
}
export interface Env {
  SUBSCRIBERS_DB: DB;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  SITE_URL?: string;
}
export type Context = { request: Request; env: Env };
export interface Subscriber {
  email: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  confirmation_sent_at: string | null;
  confirmation_expires_at: string | null;
  confirmed_at: string | null;
  confirmation_token_hash: string | null;
}
export const FROM = 'Perennial Fallout <updates@perennialfallout.com>';
export const NOTIFY_TO = 'perennialfallout@gmail.com';
const DEFAULT_URL = 'https://perennialfallout.com';
export function siteUrl(env: Env): string {
  try { const url = new URL(env.SITE_URL || DEFAULT_URL); return url.protocol === 'https:' ? url.origin : DEFAULT_URL; }
  catch { return DEFAULT_URL; }
}
export function result(data: { message: string }, status = 200): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin;
}
export function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, v => v.toString(16).padStart(2, '0')).join('');
}
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), v => v.toString(16).padStart(2, '0')).join('');
}
export function validToken(value: unknown): value is string { return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value); }
export function safeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254 || /[\r\n]/.test(email)) return null;
  if (!/^[^\s@<>]{1,64}@[^\s@<>]+\.[a-z\d-]{2,63}$/i.test(email)) return null;
  return email;
}
export function htmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch] || ch);
}
export function emailHtml(title: string, content: string, footer: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#0b0b0d;color:#f5f0eb;font-family:Arial,sans-serif;padding:24px;"><div style="max-width:560px;margin:auto;border:1px solid #4b202d;background:#161116;border-radius:12px;overflow:hidden"><div style="height:9px;background:#6b1e30"></div><div style="padding:36px 28px"><div style="color:#db889e;font-weight:700;font-size:13px;letter-spacing:3px">PERENNIAL FALLOUT</div><h1 style="font-size:28px;line-height:1.22;margin:26px 0 20px;color:#fff">${title}</h1>${content}<hr style="border:0;border-top:1px solid #4c3038;margin:34px 0 20px"><p style="color:#c0abb2;font-size:12px;line-height:1.7;margin:0">${footer}</p></div></div></body></html>`;
}
export async function sendMail(env: Env, opts: { to: string; subject: string; text: string; html: string; idempotency?: string }): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.idempotency ? { 'Idempotency-Key': opts.idempotency } : {})
    },
    body: JSON.stringify({ from: FROM, to: [opts.to], subject: opts.subject, text: opts.text, html: opts.html, reply_to: NOTIFY_TO })
  });
  if (!response.ok) {
    console.error('Newsletter mail provider status:', response.status);
    throw new Error('Email delivery is temporarily unavailable. Please try again later.');
  }
}
export async function verifyTurnstile(request: Request, env: Env, token: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY || !token || token.length > 2048) return false;
  const payload = new FormData();
  payload.append('secret', env.TURNSTILE_SECRET_KEY);
  payload.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) payload.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: payload });
    if (!r.ok) return false;
    const data = await r.json() as { success?: boolean; action?: string; hostname?: string };
    // Enforce the action set on the newsletter widget; hostname is enforced in Turnstile settings.
    return data.success === true && data.action === 'newsletter_signup';
  } catch { return false; }
}
