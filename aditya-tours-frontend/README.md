# Aditya Tours Frontend

Production-ready frontend for Aditya Tours and Travels booking platform.

## Implemented Scope

- Mobile-first React + TypeScript + Vite architecture
- Public booking system with 4-step flow:
  1. Location + trip type
  2. Date & time
  3. Customer details
  4. Summary + confirmation
- Home page sections:
  - Hero
  - Vehicle details
  - Pricing table
  - Popular routes
  - Why choose us
  - Testimonials
  - FAQ
  - Contact form
- SEO pages:
  - /thane-taxi-service
  - /thane-airport-taxi
  - /thane-outstation-cab
  - /thane-ertiga-cab
- SEO infrastructure:
  - Dynamic meta tags
  - JSON-LD structured data
  - public/robots.txt
  - public/sitemap.xml
- Admin frontend shell:
  - Login
  - Dashboard
  - Bookings
  - Calendar
  - Settings
  - Content

## Tech Stack

- React 19 + TypeScript
- React Router
- React Hook Form + Zod
- TanStack React Query
- Tailwind CSS v4
- Lucide React icons

## Setup

1. Install dependencies:
   - npm install
2. Create environment file:
   - cp .env.example .env
3. Set required values:
   - VITE_GOOGLE_MAPS_API_KEY
   - VITE_API_BASE_URL
4. Start development server:
   - npm run dev

## Validation Commands

- npm run lint
- npm run build
- npm run preview

## Notes

- Backend API integration is wired via service layer and ready for production endpoints.
- Current route estimation has fallback behavior if Google Maps API is unavailable.
