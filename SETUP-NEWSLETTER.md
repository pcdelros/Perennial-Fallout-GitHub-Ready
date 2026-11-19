# Perennial Fallout — Newsletter setup (Cloudflare Pages + Resend)

This package includes the frontend, Cloudflare Pages Functions and D1 database schema. It does **not** include API keys or require paying for Brevo. Before it can send emails, complete these Cloudflare and Resend steps. The site's footer, audio player and existing visuals stay intact.

## 1. Verify the sending domain in Resend

In Resend → **Domains**, finish verifying `perennialfallout.com`. Use its Cloudflare DNS setup. Do not delete existing DNS records for the working website. The sending address in the code is `Perennial Fallout <updates@perennialfallout.com>`. You do **not** have to create a Gmail inbox for this address; responses go to `perennialfallout@gmail.com` through `reply_to`.

## 2. Create a free Cloudflare D1 database

Cloudflare dashboard → **Storage & databases → D1** (menu wording may change) → **Create database** → name it `perennial-fallout-newsletter`.

Open that database's **Console**, then execute the SQL in `migrations/0001_subscribers.sql` to create the subscriber table and indexes. If your console only accepts one statement at a time, run them sequentially. No subscribers are inserted at setup.

Cloudflare → **Workers & Pages → your existing Perennial Fallout Pages project → Settings → Bindings** → add **D1 database binding**:

- Variable name: `SUBSCRIBERS_DB`
- Database: `perennial-fallout-newsletter`
- Environment: Production (and Preview only if you're testing preview signups)

The name `SUBSCRIBERS_DB` must match exactly. Redeploy after adding the binding.

## 3. Configure Cloudflare Turnstile (free)

Cloudflare dashboard → **Turnstile** → add a widget with the hostname `perennialfallout.com` (also add any active `www`/Pages preview domains that should permit signups). Use **Managed** mode; the site now requests the always-visible appearance setting. Copy its site key and secret key separately.

## 4. Set Cloudflare Pages variables and secrets

Cloudflare → **Workers & Pages → your Pages project → Settings → Variables and Secrets**. Configure these in **Production**:

| Name | Type | Value |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plain-text build environment variable | Public Turnstile site key |
| `TURNSTILE_SECRET_KEY` | **Encrypted secret** | Turnstile secret key |
| `RESEND_API_KEY` | **Encrypted secret** | Resend API key, scoped to sending emails |
| `SITE_URL` | Plain-text variable | `https://perennialfallout.com` |

Important: Astro reads `PUBLIC_TURNSTILE_SITE_KEY` during **build**; the other secrets are only read on the server at request time. All four settings and the D1 binding must exist for the production deployment. Never put keys in `src/`, `public/`, or GitHub.

If you previously displayed your Resend key publicly or committed it, revoke the old key and create a new one before proceeding.

## 5. Deploy from GitHub

Copy the ZIP's **contents** into your *existing* GitHub-connected Pages repository (preserving `.git/` in your local repository), commit and push. Cloudflare Pages must build the site with:

- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `22.23.4` or newer, consistent with `.node-version`

Keep the root-level `functions/` directory, `server/`, `migrations/`, and `public/_routes.json` in your repository. Cloudflare discovers Pages Functions automatically during Git deployments; **a drag-and-drop static upload will not deploy them**.

The Pages Function endpoints are:
- `POST /api/newsletter` — validate Turnstile, save a pending email, and send a verification email.
- `POST /api/newsletter/confirm` — confirm the emailed one-time token and send the welcome message and Gmail notification.
- `POST /api/newsletter/unsubscribe` — honor a valid unsubscribe token immediately.

The public pages `/newsletter/confirm/` and `/newsletter/unsubscribe/` provide the matching UI.

`public/_routes.json` limits serverless function invocation to `/api/*` so ordinary homepage and support-page requests remain static.

## 6. Test the full flow

1. Open the deployed `https://perennialfallout.com` in a private browser window.
2. Subscribe with an email address you control, complete any Turnstile check, and look for **Check your inbox**.
3. Open the received verification email and click **CONFIRM EMAIL**. Click **CONFIRM SUBSCRIPTION** on the website to finalize.
4. Check the fan's inbox for the welcome email.
5. Check `perennialfallout@gmail.com` for the confirmed subscriber notification. Peter does not need to give you Gmail access for the system to send the notification.
6. Use the **unsubscribe** link in the fan's welcome email; verify it changes the record to `unsubscribed` in D1.
7. Test duplicate signups and a mistyped address. The UI should display an appropriate message without exposing account membership.

### Troubleshooting

- **Turnstile missing in Safari:** The homepage now renders a visible widget (provided the public site key was present at Astro build time). Ensure `PUBLIC_TURNSTILE_SITE_KEY` is a build variable in the right Cloudflare environment, redeploy, then test Safari without content blockers for the site. The browser must be able to fetch `https://challenges.cloudflare.com/turnstile/v0/api.js`. The form continues to reject submissions that have not passed verification.

- **"Signup is not available yet":** D1 binding, Resend secret, or Turnstile secret missing. Check Pages production environment configuration and redeploy.
- **"Newsletter signup is being configured":** PUBLIC Turnstile site key missing during build. Set the build variable and redeploy.
- **"Security verification failed":** Site key/secret mismatch, misconfigured hostname, or interrupted Turnstile verification.
- **"Unable to subscribe":** Resend domain verification or API key may be missing. Check Cloudflare Function logs and Resend logs; do not paste secrets into support tickets.
- **Subscribers in D1, no confirmation email:** Verify Resend's sending domain and activity logs. Pending records can request another confirmation after the cooldown.
- **API requests return HTML/404:** Verify the Git deployment included root `functions/`; don't use static-only Direct Upload.

## 7. Export confirmed subscribers later

In D1 Console, query:

```sql
SELECT email, confirmed_at FROM subscribers
WHERE status = 'confirmed'
ORDER BY confirmed_at ASC;
```

Export **only confirmed subscriptions** to your future newsletter provider. Keep timestamps as opt-in evidence, securely handle the subscriber CSV, and do not share it publicly. Don't import pending or unsubscribed addresses into a marketing list.

**Marketing mail is intentionally not enabled.** Perennial Fallout has not supplied a valid postal mailing address. When the band is ready to send promotional campaigns, use a provider that manages campaign unsubscribes and add a compliant postal address to those messages. The confirmation and welcome emails here are limited to handling the subscription request.

## Privacy and cookie preferences

Footer links to `/purchase-terms/`, `/privacy-policy/`, `/terms-of-use/`, `/cookie-preferences/` are live pages. Cookie Preferences offers genuine opt-in local storage for music volume and repeat; the site does not currently run audience analytics or advertising pixels. Review all policy text against the band's actual activities before publishing or expanding into direct sales.
