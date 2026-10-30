import { siteConfig, type Show } from '../data/site';
import { all, get, safeUrl, reduced } from './dom';

function soon(origin: HTMLElement): void {
  const rect = origin.getBoundingClientRect();
  const isNav = !!origin.closest('.desktop-navigation, .mobile-navigation');
  const layer = get<HTMLElement>('#coming-soon-layer');
  const label = document.createElement('span');
  label.className = `soon-particle ${isNav ? 'soon-from-nav' : 'soon-from-button'}`;
  label.textContent = 'COMING SOON';
  label.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
  label.style.top = `${Math.round(isNav ? rect.bottom + 4 : rect.top - 4)}px`;
  // One feedback label per click, not a particle burst.
  const existing = origin.dataset.soonId;
  if (existing) document.getElementById(existing)?.remove();
  const id = `soon-${Math.random().toString(36).slice(2)}`;
  label.id = id;
  origin.dataset.soonId = id;
  layer.append(label);
  label.addEventListener('animationend', () => label.remove(), { once: true });
  window.setTimeout(() => label.remove(), reduced.matches ? 200 : 1100);
}
export function destination(url: string | undefined, origin: HTMLElement): void {
  const valid = safeUrl(url);
  if (valid) window.open(valid, '_blank', 'noopener,noreferrer');
  else soon(origin);
}
export function initLinks(): void {
  all<HTMLButtonElement>('[data-coming-soon]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.comingSoon;
    destination(type === 'Track purchases' ? siteConfig.buyTrackUrl : '', button);
  }));
  initShare();
  all<HTMLButtonElement>('[data-social]').forEach(button => button.addEventListener('click', () => destination(siteConfig.socials[button.dataset.social ?? ''], button)));
  all<HTMLButtonElement>('[data-tickets]').forEach(button => button.addEventListener('click', () => destination(siteConfig.shows[Number(button.dataset.tickets)]?.ticketsUrl, button)));
  all<HTMLButtonElement>('[data-remind]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.remind);
    const show = siteConfig.shows[index];
    if (!show || !downloadCalendar(show, index)) soon(button);
  }));
}
function escapeCalendar(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}
function utcStamp(input: string): string | null {
  const date = new Date(input);
  return Number.isFinite(date.getTime()) ? date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z') : null;
}
/** Downloads a local .ics with a reminder. No permissions or calendar API required. */
function downloadCalendar(show: Show, index: number): boolean {
  const start = utcStamp(show.start), end = utcStamp(show.end);
  if (!start || !end) return false;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Perennial Fallout//Website Reminder 1.5//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:pf-preview-${index}-${start}@perennial-fallout-local`,
    `DTSTAMP:${utcStamp(new Date().toISOString())}`, `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:${escapeCalendar(`Perennial Fallout — ${show.venue} (VERIFY DATE)`)}`,
    `LOCATION:${escapeCalendar(`${show.venue}, ${show.city}`)}`,
    'DESCRIPTION:Demo show details. Verify the date before relying on this reminder.',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
    'DESCRIPTION:Perennial Fallout show tomorrow (verify preview date)', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ];
  const folded = lines.map(line => (line.match(/.{1,70}/gu) ?? []).join('\r\n ')).join('\r\n') + '\r\n';
  const blob = new Blob([folded], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `perennial-fallout-reminder-${index + 1}.ics`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  return true;
}

/** Share the single via the OS share sheet, with a copy-link fallback on desktop. */
function initShare(): void {
  const button = get<HTMLButtonElement>('#share-track');
  const feedback = get<HTMLElement>('#share-feedback');
  let resetLabel: number | undefined;

  function acknowledge(message: string, label = 'Share'): void {
    feedback.textContent = message;
    window.clearTimeout(resetLabel);
    button.textContent = label;
    resetLabel = window.setTimeout(() => { button.textContent = 'Share'; }, 1600);
  }

  function shareLink(): string {
    // Retain the real origin (the Pages domain or any future custom domain),
    // but remove tracking/query params from the shared link.
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = 'music';
    return url.toString();
  }

  async function copyLink(link: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(link); return true; }
      catch { /* Fall through for restricted contexts. */ }
    }
    // Fallback for older browsers and local previews without Clipboard API.
    const field = document.createElement('textarea');
    field.value = link;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Unsupported. */ }
    field.remove();
    return copied;
  }

  button.addEventListener('click', async () => {
    const url = shareLink();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${siteConfig.songTitle} — ${siteConfig.artist}`, text: `Listen to ${siteConfig.songTitle} by ${siteConfig.artist}.`, url });
        feedback.textContent = 'Share sheet opened.';
        return;
      } catch (error) {
        // Cancelling the native share sheet isn't a failure and should not
        // unexpectedly copy a link to the user's clipboard.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    if (await copyLink(url)) acknowledge('Link copied to clipboard.', 'LINK COPIED');
    else {
      // Last resort: show the URL in an easily selectable text field.
      window.prompt('Copy this link to share the song:', url);
      acknowledge('Share link ready to copy.');
    }
  });
}
