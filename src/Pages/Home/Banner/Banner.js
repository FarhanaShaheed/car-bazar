import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import banner from '../../images/banner.jfif';
import loadCars from '../../../utils/carsSource';

/* Hero — "search console" concept (2026).
   Full-bleed cinematic stage + a working inventory search that hands its
   filters to /morecars via the query string, a rotating make in the headline
   and a live inventory ticker. Deliberately NOT the split-image-with-floating-
   chips layout used elsewhere. */

const FALLBACK_MAKES = ['BMW', 'Mercedes', 'Audi', 'Toyota'];

const Banner = () => {
  const history = useHistory();
  const [cars, setCars] = useState([]);
  const [make, setMake] = useState('any');
  const [condition, setCondition] = useState('any');
  const [maxPrice, setMaxPrice] = useState(0);
  const [rot, setRot] = useState(0);
  const stageRef = useRef(null);
  const [par, setPar] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadCars().then(setCars);
  }, []);

  const makes = useMemo(
    () => [...new Set(cars.map((c) => String(c.name || '').split(' ')[0]).filter(Boolean))],
    [cars]
  );
  const conditions = useMemo(
    () => [...new Set(cars.map((c) => c.condition).filter(Boolean))],
    [cars]
  );
  const ceiling = useMemo(
    () => (cars.length ? Math.ceil(Math.max(...cars.map((c) => Number(c.price) || 0)) / 5000) * 5000 : 60000),
    [cars]
  );

  useEffect(() => { setMaxPrice(ceiling); }, [ceiling]);

  // headline word rotator
  const words = makes.length ? makes : FALLBACK_MAKES;
  useEffect(() => {
    const t = setInterval(() => setRot((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);

  const matches = cars.filter(
    (c) =>
      (make === 'any' || String(c.name || '').startsWith(make)) &&
      (condition === 'any' || c.condition === condition) &&
      (Number(c.price) || 0) <= maxPrice
  ).length;

  const search = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (make !== 'any') q.set('make', make);
    if (condition !== 'any') q.set('condition', condition);
    if (maxPrice < ceiling) q.set('max', String(maxPrice));
    history.push(`/morecars${q.toString() ? `?${q}` : ''}`);
  };

  const quickPick = (patch) => {
    if (patch.make) setMake(patch.make);
    if (patch.condition) setCondition(patch.condition);
    if (patch.max) setMaxPrice(patch.max);
  };

  const onMove = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    setPar({ x: ((e.clientX - r.left) / r.width - 0.5) * -22, y: ((e.clientY - r.top) / r.height - 0.5) * -14 });
  };

  const ticker = cars.length ? [...cars, ...cars] : [];

  return (
    <section className="cb-hx" id="home" ref={stageRef} onMouseMove={onMove}>
      <div
        className="cb-hx-bg"
        style={{ backgroundImage: `url(${banner})`, transform: `scale(1.1) translate(${par.x}px, ${par.y}px)` }}
      />
      <div className="cb-hx-veil" />
      <div className="cb-hx-streaks" aria-hidden="true">
        <i style={{ '--d': '0s', top: '28%' }} />
        <i style={{ '--d': '1.1s', top: '46%' }} />
        <i style={{ '--d': '2.3s', top: '64%' }} />
      </div>

      <div className="cb-wrap cb-hx-inner">
        <span className="cb-hx-tag">
          <span className="cb-hx-dot" /> 350+ cars delivered
          <span className="cb-hx-tag-x"> · 120-point inspection</span> · 4.9★ buyers
        </span>

        <h1 className="cb-hx-title">
          Find your next{' '}
          <span className="cb-hx-rot">
            <span key={words[rot]}>{words[rot]}</span>
          </span>
          <br />
          and drive it this week.
        </h1>

        <p className="cb-hx-lead">
          Every car hand-checked, priced in the open and reservable online in
          about two minutes — no haggling, no showroom queue.
        </p>

        <form className="cb-hx-console" onSubmit={search}>
          <div className="cb-hx-f">
            <label htmlFor="hx-make">Make</label>
            <select id="hx-make" value={make} onChange={(e) => setMake(e.target.value)}>
              <option value="any">Any make</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="cb-hx-f">
            <label htmlFor="hx-cond">Condition</label>
            <select id="hx-cond" value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="any">Any condition</option>
              {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="cb-hx-f cb-hx-f-range">
            <label htmlFor="hx-max">
              Budget <b>${Number(maxPrice).toLocaleString()}</b>
            </label>
            <input
              id="hx-max"
              type="range"
              min={Math.min(10000, ceiling)}
              max={ceiling}
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="cb-btn cb-btn-amber cb-hx-go">
            <i className="fas fa-search" />
            Show {matches} {matches === 1 ? 'car' : 'cars'}
          </button>
        </form>

        <div className="cb-hx-quick">
          <span>Popular right now</span>
          {words.slice(0, 3).map((m) => (
            <button type="button" key={m} onClick={() => quickPick({ make: m })}>{m}</button>
          ))}
          <button type="button" onClick={() => quickPick({ max: 30000 })}>Under $30,000</button>
          <button type="button" onClick={() => quickPick({ condition: conditions[0] || 'Excellent' })}>
            {conditions[0] || 'Excellent'} condition
          </button>
        </div>
      </div>

      {ticker.length > 0 && (
        <div className="cb-hx-ticker" aria-hidden="true">
          <div className="cb-hx-track">
            {ticker.map((c, i) => (
              <span key={`${c._id}-${i}`}>
                <b>Just listed</b> {c.name}
                <em>${Number(c.price).toLocaleString()}</em>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
