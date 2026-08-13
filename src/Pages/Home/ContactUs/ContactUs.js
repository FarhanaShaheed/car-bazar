import React, { useRef, useState } from 'react';
import googleMap from '../../images/google-map.jfif';
import '../ContactUs/ContactUs.css';
import API_BASE from '../../../utils/api';

/* Contact — 2026 redesign.
   Split panel: dark info rail + floating-label form with validation and a
   success state, then a 3D-tilt map card. Messages persist to localStorage
   (`cb_demo_messages`) so the demo works with no backend. */

const TOPICS = [
  { id: 'buy', label: 'Buy a car', icon: 'fas fa-car-side' },
  { id: 'sell', label: 'Sell my car', icon: 'fas fa-tags' },
  { id: 'testdrive', label: 'Book a test drive', icon: 'fas fa-road' },
  { id: 'support', label: 'Support', icon: 'fas fa-life-ring' },
];

const CHANNELS = [
  {
    icon: 'fas fa-phone-alt',
    label: 'Call the desk',
    value: '+01 345 97637',
    note: 'Mon–Sat · 9:00–19:00',
    href: 'tel:+0134597637',
  },
  {
    icon: 'fas fa-envelope',
    label: 'Email us',
    value: 'car@bazar.com',
    note: 'Replies within 1 business hour',
    href: 'mailto:car@bazar.com',
  },
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Visit the showroom',
    value: 'Avenue 234, New York',
    note: '120 certified cars on site',
    href: 'https://maps.google.com/?q=Avenue+234+New+York',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [topic, setTopic] = useState('buy');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const mapRef = useRef(null);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((x) => ({ ...x, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please tell us your name.';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'That email address looks incomplete.';
    if (form.message.trim().length < 10) e.message = 'A little more detail helps us answer faster.';
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus('sending');
    const entry = { ...form, topic, at: new Date().toISOString() };
    // real API first so the admin's Messages page sees it; localStorage keeps the demo working
    fetch(`${API_BASE}/messages`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem('cb_demo_messages') || '[]');
          all.unshift(entry);
          localStorage.setItem('cb_demo_messages', JSON.stringify(all));
        } catch (_) { /* storage unavailable — the confirmation still shows */ }
      })
      .finally(() => setStatus('sent'));
  };

  const reset = () => {
    setForm({ name: '', email: '', phone: '', message: '' });
    setTopic('buy');
    setErrors({});
    setStatus('idle');
  };

  const onMapMove = (e) => {
    const r = mapRef.current.getBoundingClientRect();
    setTilt({
      rx: -((e.clientY - r.top) / r.height - 0.5) * 8,
      ry: ((e.clientX - r.left) / r.width - 0.5) * 12,
    });
  };

  return (
    <section className="cb-ct cb-section" id="contact">
      <div className="cb-wrap">
        <div className="cb-center">
          <span className="cb-eyebrow">Get in touch</span>
          <h2 className="cb-h2">Talk to a real car expert</h2>
          <p className="cb-sub">
            Questions about a listing, financing or a trade-in? Send a note and a
            specialist gets back to you — usually within the hour.
          </p>
        </div>

        <div className="cb-ct-shell">
          <aside className="cb-ct-aside">
            <div className="cb-ct-aside-head">
              <span className="cb-ct-live"><i className="cb-ct-dot" /> Team online now</span>
              <h3>We answer fast.</h3>
              <p>Every enquiry lands with a named advisor — no ticket queues, no bots.</p>
            </div>

            <ul className="cb-ct-channels">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <span className="cb-ct-ic"><i className={c.icon} /></span>
                    <span className="cb-ct-ch-body">
                      <small>{c.label}</small>
                      <b>{c.value}</b>
                      <em>{c.note}</em>
                    </span>
                    <i className="fas fa-arrow-right cb-ct-go" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="cb-ct-hours">
              <div>
                <small>Showroom hours</small>
                <b>Mon–Sat · 9:00 – 19:00</b>
              </div>
              <div>
                <small>Test drives</small>
                <b>Daily · 10:00 – 18:00</b>
              </div>
            </div>

            <div className="cb-ct-social">
              <a href="/#contact" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="/#contact" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="/#contact" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="/#contact" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            </div>
          </aside>

          <div className="cb-ct-panel">
            {status === 'sent' ? (
              <div className="cb-ct-done" role="status">
                <span className="cb-ct-done-ic"><i className="fas fa-check" /></span>
                <h3>Message sent</h3>
                <p>
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''} — an advisor will reply
                  to <b>{form.email}</b> within one business hour.
                </p>
                <button type="button" className="cb-btn cb-btn-dark" onClick={reset}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <span className="cb-ct-label">What can we help with?</span>
                <div className="cb-ct-topics">
                  {TOPICS.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={`cb-ct-topic${topic === t.id ? ' is-on' : ''}`}
                      onClick={() => setTopic(t.id)}
                      aria-pressed={topic === t.id}
                    >
                      <i className={t.icon} /> {t.label}
                    </button>
                  ))}
                </div>

                <div className="cb-ct-row">
                  <div className={`cb-ct-field${errors.name ? ' has-error' : ''}`}>
                    <input
                      id="ct-name"
                      type="text"
                      placeholder=" "
                      value={form.name}
                      onChange={set('name')}
                      aria-invalid={Boolean(errors.name)}
                    />
                    <label htmlFor="ct-name">Full name</label>
                    {errors.name && <span className="cb-ct-err">{errors.name}</span>}
                  </div>
                  <div className={`cb-ct-field${errors.email ? ' has-error' : ''}`}>
                    <input
                      id="ct-email"
                      type="email"
                      placeholder=" "
                      value={form.email}
                      onChange={set('email')}
                      aria-invalid={Boolean(errors.email)}
                    />
                    <label htmlFor="ct-email">Email address</label>
                    {errors.email && <span className="cb-ct-err">{errors.email}</span>}
                  </div>
                </div>

                <div className="cb-ct-field">
                  <input
                    id="ct-phone"
                    type="tel"
                    placeholder=" "
                    value={form.phone}
                    onChange={set('phone')}
                  />
                  <label htmlFor="ct-phone">Phone <em>(optional)</em></label>
                </div>

                <div className={`cb-ct-field${errors.message ? ' has-error' : ''}`}>
                  <textarea
                    id="ct-msg"
                    rows="5"
                    placeholder=" "
                    value={form.message}
                    onChange={set('message')}
                    aria-invalid={Boolean(errors.message)}
                  />
                  <label htmlFor="ct-msg">How can we help?</label>
                  {errors.message && <span className="cb-ct-err">{errors.message}</span>}
                </div>

                <div className="cb-ct-actions">
                  <button
                    type="submit"
                    className="cb-btn cb-btn-amber cb-ct-submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <><span className="cb-ct-spin" /> Sending…</>
                    ) : (
                      <>Send message <i className="fas fa-paper-plane" /></>
                    )}
                  </button>
                  <span className="cb-ct-note">
                    <i className="fas fa-lock" /> We never share your details.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        <div
          className="cb-ct-map"
          ref={mapRef}
          onMouseMove={onMapMove}
          onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        >
          <div
            className="cb-ct-map-inner"
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
          >
            <div className="cb-ct-map-media">
              <img src={googleMap} alt="Map of the Car Bazar showroom location" />
              <span className="cb-ct-pin"><i className="fas fa-map-marker-alt" /></span>
            </div>
            <div className="cb-ct-map-card">
              <div>
                <small>Flagship showroom</small>
                <b>Avenue 234, New York</b>
                <em>Free parking · 2 min from the metro</em>
              </div>
              <a
                className="cb-btn cb-btn-dark"
                href="https://maps.google.com/?q=Avenue+234+New+York"
                target="_blank"
                rel="noreferrer"
              >
                Get directions <i className="fas fa-directions" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
