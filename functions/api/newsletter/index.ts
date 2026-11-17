import { type Context, type Subscriber, result, sameOrigin, safeEmail, randomToken, hashToken, siteUrl, sendMail, emailHtml, verifyTurnstile } from '../../../server/newsletter';

/** POST /api/newsletter — validate, store pending subscription, send confirmation. */
export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!sameOrigin(request)) return result({ message: 'This request was blocked.' }, 403);
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) return result({ message: 'Invalid request.' }, 415);
  if (!env.SUBSCRIBERS_DB || !env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) return result({ message: 'Signup is not available yet. Please check back soon.' }, 503);
  let body: { email?: unknown; turnstileToken?: unknown; website?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 4096) return result({ message: 'Invalid request.' }, 413);
    body = JSON.parse(raw);
  } catch { return result({ message: 'Invalid request.' }, 400); }
  if (body.website) return result({ message: 'Please check your inbox for a confirmation email.' });
  const email = safeEmail(body.email);
  if (!email) return result({ message: 'Please enter a valid email address.' }, 400);
  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
  if (!(await verifyTurnstile(request, env, token))) return result({ message: 'Security verification was unsuccessful. Please try again.' }, 400);
  const generic = 'Check your inbox for a confirmation email. If you already subscribed, no action is needed.';
  try {
    const previous = await env.SUBSCRIBERS_DB.prepare('SELECT email,status,confirmation_sent_at,confirmation_expires_at,confirmed_at,confirmation_token_hash FROM subscribers WHERE email=?').bind(email).first<Subscriber>();
    if (previous?.status === 'confirmed') return result({ message: generic });
    if (previous?.confirmation_sent_at && Date.now() - new Date(previous.confirmation_sent_at).getTime() < 120000) return result({ message: generic });
    const confirm = randomToken();
    const hash = await hashToken(confirm);
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();
    if (previous) {
      await env.SUBSCRIBERS_DB.prepare("UPDATE subscribers SET status='pending', confirmation_token_hash=?, confirmation_expires_at=?, requested_at=?, confirmation_sent_at=NULL, unsubscribe_token_hash=NULL, unsubscribed_at=NULL, updated_at=? WHERE email=?").bind(hash, expires, now, now, email).run();
    } else {
      await env.SUBSCRIBERS_DB.prepare("INSERT INTO subscribers (email,status,confirmation_token_hash,confirmation_expires_at,requested_at,updated_at) VALUES (?,'pending',?,?,?,?)").bind(email, hash, expires, now, now).run();
    }
    const confirmUrl = `${siteUrl(env)}/newsletter/confirm/?token=${confirm}`;
    const content = `<p style="line-height:1.75;color:#e1d4d8">Someone used this email address to join the Perennial Fallout mailing list. Please confirm your request to finish subscribing.</p><p style="margin:30px 0"><a style="display:inline-block;background:#6b1e30;color:white;padding:15px 24px;border-radius:50px;font-weight:bold;text-decoration:none" href="${confirmUrl}">CONFIRM EMAIL</a></p><p style="line-height:1.6;color:#d4bdc5">This link expires in 48 hours. If you did not request this, you can ignore this message.</p>`;
    await sendMail(env, { to: email, subject: 'Confirm your Perennial Fallout subscription', html: emailHtml('CONFIRM YOUR EMAIL', content, 'This is a one-time email to verify your newsletter signup. You have not been added to the mailing list yet.'), text: `Confirm your Perennial Fallout mailing list request here: ${confirmUrl}\n\nLink expires in 48 hours. If you did not request this, ignore this email.`, idempotency: `pf-confirm-${hash}` });
    await env.SUBSCRIBERS_DB.prepare('UPDATE subscribers SET confirmation_sent_at=?, updated_at=? WHERE email=? AND confirmation_token_hash=?').bind(now, now, email, hash).run();
    return result({ message: generic });
  } catch (error) {
    console.error('Newsletter signup error', error instanceof Error ? error.message : 'Unknown error');
    return result({ message: 'Unable to subscribe at the moment. Please try again later.' }, 502);
  }
}
