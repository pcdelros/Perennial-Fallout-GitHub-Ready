import { siteConfig } from '../data/site';
import { get, safeUrl } from './dom';
export function initNewsletter(): void {
  const form = get<HTMLFormElement>('#newsletter-form');
  const email = get<HTMLInputElement>('#email');
  const status = get<HTMLElement>('#newsletter-message');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const address = email.value.trim();
    email.setAttribute('aria-invalid', String(!email.validity.valid || !address));
    if (!email.validity.valid || !address) {
      status.textContent = 'Please enter a valid email address.';
      email.focus(); return;
    }
    const endpoint = safeUrl(siteConfig.newsletterEndpoint);
    if (!endpoint) {
      status.textContent = 'Subscription signup is coming soon. No information was submitted.';
      return;
    }
    const button = get<HTMLButtonElement>('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: address })
      });
      if (!response.ok) throw new Error('Subscription request rejected');
      status.textContent = 'Thanks for signing up!';
      form.reset(); email.removeAttribute('aria-invalid');
    } catch { status.textContent = 'Unable to subscribe right now. Please try again later.'; }
    finally { button.disabled = false; button.textContent = 'Subscribe'; }
  });
  email.addEventListener('input', () => { email.removeAttribute('aria-invalid'); status.textContent = ''; });
}
