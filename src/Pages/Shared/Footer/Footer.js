import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="cb-footer">
      <div className="cb-wrap">
        <div className="cb-footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: 12 }}>
              <span className="cb-logo"><i className="fas fa-car" /></span> Car Bazar
            </div>
            <p style={{ fontSize: '.9rem', lineHeight: 1.7 }}>
              Certified used cars with honest pricing, full inspection reports and
              instant online booking.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <Link to="/morecars">Browse cars</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div>
            <h5>Support</h5>
            <a href="tel:+0134597637">24/7 phone: +01 345 97637</a>
            <span style={{ fontSize: '.9rem', color: '#79839a' }}>
              <i className="fab fa-facebook-square" /> <i className="fab fa-twitter-square" /> <i className="fab fa-instagram-square" />
            </span>
          </div>
        </div>
        <div className="cb-footer-bottom">© {new Date().getFullYear()} Car Bazar · Built by Farhana Binta Shaheed</div>
      </div>
    </footer>
  );
};

export default Footer;
