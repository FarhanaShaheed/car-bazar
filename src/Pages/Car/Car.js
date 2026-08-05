import React from 'react';
import { Link } from 'react-router-dom';
import '../Car/Car.css';

const Car = ({ car }) => {
  const { name, img, _id, price, condition, description } = car;
  return (
    <div className="cb-card">
      <img className="cb-card-img" src={img} alt={name} />
      <div className="cb-card-body">
        <h3 className="cb-card-title">{name}</h3>
        <span className="cb-cond">{condition}</span>
        {description && <p className="cb-desc">{description}</p>}
        <div className="cb-price-row">
          <div className="cb-price">${Number(price).toLocaleString()}<small> incl. checks</small></div>
          <Link to={`/booking/${_id}`} className="cb-btn cb-btn-amber" style={{ padding: '10px 18px', fontSize: '.86rem' }}>Book</Link>
        </div>
      </div>
    </div>
  );
};

export default Car;
