import members from './members.json';

/** Content is centralized here until the planned Sanity CMS integration is connected. */
export interface Show {
  venue: string;
  date: string;
  city: string;
  time: string;
  address: string;
  start: string;
  ticketsUrl?: string;
  end?: string;
}
export interface Member { name: string; role: string; image: string; alt: string; }
export interface SiteConfig {
  songTitle: string;
  artist: string;
  audioPath: string;
  buyTrackUrl: string;
  newsletterEndpoint: string;
  socials: Record<string, string>;
  shows: Show[];
  members: Member[];
}
export const siteConfig: SiteConfig = {
  songTitle: 'The Way',
  artist: 'Perennial Fallout',
  audioPath: '/assets/audio/the-way.mp3',
  buyTrackUrl: 'https://perennial-fallout-shop.fourthwall.com/',
  newsletterEndpoint: '/api/newsletter', // Cloudflare Pages Function (requires D1, Resend and Turnstile setup).
  socials: { Spotify: '', 'Apple Music': '', YouTube: '', Facebook: '' },
  // Confirmed dates supplied by the band on November 20, 2026.
  // No ticket seller or performance end times were provided.
  // Completed performances stay in Live Shows with a non-interactive SHOW ENDED label.
  shows: [
    { venue: 'The 44 Sports Grill', date: '2026-09-19', city: 'Glendale, AZ', time: '9:00 PM',
      address: '4494 W Peoria Ave, Glendale, AZ 85302', start: '2026-09-19T21:00:00-07:00' },
    { venue: 'The Blooze', date: '2026-09-26', city: 'Phoenix, AZ', time: '11:00 PM',
      address: '12014 N 32nd St, Phoenix, AZ 85028', start: '2026-09-26T23:00:00-07:00' },
    { venue: 'The Blooze', date: '2026-10-23', city: 'Phoenix, AZ', time: '11:00 PM',
      address: '12014 N 32nd St, Phoenix, AZ 85028', start: '2026-10-23T23:00:00-07:00' },
    { venue: 'The Blooze', date: '2026-11-20', city: 'Phoenix, AZ', time: '10:00 PM',
      address: '12014 N 32nd St, Phoenix, AZ 85028', start: '2026-11-20T22:00:00-07:00' }
  ],
  members
};
