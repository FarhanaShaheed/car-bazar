# Changelog

All notable changes to Car Bazar. Format loosely follows Keep a Changelog.

## [2.7.0] — 2026-08-13 — One switch to a real database
### Changed
- All 15 hardcoded `http://localhost:5000` calls now go through **`src/utils/api.js`**
  (`API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'`). Pointing the
  app at a hosted Express/MongoDB server is now one build-time variable instead of a
  code edit in 10 files.

## [2.6.0] — 2026-08-13 — Real booking flow (validation + payment method)
### Fixed
- **Phone numbers accepted letters.** `gzgug` passed straight through and was saved as a
  contact number. The field now rejects letters outright and explains why, and also
  catches too-short (<7 digits) and too-long (>15 digits) input.
### Added
- **Full reservation form** (`src/Pages/Booking/Booking.js`, `cb-bk-*` styles) in four
  numbered sections: your details (name, date of birth with an 18+ check, email, phone),
  billing address (street, postcode, city, country), collection (date — future only —
  plus a time slot, trade-in request, notes) and **payment method**.
- **Payment methods**: bank transfer, financing (shows an indicative monthly figure),
  card on collection, cash on collection — plus a money summary with a **10% refundable
  reservation deposit**. No card or bank numbers are collected on the page by design.
- Every field validates on blur and on submit; the first invalid field is scrolled to and
  focused, and a summary banner appears. Terms must be accepted.
- Bookings now carry a **reference code** (e.g. `CB-RDGFB1`), address, collection slot,
  payment method and deposit; *My Orders* and *Manage Orders* show the new columns.

## [2.5.0] — 2026-08-07 — README requirements audited & closed
### Fixed
- **Reviews never reached the home page.** `AddReviews` wrote to `cb_demo_reviews`
  but the home section only read `public/reviews.json`, so the README's "review shows
  dynamically in the home page" did not hold in demo mode. Added
  `src/utils/reviewsSource.js` (API → seed + demo reviews, newest first).
- **Forms captured values on blur**, so submitting straight from the last field
  (Enter key) used stale state — registering that way always said "Your passwords did
  not match". Register, Login, Booking and Make Admin now use `onChange`.
### Changed
- Review rating is a **5-star picker** (hover preview, keyboard-reachable, defaults to
  5) instead of a number to type.

## [2.4.0] — 2026-08-07 — Condition is now a picker
### Changed
- **Add Product → Condition** is a set of selectable option cards (Like new /
  Excellent / Very good / Good, each with a hint) instead of a free-text field.
  Defaults to *Excellent*, resets to it after a submit, and is a real `radiogroup`
  so it works with keyboard and screen readers. Typos used to create one-off values
  that then showed up as their own entry in the hero's condition filter.
### Fixed
- Cars added by an admin in demo mode were written to `cb_demo_cars` but **never
  read back** — they appeared nowhere. `src/utils/carsSource.js` is now the single
  loader (API → `public/cars.json` + demo additions, newest first) used by the hero,
  Most Demanded Cars, the inventory page, the 3D showroom and Manage Products.
  Deleting such a car in Manage Products now also removes it from localStorage.

## [2.3.0] — 2026-08-07 — Pagination + bigger catalogue
### Added
- **Pagination** (`src/Pages/Shared/Pagination/Pagination.js`, `cb-pager` styles):
  numbered pages with ellipsis, prev/next, disabled edges, a "showing x–y of z" line
  and a smooth scroll back to the grid. Used by *Most Demanded Cars* (6 per page) and
  the inventory page (9 per page, resets to page 1 when the filters change).
- **9 more cars** in `public/cars.json` (6 → 15), adding Audi, Toyota, Volvo, Skoda,
  Ford, Hyundai, Kia, Nissan and Peugeot to the hero's make filter, plus a new "Good"
  condition. Photos are **public-domain / CC0** (Wikimedia Commons), downloaded to
  `public/cars/` and compressed to ~130–240 KB each — served from our own origin
  rather than hot-linked.
- `src/utils/carImage.js` resolves repo-local image paths against `PUBLIC_URL`;
  car card images are now `loading="lazy"`.

## [2.2.0] — 2026-08-07 — New hero: inventory search console
### Added
- Hero rebuilt around a **working search console** (`cb-hx-*` in `src/index.css`,
  `src/Pages/Home/Banner/Banner.js`): make / condition / budget controls whose button
  shows the live match count and hands the filters to `/morecars` via the query string.
- Full-bleed cinematic stage with mouse parallax, animated light-trail streaks, a
  headline that rotates through the **makes actually in stock**, quick-pick chips and a
  "just listed" inventory ticker built from the real car data.
- `/morecars` now reads `?make=&condition=&max=`, shows removable filter chips, an
  "x of y cars match" count and a proper empty state.
### Changed
- Dropped the old split hero (image + floating chips) — it was structurally identical
  to the other portfolio projects' heroes.

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
