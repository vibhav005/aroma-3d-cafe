import {  BusinessInfo } from '@/types';

export const businessInfo: BusinessInfo = {
  name: 'Artisan Coffee Co.',
  address: {
    street: '123 Coffee Street',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    country: 'United States'
  },
  coordinates: {
    lat: 45.5152,
    lng: -122.6784
  },
  phone: '+1 (503) 555-CAFE',
  email: 'hello@artisancoffee.co',
  hours: {
    monday: { open: '7:00', close: '19:00' },
    tuesday: { open: '7:00', close: '19:00' },
    wednesday: { open: '7:00', close: '19:00' },
    thursday: { open: '7:00', close: '19:00' },
    friday: { open: '7:00', close: '20:00' },
    saturday: { open: '8:00', close: '20:00' },
    sunday: { open: '8:00', close: '18:00' }
  },
  socialMedia: {
    instagram: 'https://instagram.com/artisancoffeeco',
    facebook: 'https://facebook.com/artisancoffeeco',
    twitter: 'https://twitter.com/artisancoffeeco'
  }
};

// TODO: Replace with real data integrations
// - Google Places API for reviews and business info
// - Instagram API for gallery images
// - Real-time queue management system
// - CMS integration for menu items and seasonal drinks