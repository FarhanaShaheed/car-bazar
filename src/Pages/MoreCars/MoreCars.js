import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Navigation from '../Home/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import Car from './../Car/Car';

/* Inventory. Reads the hero's search filters from the query string
   (?make=&condition=&max=) so the homepage console actually does something. */

const MoreCars = () => {
  const [cars, setCars] = useState([]);
  const history = useHistory();
  const { search } = useLocation();

  useEffect(() => {
    fetch('http://localhost:5000/cars')
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()))
      .then((data) => setCars(data))
      .catch(() => setCars([]));
  }, []);

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const make = params.get('make');
  const condition = params.get('condition');
  const max = Number(params.get('max')) || 0;

  const visible = cars.filter(
    (c) =>
      (!make || String(c.name || '').startsWith(make)) &&
      (!condition || c.condition === condition) &&
      (!max || (Number(c.price) || 0) <= max)
  );

  const chips = [
    make && { key: 'make', label: make },
    condition && { key: 'condition', label: `${condition} condition` },
    max && { key: 'max', label: `Up to $${max.toLocaleString()}` },
  ].filter(Boolean);

  const drop = (key) => {
    const next = new URLSearchParams(search);
    next.delete(key);
    history.replace(`/morecars${next.toString() ? `?${next}` : ''}`);
  };

  return (
    <>
      <Navigation />
      <section className="cb-section" style={{ paddingTop: 130 }}>
        <div className="cb-wrap cb-center">
          <span className="cb-eyebrow">Full inventory</span>
          <h2 className="cb-h2">Available Cars</h2>
          <p className="cb-sub">
            {chips.length
              ? `${visible.length} of ${cars.length} cars match your search.`
              : 'Every car is certified, inspected and ready for an instant online booking.'}
          </p>

          {chips.length > 0 && (
            <div className="cb-filters">
              {chips.map((c) => (
                <button type="button" key={c.key} className="cb-filter" onClick={() => drop(c.key)}>
                  {c.label} <i className="fas fa-times" />
                </button>
              ))}
              <button type="button" className="cb-filter-clear" onClick={() => history.replace('/morecars')}>
                Clear all
              </button>
            </div>
          )}

          {visible.length > 0 ? (
            <div className="cb-grid-3">
              {visible.map((car) => <Car key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="cb-empty">
              <i className="fas fa-car-side" />
              <h3>No cars match those filters</h3>
              <p>Try widening the budget or clearing a filter — new stock lands every week.</p>
              <button type="button" className="cb-btn cb-btn-dark" onClick={() => history.replace('/morecars')}>
                Show all cars
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MoreCars;
