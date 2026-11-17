import { type Context, result, sameOrigin, validToken, hashToken, randomToken, siteUrl, sendMail, emailHtml, htmlEscape, NOTIFY_TO } from '../../../server/newsletter';

/** POST /api/newsletter/confirm — one-time proof-of-email, then notify fan + band. */
export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!sameOrigin(request)) return result({ message: 'This request was blocked.' }, 403);
  if (!env.SUBSCRIBERS_DB || !env.RESEND_API_KEY) return result({ message: 'Confirmation is currently unavailable.' }, 503);
  let token: unknown;
  try { const raw = await request.text(); if (raw.length > 512) throw Error('Too long'); token = JSON.parse(raw).token; }
  catch { return result({ message: 'Invalid confirmation link.' }, 400); }
  if (!validToken(token)) return result({ message: 'Invalid confirmation link.' }, 400);
  try {
    const hash = await hashToken(token);
    const sub = await env.SUBSCRIBERS_DB.prepare("SELECT email,status,confirmation_expires_at FROM subscribers WHERE confirmation_token_hash=?").bind(hash).first<{ email: string; status: string; confirmation_expires_at: string | null }>();
    if (!sub || sub.status !== 'pending') return result({ message: 'This link has already been used or is no longer valid. You can subscribe again from the homepage.' }, 400);
    if (!sub.confirmation_expires_at || new Date(sub.confirmation_expires_at).getTime() < Date.now()) return result({ message: 'This confirmation link has expired. Please subscribe again from the homepage.' }, 400);
    const unsubscribeToken = randomToken();
    const unsubscribeHash = await hashToken(unsubscribeToken);
    const now = new Date().toISOString();
    const changed = await env.SUBSCRIBERS_DB.prepare("UPDATE subscribers SET status='confirmed', confirmed_at=?, confirmation_token_hash=NULL, confirmation_expires_at=NULL, unsubscribe_token_hash=?, updated_at=? WHERE confirmation_token_hash=? AND status='pending'").bind(now, unsubscribeHash, now, hash).run();
    if (!changed.meta?.changes) return result({ message: 'This link has already been used. You can return to the homepage.' }, 400);
    const unsubUrl = `${siteUrl(env)}/newsletter/unsubscribe/?token=${unsubscribeToken}`;
    const content = `<p style="line-height:1.75;color:#e1d4d8">Your email address is now confirmed for Perennial Fallout updates.</p><p style="line-height:1.75;color:#e1d4d8">When the band begins sending newsletters, this is where you'll hear about new releases and upcoming shows.</p><p style="margin:30px 0"><a style="display:inline-block;background:#6b1e30;color:white;padding:15px 24px;border-radius:50px;font-weight:bold;text-decoration:none" href="${siteUrl(env)}">VISIT THE WEBSITE</a></p>`;
    const footer = `You signed up for Perennial Fallout email updates. If you change your mind, <a href="${unsubUrl}" style="color:#eeb9c7">unsubscribe here</a>. For privacy requests, contact ${NOTIFY_TO}.`;
    try {
      await sendMail(env, { to: sub.email, subject: 'Welcome to Perennial Fallout', html: emailHtml('WELCOME TO THE FALLOUT', content, footer), text: `Welcome to the Perennial Fallout mailing list! Your address is confirmed.\n\nWebsite: ${siteUrl(env)}\nUnsubscribe: ${unsubUrl}\nQuestions: ${NOTIFY_TO}`, idempotency: `pf-welcome-${unsubscribeHash}` });
    } catch (e) { console.error('Welcome email was not delivered:', e instanceof Error ? e.message : 'Unknown'); }
    const escaped = htmlEscape(sub.email);
    const notice = `<p style="line-height:1.7;color:#e1d4d8">A fan confirmed a newsletter subscription.</p><p style="color:white;font-size:17px"><strong>${escaped}</strong></p><p style="color:#c8b7bd">Confirmed: ${htmlEscape(now)}</p>`;
    try {
      await sendMail(env, { to: NOTIFY_TO, subject: 'Perennial Fallout — new confirmed subscriber', html: emailHtml('NEW SUBSCRIBER', notice, 'Automated notification from the official Perennial Fallout website.'), text: `New confirmed subscriber: ${sub.email}\nConfirmed: ${now}` , idempotency: `pf-notify-${unsubscribeHash}` });
    } catch (e) { console.error('Band notification was not delivered:', e instanceof Error ? e.message : 'Unknown'); }
    return result({ message: 'Your subscription is confirmed. Welcome to the Fallout!' });
  } catch (e) {
    console.error('Newsletter confirmation error:', e instanceof Error ? e.message : 'Unknown');
    return result({ message: 'Confirmation is unavailable. Please try again later.' }, 502);
  }
}
