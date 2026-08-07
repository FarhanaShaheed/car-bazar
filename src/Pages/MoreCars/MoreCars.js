import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Navigation from '../Home/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import Pagination from '../Shared/Pagination/Pagination';
import Car from './../Car/Car';
import loadCars from '../../utils/carsSource';

/* Inventory. Reads the hero's search filters from the query string
   (?make=&condition=&max=) so the homepage console actually does something. */

const PER_PAGE = 9;

const MoreCars = () => {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);
  const history = useHistory();
  const { search } = useLocation();

  useEffect(() => {
    loadCars().then(setCars);
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

  // a changed filter set means the old page number is meaningless
  useEffect(() => { setPage(1); }, [search]);

  const shown = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const changePage = (n) => {
    setPage(n);
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
            <>
              <div className="cb-grid-3" ref={gridRef}>
                {shown.map((car) => <Car key={car._id} car={car} />)}
              </div>
              <Pagination page={page} pageSize={PER_PAGE} total={visible.length} onChange={changePage} />
            </>
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
