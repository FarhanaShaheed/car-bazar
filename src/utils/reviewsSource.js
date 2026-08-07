/* Same idea as carsSource: real API first, else the seed reviews plus anything
   a logged-in user posted in demo mode — so a review written in the dashboard
   actually appears on the home page, which is what the README promises. */

const API = 'http://localhost:5000/reviews';
const DEMO_KEY = 'cb_demo_reviews';

export const readDemoReviews = () => {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]'); } catch (e) { return []; }
};

const loadReviews = () =>
  fetch(API)
    .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
    .catch(() =>
      fetch(process.env.PUBLIC_URL + '/reviews.json')
        .then((r) => r.json())
        // newest first: a just-posted review should be the first one seen
        .then((seed) => [...readDemoReviews().reverse(), ...(Array.isArray(seed) ? seed : [])])
    )
    .then((list) => (Array.isArray(list) ? list : []))
    .catch(() => readDemoReviews());

export default loadReviews;
