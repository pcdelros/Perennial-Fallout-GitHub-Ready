import members from './members.json';

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
  // Add only confirmed appearances here. When empty, Shows displays the signup state.
  shows: [],
  members
};
