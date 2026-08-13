import API_BASE from './api';
/* Single place that answers "what cars exist?".
   Real API first; if it is not running we fall back to the seed catalogue in
   public/cars.json and merge anything the admin added in demo mode, so a car
   added in the dashboard actually shows up in the showroom and the tables. */

const API = `${API_BASE}/cars`;
const DEMO_KEY = 'cb_demo_cars';

export const readDemoCars = () => {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]'); } catch (e) { return []; }
};

export const removeDemoCar = (id) => {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(readDemoCars().filter((c) => c._id !== id)));
  } catch (e) { /* storage unavailable */ }
};

const loadCars = () =>
  fetch(API)
    .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
    .catch(() =>
      fetch(process.env.PUBLIC_URL + '/cars.json')
        .then((r) => r.json())
        // newest first so a just-added car is immediately visible
        .then((seed) => [...readDemoCars(), ...(Array.isArray(seed) ? seed : [])])
    )
    .then((list) => (Array.isArray(list) ? list : []))
    .catch(() => readDemoCars());

export default loadCars;
