import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Car from '../../../Car/Car';
import Pagination from '../../../Shared/Pagination/Pagination';
import '../../Home/PopularCars/PopularCars.css';
import loadCars from '../../../../utils/carsSource';

const PER_PAGE = 6;

const PopularCars = () => {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  useEffect(() => {
    loadCars().then(setCars);
  }, []);

  const shown = cars.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const change = (n) => {
    setPage(n);
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="cb-section" id="cars">
      <div className="cb-wrap cb-center">
        <span className="cb-eyebrow">Hand-picked for you</span>
        <h2 className="cb-h2">Most Demanded Cars</h2>
        <p className="cb-sub">Every listing is inspected, photographed and priced against the market.</p>

        <div className="cb-grid-3" ref={gridRef}>
          {shown.map((car) => <Car key={car._id} car={car} />)}
        </div>

        <Pagination page={page} pageSize={PER_PAGE} total={cars.length} onChange={change} />

        <Link to="/morecars" className="cb-btn cb-btn-dark" style={{ marginTop: 34 }}>See every car →</Link>
      </div>
    </section>
  );
};

export default PopularCars;
