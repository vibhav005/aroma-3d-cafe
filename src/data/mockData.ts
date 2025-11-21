import {  BusinessInfo } from '@/types';

export const businessInfo: BusinessInfo = {
  name: 'Deccan Brews Cafe',
  address: {
    street: 'Shop 15/16/17, ABC Rutuja Elegancet',
    city: 'Pune',
    state: 'MH',
    zip: '411033',
    country: 'India'
  },
  coordinates: {
    lat: 18.646394673962618,
    lng: 73.76849812209049
  },
  phone: '+91 7387833732',
  email: 'cafedeccanbrews@gmail.com',
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
    instagram: 'https://www.instagram.com/deccanbrewscafe/?hl=en',
  }
};

// TODO: Replace with real data integrations
// - Google Places API for reviews and business info
// - Instagram API for gallery images
// - Real-time queue management system
// - CMS integration for menu items and seasonal drinks