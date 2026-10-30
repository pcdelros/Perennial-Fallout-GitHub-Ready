import { initPlayer } from './player';
import { initNavigation } from './navigation';
import { initLinks } from './links';
import { initNewsletter } from './newsletter';
import { initEffects } from './effects';
import { initAudioReactiveGlow } from './audio-reactive';

function init(): void {
  initPlayer();
  initNavigation();
  initLinks();
  initNewsletter();
  initEffects();
  initAudioReactiveGlow();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
