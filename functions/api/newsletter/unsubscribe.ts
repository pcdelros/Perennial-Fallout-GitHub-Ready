import { type Context, result, sameOrigin, validToken, hashToken } from '../../../server/newsletter';

/** POST /api/newsletter/unsubscribe — simple immediate unsubscribe, no sign-in. */
export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!sameOrigin(request)) return result({ message: 'This request was blocked.' }, 403);
  if (!env.SUBSCRIBERS_DB) return result({ message: 'Unsubscribe is temporarily unavailable.' }, 503);
  let token: unknown;
  try { const raw = await request.text(); if (raw.length > 512) throw Error('Too long'); token = JSON.parse(raw).token; }
  catch { return result({ message: 'Invalid unsubscribe link.' }, 400); }
  if (!validToken(token)) return result({ message: 'Invalid unsubscribe link.' }, 400);
  try {
    const hash = await hashToken(token);
    const changed = await env.SUBSCRIBERS_DB.prepare("UPDATE subscribers SET status='unsubscribed', unsubscribed_at=?, updated_at=?, unsubscribe_token_hash=NULL WHERE unsubscribe_token_hash=? AND status='confirmed'").bind(new Date().toISOString(), new Date().toISOString(), hash).run();
    return changed.meta?.changes ? result({ message: 'You are unsubscribed. You will not receive future Perennial Fallout newsletters.' }) : result({ message: 'This link is no longer valid. If you need help, contact perennialfallout@gmail.com.' }, 400);
  } catch (e) {
    console.error('Newsletter unsubscribe error:', e instanceof Error ? e.message : 'Unknown');
    return result({ message: 'Unable to process your request right now. Please try again later.' }, 502);
  }
}
