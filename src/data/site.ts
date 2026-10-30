/** Content is centralized here until the planned Sanity CMS integration is connected. */
export interface Show {
  venue: string;
  date: string;
  city: string;
  time: string;
  ticketsUrl: string;
  start: string;
  end: string;
}
export interface Member { name: string; role: string; image: string; alt: string; }
export interface SiteConfig {
  songTitle: string;
  artist: string;
  audioPath: string;
  buyTrackUrl: string;
  allMusicUrl: string;
  newsletterEndpoint: string;
  socials: Record<string, string>;
  shows: Show[];
  members: Member[];
}
export const siteConfig: SiteConfig = {
  songTitle: 'The Way',
  artist: 'Perennial Fallout',
  audioPath: '/assets/audio/the-way.mp3',
  buyTrackUrl: '',
  allMusicUrl: '',
  newsletterEndpoint: '', // Will be handled by a future Cloudflare Worker, not in this release.
  socials: { Spotify: '', 'Apple Music': '', YouTube: '', Facebook: '' },
  // Sample shows: VERIFY with the band before publishing or sharing reminders.
  shows: [
    { venue: 'The Rebel Lounge', date: 'November 12, 2026', city: 'Phoenix, AZ', time: '8:00 PM – 10:00 PM', ticketsUrl: '', start: '2026-11-12T20:00:00-07:00', end: '2026-11-12T22:00:00-07:00' },
    { venue: 'The Van Buren', date: 'December 6, 2026', city: 'Phoenix, AZ', time: '8:00 PM – 10:00 PM', ticketsUrl: '', start: '2026-12-06T20:00:00-07:00', end: '2026-12-06T22:00:00-07:00' },
    { venue: 'Marquee Theatre', date: 'January 12, 2027', city: 'Tempe, AZ', time: '8:00 PM – 10:00 PM', ticketsUrl: '', start: '2027-01-12T20:00:00-07:00', end: '2027-01-12T22:00:00-07:00' }
  ],
  members: [
    { name: 'John Smith', role: 'Drums', image: '/assets/images/member-drums.webp', alt: 'Drummer performing on stage' },
    { name: 'John Smith', role: 'Guitar', image: '/assets/images/member-guitar-1.webp', alt: 'Guitarist performing on stage' },
    { name: 'John Smith', role: 'Vocalist', image: '/assets/images/member-vocalist.webp', alt: 'Vocalist singing on stage' },
    { name: 'John Smith', role: 'Guitar', image: '/assets/images/member-guitar-2.webp', alt: 'Guitarist playing a guitar' },
    { name: 'John Smith', role: 'Bass', image: '/assets/images/member-bass.webp', alt: 'Bass player performing on stage' }
  ]
};
