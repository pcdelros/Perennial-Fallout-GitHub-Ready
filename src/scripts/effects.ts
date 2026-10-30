import { all, get, reduced } from './dom';

const texturePaths = [1, 2, 3].map(n => `/assets/hover-textures/hover-${n}.webp`);

/** Desktop: hover/mouse tracking. Touch: active textures when a photo enters view. */
function initPhotoTextures(): void {
  texturePaths.forEach(src => { const image = new Image(); image.src = src; });
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const members = all<HTMLElement>('.member');
  const visible = new Set<HTMLElement>();
  const timers = new Map<HTMLElement, number>();
  const start = (member: HTMLElement): void => {
    if (reduced.matches || timers.has(member) || document.hidden) return;
    const texture = get<HTMLElement>('.member-texture', member);
    let index = 0;
    texture.style.backgroundImage = `url('${texturePaths[index]}')`;
    member.classList.add('is-hovered');
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      index = (index + 1) % texturePaths.length;
      texture.style.backgroundImage = `url('${texturePaths[index]}')`;
    }, 144);
    timers.set(member, timer);
  };
  const stop = (member: HTMLElement): void => {
    const timer = timers.get(member);
    if (timer !== undefined) clearInterval(timer);
    timers.delete(member);
    member.classList.remove('is-hovered');
    const picture = get<HTMLImageElement>('.member-visual img', member);
    picture.style.removeProperty('--member-x');
    picture.style.removeProperty('--member-y');
  };
  const sync = (): void => {
    const mobile = innerWidth <= 760 || !fine.matches;
    for (const member of members) {
      if (mobile && visible.has(member) && !document.hidden) start(member);
      else if (mobile || !member.matches(':hover')) stop(member);
    }
  };
  members.forEach(member => {
    const visual = get<HTMLElement>('.member-visual', member);
    const image = get<HTMLImageElement>('img', visual);
    const move = (event: PointerEvent): void => {
      const rect = visual.getBoundingClientRect();
      image.style.setProperty('--member-x', `${((0.5 - (event.clientX - rect.left) / rect.width) * 14).toFixed(1)}px`);
      image.style.setProperty('--member-y', `${((0.5 - (event.clientY - rect.top) / rect.height) * 14).toFixed(1)}px`);
    };
    visual.addEventListener('pointerenter', event => {
      if (!fine.matches || event.pointerType === 'touch') return;
      start(member); move(event);
    });
    visual.addEventListener('pointermove', event => {
      if (fine.matches && timers.has(member)) move(event);
    }, { passive: true });
    visual.addEventListener('pointerleave', () => stop(member));
  });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const member = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(member);
      else visible.delete(member);
    }
    sync();
  }, { threshold: 0.2 });
  members.forEach(member => observer.observe(member));
  window.addEventListener('resize', sync, { passive: true });
  fine.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('blur', () => members.forEach(stop));
  reduced.addEventListener('change', () => { members.forEach(stop); sync(); });
}

function initNewsletterTextures(): void {
  const texture = get<HTMLElement>('#newsletter-texture-flicker');
  let visible = false, frame = 0;
  let interval: number | null = null;
  const sync = (): void => {
    const shouldRun = visible && !reduced.matches && !document.hidden;
    if (!shouldRun) { if (interval !== null) clearInterval(interval); interval = null; return; }
    if (interval !== null) return;
    interval = window.setInterval(() => {
      frame = (frame + 1) % texturePaths.length;
      texture.style.backgroundImage = `url('${texturePaths[frame]}')`;
    }, 184);
  };
  new IntersectionObserver(entries => {
    visible = !!entries[0]?.isIntersecting;
    sync();
  }, { threshold: 0.02 }).observe(get('#newsletter'));
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}

/** Smooth, slightly trailing 3D perspective on texture planes, never on content/footer. */
function initParallax(): void {
  const sections = all<HTMLElement>('.shows,.band,.newsletter');
  const header = get<HTMLElement>('#site-header');
  const motion = sections.map(element => ({ element, value: 0, initialized: false }));
  let raf = 0;
  let last = 0;
  function animate(now: number): void {
    raf = 0;
    header.classList.toggle('is-scrolled', window.scrollY > 32);
    if (reduced.matches || document.hidden) return;
    // Time-based damping: roughly 280ms of inertia rather than snapping to scroll.
    const dt = Math.min(64, Math.max(0, now - (last || now)));
    const ease = 1 - Math.exp(-dt / 280);
    last = now;
    let stillMoving = false;
    for (const item of motion) {
      const rect = item.element.getBoundingClientRect();
      if (rect.bottom < -150 || rect.top > innerHeight + 150) continue;
      const normalized = (rect.top + rect.height / 2 - innerHeight / 2) / (innerHeight + rect.height);
      const target = Math.max(-1, Math.min(1, normalized));
      if (!item.initialized) { item.initialized = true; item.value = target; }
      const delta = target - item.value;
      item.value += delta * ease;
      if (Math.abs(delta) > 0.0005) stillMoving = true;
      const progress = item.value;
      item.element.style.setProperty('--depth-shift', `${(progress * 224).toFixed(1)}px`);
      item.element.style.setProperty('--depth-x', `${(progress * -56).toFixed(1)}px`);
      item.element.style.setProperty('--depth-angle', `${(progress * 4).toFixed(2)}deg`);
      item.element.style.setProperty('--depth-yaw', `${(progress * -3).toFixed(2)}deg`);
    }
    if (stillMoving) raf = requestAnimationFrame(animate);
  }
  const schedule = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 32);
    if (!raf && !reduced.matches && !document.hidden) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    motion.forEach(m => { m.initialized = false; });
    schedule();
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  schedule();
}

/** 2D canvas red smoke, 24fps cap, drawn at 56% resolution to avoid GPU overload. */
function initSmoke(): void {
  const canvas = get<HTMLCanvasElement>('#hero-smoke');
  const hero = get<HTMLElement>('.hero');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const sprite = document.createElement('canvas');
  sprite.width = 128; sprite.height = 128;
  const sc = sprite.getContext('2d');
  if (!sc) return;
  const gradient = sc.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(230,57,70,.36)');
  gradient.addColorStop(0.32, 'rgba(116,15,31,.17)');
  gradient.addColorStop(0.75, 'rgba(67,9,21,.035)');
  gradient.addColorStop(1, 'rgba(60,8,20,0)');
  sc.fillStyle = gradient; sc.fillRect(0, 0, 128, 128);
  const puffs = Array.from({ length: 24 }, () => ({
    x: Math.random(), y: Math.random(), size: 0.10 + Math.random() * 0.19,
    dx: (Math.random() - 0.5) * 0.000007, dy: (Math.random() - 0.5) * 0.000007 - 0.000004,
    phase: Math.random() * 6.28, alpha: 0.28 + Math.random() * 0.40
  }));
  let visible = false, frame = 0, last = 0, width = 0, height = 0;
  const resize = (): void => {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width * 0.56));
    height = Math.max(1, Math.round(Math.min(rect.height, innerWidth <= 760 ? innerWidth * 1.38 : rect.height) * 0.56));
    canvas.width = width; canvas.height = height;
  };
  const draw = (now: number): void => {
    if (!visible || reduced.matches || document.hidden) { frame = 0; return; }
    frame = requestAnimationFrame(draw);
    if (now - last < 1000 / 24) return;
    const delta = Math.min(60, now - last || 42); last = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'screen';
    for (const puff of puffs) {
      puff.x += puff.dx * delta; puff.y += puff.dy * delta;
      if (puff.x < -0.1) puff.x = 1.1;
      if (puff.x > 1.1) puff.x = -0.1;
      if (puff.y < -0.15) puff.y = 1.1;
      if (puff.y > 1.1) puff.y = -0.15;
      const size = width * puff.size;
      const x = (puff.x + Math.sin(now * 0.00012 + puff.phase) * 0.01) * width;
      ctx.globalAlpha = puff.alpha * 0.34;
      ctx.drawImage(sprite, x - size / 2, puff.y * height - size / 2, size * 1.8, size);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };
  const sync = (): void => {
    const run = visible && !reduced.matches && !document.hidden;
    if (run && !frame) { last = 0; frame = requestAnimationFrame(draw); }
    else if (!run && frame) { cancelAnimationFrame(frame); frame = 0; ctx.clearRect(0, 0, width, height); }
  };
  resize();
  new IntersectionObserver(entries => { visible = !!entries[0]?.isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}

function initEntrances(): void {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }
  }, { threshold: 0.1 });
  all('.shows .section-heading,.band .section-heading,.band-copy,.newsletter-content,.show-card').forEach(node => {
    node.classList.add('animate-in'); observer.observe(node);
  });
}
export function initEffects(): void {
  initPhotoTextures(); initNewsletterTextures(); initParallax(); initSmoke(); initEntrances();
}
