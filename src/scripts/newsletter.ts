import { siteConfig } from '../data/site';
import { get } from './dom';

type TurnstileAPI = { getResponse: (widget?: string) => string; reset: (widget?: string) => void };
declare global { interface Window { turnstile?: TurnstileAPI } }

export function initNewsletter(): void {
  const form = get<HTMLFormElement>('#newsletter-form');
  const email = get<HTMLInputElement>('#email');
  const status = get<HTMLElement>('#newsletter-message');
  const button = get<HTMLButtonElement>('button[type="submit"]', form);
  const endpoint = siteConfig.newsletterEndpoint;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const address = email.value.trim();
    email.setAttribute('aria-invalid', String(!email.validity.valid || !address));
    if (!email.validity.valid || !address) {
      status.textContent = 'Please enter a valid email address.';
      email.focus(); return;
    }
    // Fail closed until Cloudflare is fully configured, instead of pretending signup works.
    if (form.dataset.turnstileEnabled !== 'true' || !endpoint.startsWith('/')) {
      status.textContent = 'Newsletter signup is being configured. Please check back soon.';
      return;
    }
    const turnstile = window.turnstile;
    if (!turnstile) {
      status.textContent = 'Security verification is still loading. Please try again.';
      return;
    }
    const token = turnstile.getResponse();
    if (!token) {
      status.textContent = 'Please complete the security check and try again.';
      return;
    }
    button.disabled = true;
    button.textContent = 'SUBSCRIBING…';
    status.textContent = 'Submitting your email…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address, turnstileToken: token, website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value || '' })
      });
      const data: { message?: string } = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Signup unavailable. Please try again.');
      status.textContent = data.message || 'Check your inbox to confirm your subscription.';
      form.reset();
      email.removeAttribute('aria-invalid');
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Unable to subscribe right now. Please try again later.';
    } finally {
      button.disabled = false;
      button.textContent = 'SUBSCRIBE';
      try { turnstile.reset(); } catch { /* Widget may not be ready when a network error occurs. */ }
    }
  });
  email.addEventListener('input', () => { email.removeAttribute('aria-invalid'); status.textContent = ''; });
}
