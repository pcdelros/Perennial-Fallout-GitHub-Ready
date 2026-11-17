/** First-party browser settings only: no third-party tracking or remote requests. */
const CONSENT_KEY = 'pf_cookie_preferences_v1';
const MUSIC_KEY = 'pf_music_preferences_v1';

type MusicSettings = { volume: number; repeat: boolean };

export function getMusicPreferenceConsent(): boolean {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}').rememberMusic === true; }
  catch { return false; }
}
export function setMusicPreferenceConsent(enabled: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ rememberMusic: enabled, savedAt: new Date().toISOString() }));
    if (!enabled) localStorage.removeItem(MUSIC_KEY);
  } catch { /* Visitors can still use the site with browser storage disabled. */ }
}
export function clearMusicPreferences(): void {
  try { localStorage.removeItem(CONSENT_KEY); localStorage.removeItem(MUSIC_KEY); }
  catch { /* Browser storage may be restricted. */ }
}
export function readMusicPreferences(): MusicSettings | null {
  if (!getMusicPreferenceConsent()) return null;
  try {
    const value = JSON.parse(localStorage.getItem(MUSIC_KEY) || 'null') as MusicSettings | null;
    if (!value || typeof value.volume !== 'number' || !Number.isFinite(value.volume) || typeof value.repeat !== 'boolean') return null;
    return { volume: Math.min(1, Math.max(0, value.volume)), repeat: value.repeat };
  } catch { return null; }
}
export function saveMusicPreferences(next: MusicSettings): void {
  if (!getMusicPreferenceConsent()) return;
  try { localStorage.setItem(MUSIC_KEY, JSON.stringify(next)); }
  catch { /* Optional convenience only. */ }
}
