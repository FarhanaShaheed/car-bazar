# Changelog

All notable changes to Car Bazar. Format loosely follows Keep a Changelog.

## [2.1.0] — 2026-08-07 — Contact section rebuilt
### Added
- **New contact experience** (`src/Pages/Home/ContactUs/ContactUs.js`, `cb-ct-*` styles
  at the end of `src/index.css`): split shell with a dark info rail (live-status pill,
  tappable call/email/showroom channels, opening hours, socials) and a white form panel.
- Enquiry **topic chips** (Buy a car · Sell my car · Book a test drive · Support),
  **floating-label** inputs, inline validation, sending state and an animated
  success panel. Messages persist to `localStorage` under `cb_demo_messages`.
- **Map card** with a pulsing location pin, gradient overlay, mouse-tilt 3D and a
  "Get directions" link to Google Maps; the info card reflows below the map on phones.
### Removed
- Leftover hotel-template fields ("Check-In 15:00 am" / "Check-Out 11:00am") that made
  no sense for a car marketplace.
### Fixed
- Contact copy overflowed the viewport on the left (bootstrap `Row.m-5` negative
  margins) — the section is now a CSS grid with no horizontal overflow at 390px.

## [2.0.0] — 2026-08-05 — Full overhaul & relaunch
### Added
- **Demo mode**: works with no backend/keys — dual-mode auth (`isFirebaseConfigured`),
  localStorage sessions, and JSON/localStorage fallbacks for every API call.
- **3D interactive showroom** section (mouse-tilt perspective card + floating badges).
- **Brand-new admin dashboard**: glass sidebar, KPI cards with animated count-ups and
  3D hover tilt, animated SVG line chart, CSS bar chart, modern data tables with
  status pills and empty states (`src/Pages/DashBoard/ui/AdminUI.js`).
- Sample data `public/cars.json`, `public/reviews.json`; SPA rewrites `public/vercel.json`.
- Scroll-reveal animations; `prefers-reduced-motion` support throughout.
### Changed
- Complete UI redesign (design system in `src/index.css`): new hero, car cards,
  reviews, footer, and redesigned Login/Register/Booking/MoreCars pages.
- Booking flow now confirms on-screen and appears in My Orders / Manage Orders.
### Fixed
- **White screen** caused by `auth/invalid-api-key` when Firebase env vars were absent.
- Dead `murmuring-island-34247.herokuapp.com` API origin (Heroku free tier is gone).
- Deep links 404'ing on static hosting (added SPA rewrites).
### Deployed
- https://car-bazar-delta.vercel.app

## [1.0.0] — 2021-12
- Original MERN course project: listings, Firebase auth, booking, admin dashboard.
