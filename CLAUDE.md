# Car Bazar — project guide (for Claude & future me)

Full-stack **used-car marketplace**. React (CRA) client + Express/MongoDB API.
Part of Farhana Binta Shaheed's portfolio → linked from her CV.

- **Live:** https://car-bazar-delta.vercel.app
- **Client repo:** github.com/FarhanaShaheed/car-bazar (this repo)
- **Server repo:** github.com/FarhanaShaheed/car-bazar-server-site

## Stack
React 17 (CRA) · react-router-dom v5 · react-bootstrap · react-hook-form ·
Firebase Auth · Express + MongoDB (separate repo) · deployed on Vercel.

## Run locally
```bash
npm install
cp .env.example .env.local     # optional: real Firebase web config
NODE_OPTIONS=--openssl-legacy-provider npm start
```
Node 17+ needs `NODE_OPTIONS=--openssl-legacy-provider` (old react-scripts + OpenSSL 3).

## Is there a database? (short answer: the code yes, the live demo no)
A complete **Express + MongoDB** API exists in `../car-bazar-server-site` (`index.js`):
collections `cars`, `bookings`, `users`, `reviews` with full CRUD + an admin-role endpoint.
It is **not hosted anywhere and has no credentials** (`.env.example` only — the original
Atlas cluster is dead), so the live site never reaches it and falls back to
`public/cars.json` / `public/reviews.json` + localStorage.

**To switch to a real database — three steps, no code changes:**
1. Free MongoDB Atlas cluster → put the URI in `car-bazar-server-site/.env` as `MONGO_URI`.
2. Host that server (Render free tier works) → note its URL.
3. Build the client with `REACT_APP_API_URL=https://…` (see `src/utils/api.js`).
Every request goes through `API_BASE` from `src/utils/api.js` — there are no hardcoded
hosts left in the app, so that one variable flips the whole thing over.

## 🔐 Authentication (REAL Firebase since 2026-08-13)
`.env.local` (gitignored, **build-time** — CRA inlines it, Vercel env vars do nothing
because we deploy a prebuilt folder) holds her Firebase web config, currently the
existing **medicate-diagnostic-center** project. Everyone registers/logs in for real.

**Roles:** `admin` = `GET /users/:email` says so (needs the API) **or** the email is in
`REACT_APP_ADMIN_EMAILS`. Everyone else is a customer; `AdminRoute` guards the pages.

**Her console still needs:** add `car-bazar-farhana.vercel.app` under Authentication →
Settings → **Authorized domains**, or Google Sign-In returns `auth/unauthorized-domain`
(email/password already works from any domain).

To move Car Bazar to its own Firebase project, swap the six values in `.env.local` and
rebuild — nothing else changes.

## ⭐ Demo mode (only when no Firebase keys are present)
`src/Pages/Login/Firebase/Firebase.config.js` exports `isFirebaseConfigured`
(= `Boolean(apiKey)`). `src/hooks/useFirebase.js` runs **dual mode**:
- **Keys present** → real Firebase Auth + the Express API (original behaviour).
- **No keys** → localStorage demo auth: *any* email+password logs in, the session
  persists, and the demo user is an **admin** so the whole dashboard is explorable.
Data follows the same idea: every `fetch('http://localhost:5000/...')` keeps the real
call and `.catch()`s to `public/cars.json` / `public/reviews.json`, or to
localStorage (`cb_demo_bookings`, `cb_demo_cars`, `cb_demo_reviews`) for writes.
**Adding real Firebase keys + a running API switches everything back automatically —
no code changes.**

### Adding cars
Every list of cars comes from **`src/utils/carsSource.js`** (`loadCars()`): real API
first, else `public/cars.json` **plus** anything an admin added in demo mode
(`cb_demo_cars`), newest first. Use it — don't re-implement the fetch/fallback.

Append an object to `public/cars.json`: `_id`, `name` (**first word is the make** —
that's what the hero's make filter groups on), `img`, `price`, `condition`
(`Like new` / `Excellent` / `Very good` / `Good` — the Add Product form offers exactly
these four via `CONDITIONS` in `AddProduct.js`; keep the two lists in step, since the
hero's condition filter is built from whatever strings exist in the data),
`description`. Photos go in `public/cars/<slug>.jpg` referenced as
`/cars/<slug>.jpg` (`src/utils/carImage.js` adds `PUBLIC_URL`); remote URLs work too.
Keep them **public-domain / CC0** (Wikimedia Commons has model-accurate ones) and
compress to ≲250 KB: `sips -s format jpeg -s formatOptions 68 -Z 900 in.jpg --out out.jpg`.
Pagination adapts on its own — no code change needed.

## Design system
`src/index.css` holds everything (loaded *after* bootstrap in `src/index.js` so it wins
the cascade). Tokens: deep ink `#0f1115` + amber `#ff9f1c`, Plus Jakarta Sans.
- Public site: `cb-*` classes (hero, cards, reviews, footer, auth).
- 3D showroom: `src/Pages/Home/Showroom3D/Showroom3D.js` (mouse-tilt perspective card,
  `translateZ` floating badges).
- **Admin panel:** `ad-*` classes + `src/Pages/DashBoard/ui/AdminUI.js`
  (`StatCard` with count-up + 3D tilt, animated SVG `LineChart`, CSS `BarChart`).
- **Hero:** `cb-hx-*` classes + `src/Pages/Home/Banner/Banner.js` — full-bleed stage
  (parallax background, light-trail streaks, make-rotating headline, inventory ticker)
  with a search console that pushes `?make=&condition=&max=` to `/morecars`, which
  filters on those params. Keep it visually distinct from the other portfolio projects
  (doctors-portal / tour-booking use the split image + floating chips layout).
  The old `.cb-hero*` rules are dead code kept only for reference.
- **Booking:** `cb-bk-*` classes + `src/Pages/Booking/Booking.js` — four-section
  reservation form with client-side validation (phone rejects letters / <7 / >15 digits,
  18+ date-of-birth check, future-only collection date), payment-method cards and a 10%
  deposit summary. Deliberately collects **no card or bank numbers** — only a chosen
  method; the dealer arranges payment afterwards. Keep it that way.
- **Contact section:** `cb-ct-*` classes (end of `index.css`) +
  `src/Pages/Home/ContactUs/ContactUs.js` — dark info rail + floating-label form with
  topic chips, validation and a success state (writes to `cb_demo_messages` in
  localStorage), then a tilt-on-hover map card with a pulsing pin. Below 720px the
  map's floating info card becomes a static block so it stops covering the map.
- Legacy per-component `.css` files were emptied on purpose — don't restore them.
- All animation respects `prefers-reduced-motion`.

## Deploy
Build first, deploy the **prebuilt** folder (remote builds fail on old react-scripts):
```bash
NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build
cd build && npx vercel deploy --prod --yes --scope <scope> --token=<token>
```
Vercel project must have `framework:null` (else it re-runs react-scripts → exit 127)
and `ssoProtection:null` (else visitors hit a login wall). `public/vercel.json` adds
SPA rewrites so `/morecars`, `/login`, … work on refresh.

## Still to do
- Real Firebase web config + a hosted API (e.g. Render) to leave demo mode.
- Payment page is a UI prototype (no real Stripe).
