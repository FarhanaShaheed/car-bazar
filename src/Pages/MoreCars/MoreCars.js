import React, { useEffect, useState } from 'react';
import Navigation from '../Home/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import Car from './../Car/Car';

const MoreCars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cars')
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()))
      .then((data) => setCars(data))
      .catch(() => setCars([]));
  }, []);

  return (
    <>
      <Navigation />
      <section className="cb-section" style={{ paddingTop: 130 }}>
        <div className="cb-wrap cb-center">
          <span className="cb-eyebrow">Full inventory</span>
          <h2 className="cb-h2">Available Cars</h2>
          <p className="cb-sub">Every car is certified, inspected and ready for an instant online booking.</p>
          <div className="cb-grid-3">
            {cars.map((car) => <Car key={car._id} car={car} />)}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MoreCars;
