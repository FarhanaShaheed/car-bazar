import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Navigation from '../Home/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';

const LS_BOOKINGS = 'cb_demo_bookings';

const Booking = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [done, setDone] = useState(false);
  const { user } = useAuth();
  const [info, setInfo] = useState({ phone: '' });

  useEffect(() => {
    fetch(`http://localhost:5000/cars/${carId}`)
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()).then((all) => all.find((c) => c._id === carId)))
      .then((data) => setCar(data || null))
      .catch(() => setCar(null));
  }, [carId]);

  const submit = (e) => {
    e.preventDefault();
    const booking = {
      _id: 'b' + Date.now(),
      displayName: info.displayName || user.displayName,
      email: info.email || user.email,
      phone: info.phone,
      carName: car?.name, carPrice: car?.price, img: car?.img,
      status: 'pending', date: new Date().toISOString().slice(0, 10),
    };
    // try the real API, fall back to localStorage (demo)
    fetch('http://localhost:5000/bookings', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(booking),
    }).then((r) => { if (!r.ok) throw new Error('api'); setDone(true); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]');
          all.push(booking); localStorage.setItem(LS_BOOKINGS, JSON.stringify(all));
        } catch {}
        setDone(true);
      });
  };

  return (
    <>
      <Navigation />
      <section className="cb-section" style={{ paddingTop: 130, minHeight: '80vh' }}>
        <div className="cb-wrap">
          {!car ? (
            <p className="cb-sub">Loading car…</p>
          ) : done ? (
            <div className="cb-auth-card" style={{ margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: '2.6rem' }}>✅</div>
              <h2>Booking received!</h2>
              <p className="sub">{car.name} — ${Number(car.price).toLocaleString()}. We saved your request; you can review it in your dashboard.</p>
              <Link to="/dashboard" className="cb-btn cb-btn-amber" style={{ justifyContent: 'center' }}>Go to dashboard</Link>
            </div>
          ) : (
            <div className="cb-grid-3" style={{ gridTemplateColumns: '1.1fr .9fr', alignItems: 'start', gap: 34 }}>
              <div className="cb-card">
                <img className="cb-card-img" style={{ height: 300 }} src={car.img} alt={car.name} />
                <div className="cb-card-body">
                  <h2 className="cb-card-title" style={{ fontSize: '1.4rem' }}>{car.name}</h2>
                  <span className="cb-cond">{car.condition}</span>
                  <p className="cb-desc">{car.description}</p>
                  <div className="cb-price">${Number(car.price).toLocaleString()}</div>
                </div>
              </div>
              <div className="cb-auth-card" style={{ maxWidth: 'none' }}>
                <h2>Book this car</h2>
                <p className="sub">Confirm your details — we'll get back within 24h.</p>
                <form onSubmit={submit}>
                  <input type="text" name="displayName" defaultValue={user.displayName} placeholder="Your name" required
                    onBlur={(e) => setInfo({ ...info, displayName: e.target.value })} />
                  <input type="email" name="email" defaultValue={user.email} placeholder="Your email" required
                    onBlur={(e) => setInfo({ ...info, email: e.target.value })} />
                  <input type="tel" name="phone" placeholder="Phone number" required
                    onBlur={(e) => setInfo({ ...info, phone: e.target.value })} />
                  <button type="submit" className="cb-btn cb-btn-amber" style={{ width: '100%', justifyContent: 'center' }}>
                    Confirm booking
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Booking;
