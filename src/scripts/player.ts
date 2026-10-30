import { get, reduced } from './dom';

/** One 45-second preview, starting 3:03 before the file ends. Native audio is source of truth. */
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
  function format(seconds: number): string {
    const value = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
  }
  function configure(): void {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    previewStart = Math.max(0, audio.duration - initialRemaining);
    previewEnd = Math.min(audio.duration, previewStart + length);
    if (!ready) { ready = true; audio.currentTime = previewStart; }
    updateSeek();
  }
  function updateSeek(): void {
    const windowLength = Math.max(0.001, previewEnd - previewStart);
    const seconds = Math.max(0, Math.min(windowLength, (audio.currentTime || 0) - previewStart));
    const value = Math.round(seconds / windowLength * 1000);
    seek.value = String(value);
    seek.style.setProperty('--seek-progress', `${value / 10}%`);
    remaining.textContent = format(Math.max(0, (previewEnd - previewStart) - seconds));
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
    if (!reduced.matches) { void playButton.offsetWidth; playButton.classList.add('just-toggled'); }
    status.textContent = playing ? 'Music playing' : 'Music paused';
  }
  async function toggle(): Promise<void> {
    if (!audio.paused && !audio.ended) { audio.pause(); return; }
    if (!ready) configure();
    if (finished || audio.ended || audio.currentTime < previewStart || audio.currentTime >= previewEnd - 0.02) {
      audio.currentTime = previewStart; finished = false;
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
    if (audio.currentTime >= previewEnd - 0.04) {
      if (audio.currentTime > previewEnd) audio.currentTime = previewEnd;
      finished = true;
      if (audio.loop) { finished = false; audio.currentTime = previewStart; }
      else if (!audio.paused) audio.pause();
    }
    updateSeek();
  });
  for (const event of ['loadedmetadata', 'durationchange', 'seeked', 'ended']) audio.addEventListener(event, updateSeek);
  seek.addEventListener('input', () => {
    if (!ready) return;
    audio.currentTime = previewStart + Number(seek.value) / 1000 * (previewEnd - previewStart);
    finished = audio.currentTime >= previewEnd - 0.04;
    if (finished && !audio.paused && !audio.loop) audio.pause();
    updateSeek();
  });
  const restart = (): void => { finished = false; audio.currentTime = previewStart; updateSeek(); };
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
