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

## ⭐ Demo mode (why the live site works with no backend)
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

## Design system
`src/index.css` holds everything (loaded *after* bootstrap in `src/index.js` so it wins
the cascade). Tokens: deep ink `#0f1115` + amber `#ff9f1c`, Plus Jakarta Sans.
- Public site: `cb-*` classes (hero, cards, reviews, footer, auth).
- 3D showroom: `src/Pages/Home/Showroom3D/Showroom3D.js` (mouse-tilt perspective card,
  `translateZ` floating badges).
- **Admin panel:** `ad-*` classes + `src/Pages/DashBoard/ui/AdminUI.js`
  (`StatCard` with count-up + 3D tilt, animated SVG `LineChart`, CSS `BarChart`).
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
