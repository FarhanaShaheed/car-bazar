import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../../images/banner.jfif';

const Banner = () => {
  return (
    <section className="cb-hero" id="home">
      <div className="cb-wrap cb-hero-grid">
        <div>
          <span className="cb-eyebrow">Certified pre-owned marketplace</span>
          <h1>Find your next car.<br /><span className="accent">Book it in minutes.</span></h1>
          <p className="cb-hero-lead">
            Hand-checked used cars with transparent pricing, inspection reports and
            instant online booking — from first click to first drive.
          </p>
          <div className="cb-hero-ctas">
            <Link to="/morecars" className="cb-btn cb-btn-amber">Browse all cars</Link>
            <a href="#reviews" className="cb-btn cb-btn-ghost">What buyers say</a>
          </div>
          <div className="cb-hero-stats">
            <div className="cb-stat"><b>350+</b><span>Cars sold</span></div>
            <div className="cb-stat"><b>120-point</b><span>Inspection</span></div>
            <div className="cb-stat"><b>4.9★</b><span>Buyer rating</span></div>
          </div>
        </div>
        <div className="cb-hero-visual">
          <img className="cb-hero-img" src={banner} alt="Featured car" />
          <div className="cb-chip cb-chip-1">
            <span className="ic"><i className="fas fa-shield-alt" /></span>
            <span>Certified quality<small>120-point check</small></span>
          </div>
          <div className="cb-chip cb-chip-2">
            <span className="ic"><i className="fas fa-bolt" /></span>
            <span>Instant booking<small>reserve online</small></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
