/**
 * Render one Live Shows grid. Upcoming dates appear first; past performances
 * remain visible with an inert SHOW ENDED status instead of ticket actions.
 * Uses Phoenix's calendar day because the band supplied start times but no
 * performance end times. Newsletter remains a single moving form.
 */
export function initShows(): void {
  const section = document.getElementById('shows');
  const showsList = document.getElementById('shows-list');
  const grid = document.getElementById('shows-grid');
  const emptySection = document.getElementById('shows-empty');
  const emptyNewsletterSlot = document.getElementById('shows-newsletter-slot');
  const homeNewsletterSlot = document.getElementById('home-newsletter-slot');
  const newsletter = document.getElementById('newsletter');
  if (!section || !showsList || !grid || !emptySection || !emptyNewsletterSlot || !homeNewsletterSlot || !newsletter) return;

  const allCards = [...grid.querySelectorAll<HTMLElement>('.show-card')];
  const newsletterHeading = newsletter.querySelector<HTMLElement>('#newsletter-heading');
  const newsletterIntroduction = newsletter.querySelector<HTMLElement>('.newsletter-content > p:not(.form-message):not(.newsletter-consent)');
  const newsletterTexture = newsletter.querySelector<HTMLElement>('.newsletter-texture-flicker');
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Phoenix', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const phoenixDay = (): string => {
    const parts = dateFormatter.formatToParts(new Date());
    const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
    return `${part('year')}-${part('month')}-${part('day')}`;
  };

  let lastDay = '';
  const refresh = (): void => {
    const today = phoenixDay();
    if (today === lastDay) return;
    lastDay = today;
    const upcoming = allCards.filter(card => (card.dataset.showDate ?? '') >= today)
      .sort((a, b) => (a.dataset.showStart ?? '').localeCompare(b.dataset.showStart ?? ''));
    const past = allCards.filter(card => (card.dataset.showDate ?? '') < today)
      .sort((a, b) => (b.dataset.showStart ?? '').localeCompare(a.dataset.showStart ?? ''));

    for (const card of upcoming) {
      card.classList.remove('is-past');
      card.querySelector<HTMLElement>('.show-upcoming-actions')?.removeAttribute('hidden');
      const ended = card.querySelector<HTMLElement>('.show-ended-status');
      if (ended) ended.hidden = true;
    }
    for (const card of past) {
      card.classList.add('is-past');
      const actions = card.querySelector<HTMLElement>('.show-upcoming-actions');
      if (actions) actions.hidden = true;
      card.querySelector<HTMLElement>('.show-ended-status')?.removeAttribute('hidden');
    }
    grid.replaceChildren(...upcoming, ...past);
    grid.dataset.count = String(allCards.length);

    // Only display the no-shows signup when the schedule contains no entries.
    // Completed dates stay in Live Shows rather than moving to a separate archive.
    const hasShows = allCards.length > 0;
    showsList.hidden = !hasShows;
    emptySection.hidden = hasShows;
    section.classList.toggle('shows-is-empty', !hasShows);
    if (hasShows) homeNewsletterSlot.appendChild(newsletter);
    else emptyNewsletterSlot.appendChild(newsletter);
    newsletter.classList.toggle('newsletter-embedded', !hasShows);
    newsletter.classList.toggle('newsletter-minimal', !hasShows);
    newsletter.classList.toggle('textured', hasShows);
    if (newsletterHeading) newsletterHeading.hidden = !hasShows;
    if (newsletterIntroduction) newsletterIntroduction.hidden = !hasShows;
    if (newsletterTexture) newsletterTexture.hidden = !hasShows;
  };

  refresh();
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
