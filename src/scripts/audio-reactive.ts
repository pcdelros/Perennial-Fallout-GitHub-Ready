import { get, reduced } from './dom';

/** Subtle real audio-reactive illumination: Web Audio analyser, not a canned animation.
 *  Lazily initializes from a playback gesture, caps processing to ~24 fps, and
 *  disconnects the animation loop on pause/hidden/reduced-motion states.
 *  Audio remains playable in browsers that do not support Web Audio. */
export function initAudioReactiveGlow(): void {
  const hero = get<HTMLElement>('.hero');
  const audio = get<HTMLAudioElement>('#featured-audio');
  const buttons = [get<HTMLButtonElement>('#play-pause'), get<HTMLButtonElement>('#nav-audio')];
  type AudioContextConstructor = typeof AudioContext;
  const supported: AudioContextConstructor | undefined = window.AudioContext ??
    (window as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
  if (!supported) return;
  const AudioContextImpl: AudioContextConstructor = supported;
  let context: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let sample: Uint8Array<ArrayBuffer> | null = null;
  let frame = 0;
  let last = 0;
  let energy = 0;
  let visible = true;

  function setup(): void {
    if (context || reduced.matches) return;
    try {
      const created = new AudioContextImpl();
      const meter = created.createAnalyser();
      meter.fftSize = 512;
      meter.smoothingTimeConstant = 0.84;
      const source = created.createMediaElementSource(audio);
      source.connect(meter);
      meter.connect(created.destination);
      context = created;
      analyser = meter;
      sample = new Uint8Array(new ArrayBuffer(meter.frequencyBinCount));
    } catch { /* Existing native audio still works without the reactive layer. */ }
  }
  function cancel(): void {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    energy = 0;
    hero.style.setProperty('--audio-energy', '0');
    hero.style.setProperty('--audio-glow-opacity', '0');
  }
  function render(now: number): void {
    frame = requestAnimationFrame(render);
    if (now - last < 1000 / 24) return;
    last = now;
    if (!analyser || !sample) return;
    analyser.getByteFrequencyData(sample);
    // Low/low-mid spectrum drives glow around the red smoke, with smooth decay.
    const bins = Math.min(64, sample.length);
    let sum = 0;
    for (let i = 2; i < bins; i++) sum += sample[i];
    const avg = sum / Math.max(1, bins - 2) / 255;
    const target = Math.max(0, Math.min(1, (avg - 0.07) * 2.0));
    energy += (target - energy) * (target > energy ? 0.20 : 0.065);
    hero.style.setProperty('--audio-energy', energy.toFixed(3));
    hero.style.setProperty('--audio-glow-opacity', (energy * 0.16).toFixed(3));
  }
  function sync(): void {
    const active = !audio.paused && !audio.ended && visible && !document.hidden && !reduced.matches;
    if (!active) { cancel(); return; }
    setup();
    if (context?.state === 'suspended') void context.resume().catch(() => {});
    if (analyser && !frame) frame = requestAnimationFrame(render);
  }
  // Try setting up inside the actual user gesture, so browsers permit AudioContext.
  for (const button of buttons) {
    button.addEventListener('pointerdown', setup, { passive: true });
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') setup();
    });
  }
  for (const event of ['play', 'pause', 'ended', 'emptied']) audio.addEventListener(event, sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = !!entries[0]?.isIntersecting;
      sync();
    }, { threshold: 0 }).observe(hero);
  }
  sync();
}
