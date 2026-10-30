import { get, reduced } from './dom';

/** One 45-second preview starting 3:03 from the end of the track.
 *  Seeking preserves the previous play/pause state across desktop and iOS Safari. */
export function initPlayer(): void {
  const audio = get<HTMLAudioElement>('#featured-audio');
  const playButton = get<HTMLButtonElement>('#play-pause');
  const headerButton = get<HTMLButtonElement>('#nav-audio');
  const seek = get<HTMLInputElement>('#track-progress');
  const status = get<HTMLElement>('#player-feedback');
  const remaining = get<HTMLElement>('#remaining-time');
  const length = 45;
  const initialRemaining = 183;
  let previewStart = 0;
  let previewEnd = length;
  let ready = false;
  let finished = false;
  let seeking = false;
  let awaitingMetadata: number | null = null;
  let seekWasPlaying = false;
  let seekingValue = 0;

  function format(seconds: number): string {
    const value = Math.max(0, Math.ceil(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  }
  function span(): number { return Math.max(.001, previewEnd - previewStart); }
  function clampValue(value: number): number {
    return Math.max(0, Math.min(1000, Number.isFinite(value) ? value : 0));
  }
  function showPosition(value: number): void {
    const normalized = clampValue(value);
    seek.value = String(Math.round(normalized));
    seek.style.setProperty('--seek-progress', `${normalized / 10}%`);
    const elapsed = normalized / 1000 * span();
    remaining.textContent = format(span() - elapsed);
    seek.setAttribute('aria-valuetext', `${Math.round(elapsed)} seconds of ${Math.round(span())}`);
  }
  function applySeek(normalized: number): void {
    const value = clampValue(normalized);
    showPosition(value);
    if (!ready) {
      awaitingMetadata = value;
      if (audio.networkState === HTMLMediaElement.NETWORK_EMPTY) audio.load();
      return;
    }
    awaitingMetadata = null;
    seekingValue = value;
    // Seeking *within* the preview must not pause the track. The endpoint
    // is handled naturally by the timeupdate/end guard during playback.
    finished = value === 1000;
    try { audio.currentTime = previewStart + value / 1000 * span(); }
    catch { awaitingMetadata = value; }
  }
  function configure(): void {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    previewStart = Math.max(0, audio.duration - initialRemaining);
    previewEnd = Math.min(audio.duration, previewStart + length);
    if (!ready) {
      ready = true;
      const requested = awaitingMetadata;
      awaitingMetadata = null;
      if (requested !== null) applySeek(requested);
      else { audio.currentTime = previewStart; showPosition(0); }
    } else if (!seeking) updateSeek();
  }
  function updateSeek(): void {
    if (seeking) return; // Do not fight the user's finger/mouse during a drag.
    const seconds = Math.max(0, Math.min(span(), (audio.currentTime || 0) - previewStart));
    showPosition(seconds / span() * 1000);
  }
  function sync(): void {
    const playing = !audio.paused && !audio.ended;
    playButton.classList.toggle('is-playing', playing);
    headerButton.classList.toggle('is-playing', playing);
    playButton.setAttribute('aria-label', playing ? 'Pause song' : 'Play song');
    headerButton.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    headerButton.setAttribute('aria-pressed', String(playing));
    playButton.title = playing ? 'Pause song' : 'Play song';
    headerButton.title = playing ? 'Pause music' : 'Play music';
    playButton.classList.remove('just-toggled');
    if (!reduced.matches && !seeking) {
      void playButton.offsetWidth;
      playButton.classList.add('just-toggled');
    }
    status.textContent = playing ? 'Music playing' : 'Music paused';
  }
  async function toggle(): Promise<void> {
    if (!audio.paused && !audio.ended) { audio.pause(); return; }
    if (!ready) configure();
    if (finished || audio.ended || (ready && (audio.currentTime < previewStart || audio.currentTime >= previewEnd - .02))) {
      audio.currentTime = previewStart;
      finished = false;
    }
    try { await audio.play(); }
    catch { status.textContent = 'Cannot play audio. Please check your browser settings.'; }
  }
  playButton.addEventListener('click', toggle);
  headerButton.addEventListener('click', toggle);
  for (const event of ['play', 'pause', 'ended', 'emptied']) audio.addEventListener(event, sync);
  audio.addEventListener('loadedmetadata', configure);
  audio.addEventListener('durationchange', configure);
  audio.addEventListener('timeupdate', () => {
    if (seeking || !ready) return;
    if (audio.currentTime >= previewEnd - .04) {
      if (audio.currentTime > previewEnd) audio.currentTime = previewEnd;
      finished = true;
      if (audio.loop) { finished = false; audio.currentTime = previewStart; }
      else if (!audio.paused) audio.pause();
    }
    updateSeek();
  });
  for (const event of ['seeked', 'ended']) audio.addEventListener(event, updateSeek);

  function beginScrub(): void {
    if (seeking) return;
    seeking = true;
    seekWasPlaying = !audio.paused && !audio.ended;
    seekingValue = clampValue(Number(seek.value));
  }
  function scrub(): void {
    if (!seeking) beginScrub();
    seekingValue = clampValue(Number(seek.value));
    // The slider visual follows the user's gesture immediately, even when
    // Safari hasn't loaded metadata yet. The audio time follows once ready.
    applySeek(seekingValue);
  }
  function endScrub(): void {
    if (!seeking) return;
    const shouldContinue = seekWasPlaying;
    const lastValue = seekingValue;
    applySeek(lastValue);
    seeking = false;
    // Safari can pause HTML audio when its media position jumps; resume only
    // if the user was already playing when the scrub began, never autoplay.
    if (shouldContinue && lastValue < 1000 && audio.paused && ready) {
      void audio.play().catch(() => {
        status.textContent = 'Tap play to continue the preview.';
      });
    }
    updateSeek();
  }
  seek.addEventListener('pointerdown', beginScrub);
  seek.addEventListener('input', scrub);
  seek.addEventListener('change', endScrub); // Keyboard, tap, touch and mouse commits.
  seek.addEventListener('pointerup', endScrub);
  seek.addEventListener('pointercancel', endScrub);
  seek.addEventListener('blur', endScrub);
  // A touch-end fallback also covers older Safari versions without pointer events.
  seek.addEventListener('touchend', endScrub, { passive:true });

  const restart = (): void => { finished = false; applySeek(0); if (!seeking) updateSeek(); };
  get<HTMLButtonElement>('#previous').addEventListener('click', restart);
  get<HTMLButtonElement>('#next').addEventListener('click', restart);
  const repeat = get<HTMLButtonElement>('#repeat');
  repeat.addEventListener('click', () => {
    audio.loop = !audio.loop;
    repeat.classList.toggle('is-on', audio.loop);
    repeat.setAttribute('aria-pressed', String(audio.loop));
    repeat.setAttribute('aria-label', audio.loop ? 'Disable repeat' : 'Enable repeat');
  });
  const volumeBox = get<HTMLElement>('#volume-control');
  const volumeButton = get<HTMLButtonElement>('#mute');
  const volumePanel = get<HTMLElement>('#volume-panel');
  const slider = get<HTMLInputElement>('#volume-range');
  audio.volume = 0.75;
  function syncVolume(): void {
    const effective = audio.muted ? 0 : Math.round(audio.volume * 100);
    slider.value = String(effective);
    slider.setAttribute('aria-valuetext', `${effective} percent`);
    volumeButton.classList.toggle('is-muted', effective === 0);
  }
  function showVolume(open: boolean): void {
    volumeBox.classList.toggle('is-open', open);
    volumeButton.setAttribute('aria-expanded', String(open));
    volumePanel.setAttribute('aria-hidden', String(!open));
    volumePanel.inert = !open;
    if (open) slider.focus({ preventScroll: true });
  }
  volumeButton.addEventListener('click', () => showVolume(!volumeBox.classList.contains('is-open')));
  slider.addEventListener('input', () => {
    audio.volume = Number(slider.value) / 100;
    audio.muted = audio.volume === 0;
    syncVolume();
  });
  audio.addEventListener('volumechange', syncVolume);
  document.addEventListener('pointerdown', event => {
    if (!volumeBox.contains(event.target as Node) && volumeBox.classList.contains('is-open')) showVolume(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && volumeBox.classList.contains('is-open')) {
      showVolume(false); volumeButton.focus();
    }
  });
  syncVolume(); sync(); updateSeek(); configure();
}
