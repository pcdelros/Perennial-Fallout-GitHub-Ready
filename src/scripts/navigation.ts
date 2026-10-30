import { all, get, reduced } from './dom';
export function initNavigation(): void {
  const header = get<HTMLElement>('#site-header');
  const toggle = get<HTMLButtonElement>('#menu-toggle');
  const menu = get<HTMLElement>('#mobile-navigation');
  const backdrop = get<HTMLElement>('#menu-backdrop');
  const setMenu = (open: boolean): void => {
    header.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-is-open', open);
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (open) menu.querySelector<HTMLElement>('a,button')?.focus();
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  all<HTMLAnchorElement>('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
  backdrop.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false); toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.classList.contains('is-open') && !header.contains(event.target as Node)) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (innerWidth > 760 && menu.classList.contains('is-open')) setMenu(false);
  }, { passive: true });
  // The header receives is-scrolled from the effects scheduler.
  get<HTMLElement>('#copyright-year').textContent = String(new Date().getFullYear());

  // Native details/summary: no scaled backgrounds, and height-only on mobile.
  const mobile = matchMedia('(max-width:760px)');
  all<HTMLDetailsElement>('.footer-column').forEach(details => {
    const summary = get<HTMLElement>('summary', details);
    const shell = get<HTMLElement>('.footer-links-shell', details);
    let anim: Animation | null = null;
    function syncDesktop(): void {
      if (mobile.matches) return;
      anim?.cancel(); anim = null;
      details.open = true;
      details.style.height = '';
      details.style.overflow = '';
    }
    mobile.addEventListener('change', syncDesktop);
    syncDesktop();
    summary.addEventListener('click', event => {
      if (!mobile.matches) { event.preventDefault(); return; }
      if (reduced.matches) return; // Native disclosure without animation.
      event.preventDefault();
      anim?.finish();
      const wasOpen = details.open;
      const start = details.getBoundingClientRect().height;
      if (!wasOpen) { details.open = true; details.style.height = `${start}px`; }
      const end = wasOpen ? summary.getBoundingClientRect().height : summary.getBoundingClientRect().height + shell.scrollHeight;
      details.style.overflow = 'hidden';
      anim = details.animate([{ height: `${start}px` }, { height: `${end}px` }], {
        duration: 280, easing: 'cubic-bezier(.25,.8,.25,1)'
      });
      anim.onfinish = () => {
        details.open = !wasOpen;
        details.style.height = '';
        details.style.overflow = '';
        anim = null;
      };
    });
  });
}
