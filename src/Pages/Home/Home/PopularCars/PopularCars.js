import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Car from '../../../Car/Car';
import '../../Home/PopularCars/PopularCars.css';

const PopularCars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cars')
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()))
      .then((data) => setCars(data))
      .catch(() => setCars([]));
  }, []);

  return (
    <section className="cb-section" id="cars">
      <div className="cb-wrap cb-center">
        <span className="cb-eyebrow">Hand-picked for you</span>
        <h2 className="cb-h2">Most Demanded Cars</h2>
        <p className="cb-sub">Every listing is inspected, photographed and priced against the market.</p>
        <div className="cb-grid-3">
          {cars.slice(0, 6)?.map((car) => <Car key={car._id} car={car} />)}
        </div>
        <Link to="/morecars" className="cb-btn cb-btn-dark" style={{ marginTop: 40 }}>See every car →</Link>
      </div>
    </section>
  );
};

export default PopularCars;
