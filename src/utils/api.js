/* Where the Express/MongoDB API lives.

   Local dev / demo:  nothing set -> http://localhost:5000 (the server in
   car-bazar-server-site). If that server is not running, every call fails and the
   app falls back to the seed JSON + localStorage (see carsSource.js).

   Real deployment: set REACT_APP_API_URL to the hosted server, e.g.
     REACT_APP_API_URL=https://car-bazar-api.onrender.com
   and rebuild. That single variable is the whole switch from demo data to a real
   MongoDB database — no code changes anywhere else. */
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_BASE;
