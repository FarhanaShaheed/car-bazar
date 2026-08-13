import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Navigation from '../Home/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import carImage from '../../utils/carImage';
import API_BASE from '../../utils/api';

/* Booking — full reservation flow.
   Collects the details a dealer actually needs (contact, address, collection slot,
   payment method), validates every field client-side, and shows a deposit summary.
   NOTE: no card or bank numbers are taken here on purpose — the customer picks a
   payment METHOD and the dealer arranges the money afterwards. */

const LS_BOOKINGS = 'cb_demo_bookings';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// digits plus the separators real phone numbers use — letters are rejected outright
const PHONE_ALLOWED_RE = /^[0-9+()\/.\s-]+$/;
const DEPOSIT_RATE = 0.1;

const PAYMENTS = [
  { id: 'transfer', label: 'Bank transfer', icon: 'fas fa-university', hint: 'Invoice by email after we confirm' },
  { id: 'financing', label: 'Financing', icon: 'fas fa-percent', hint: 'Monthly instalments, subject to approval' },
  { id: 'card', label: 'Card on collection', icon: 'far fa-credit-card', hint: 'Pay in the showroom when you pick it up' },
  { id: 'cash', label: 'Cash on collection', icon: 'fas fa-money-bill-wave', hint: 'Pay in the showroom when you pick it up' },
];

const SLOTS = ['09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00', '15:00 – 17:00'];

const todayISO = () => new Date().toISOString().slice(0, 10);
const tomorrowISO = () => new Date(Date.now() + 864e5).toISOString().slice(0, 10);

const Booking = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState('');
  const { user } = useAuth();
  const formRef = useRef(null);

  const [f, setF] = useState({
    displayName: '', email: '', phone: '', birthDate: '',
    street: '', postcode: '', city: '', country: 'Germany',
    collectDate: '', collectSlot: SLOTS[0],
    payment: 'transfer', tradeIn: false, notes: '', terms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);   // becomes true after the first submit

  useEffect(() => {
    fetch(`${API_BASE}/cars/${carId}`)
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()).then((all) => all.find((c) => c._id === carId)))
      .then((data) => setCar(data || null))
      .catch(() => setCar(null));
  }, [carId]);

  useEffect(() => {
    if (user) setF((p) => ({ ...p, displayName: p.displayName || user.displayName || '', email: p.email || user.email || '' }));
  }, [user]);

  const price = Number(car?.price) || 0;
  const deposit = Math.round(price * DEPOSIT_RATE);
  const monthly = Math.round(price / 48);

  const validate = (v) => {
    const e = {};

    if (!v.displayName.trim() || v.displayName.trim().length < 2) e.displayName = 'Please enter your full name.';

    if (!v.email.trim()) e.email = 'Email address is required.';
    else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address looks incomplete.';

    // --- phone: the whole point of this rework ---
    const phone = v.phone.trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone) e.phone = 'Phone number is required — we call to arrange the handover.';
    else if (!PHONE_ALLOWED_RE.test(phone)) e.phone = 'A phone number cannot contain letters. Use digits, and + ( ) - / if you need them.';
    else if (digits.length < 7) e.phone = `That is only ${digits.length} digit${digits.length === 1 ? '' : 's'} — a phone number needs at least 7.`;
    else if (digits.length > 15) e.phone = 'That is too long for a phone number (max 15 digits).';

    if (!v.birthDate) e.birthDate = 'Date of birth is required.';
    else {
      const age = (Date.now() - new Date(v.birthDate).getTime()) / 3.15576e10;
      if (age < 18) e.birthDate = 'You must be at least 18 to reserve a car.';
      else if (age > 110) e.birthDate = 'Please check that date.';
    }

    if (v.street.trim().length < 4) e.street = 'Street and house number are required.';
    if (!/^\d{4,6}$/.test(v.postcode.trim())) e.postcode = 'Postcode should be 4-6 digits.';
    if (v.city.trim().length < 2) e.city = 'City is required.';

    if (!v.collectDate) e.collectDate = 'Pick a collection date.';
    else if (v.collectDate < todayISO()) e.collectDate = 'That date is in the past.';

    if (!v.payment) e.payment = 'Choose how you want to pay.';
    if (!v.terms) e.terms = 'Please accept the reservation terms.';

    return e;
  };

  const set = (name, value) => {
    const next = { ...f, [name]: value };
    setF(next);
    if (touched) setErrors(validate(next));      // live feedback once they've tried
    else if (errors[name]) setErrors((x) => ({ ...x, [name]: null }));
  };

  const onBlurField = (name) => () => {
    const e = validate(f);
    setErrors((x) => ({ ...x, [name]: e[name] || null }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    setTouched(true);
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = formRef.current?.querySelector('[data-invalid="true"]');
      if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus?.(); }
      return;
    }

    const reference = 'CB-' + Date.now().toString(36).toUpperCase().slice(-6);
    const booking = {
      _id: 'b' + Date.now(),
      reference,
      displayName: f.displayName.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      birthDate: f.birthDate,
      address: `${f.street.trim()}, ${f.postcode.trim()} ${f.city.trim()}, ${f.country}`,
      collectDate: f.collectDate,
      collectSlot: f.collectSlot,
      payment: PAYMENTS.find((p) => p.id === f.payment)?.label || f.payment,
      deposit,
      tradeIn: f.tradeIn,
      notes: f.notes.trim(),
      carName: car?.name, carPrice: car?.price, img: car?.img,
      status: 'pending', date: todayISO(),
    };

    fetch(`${API_BASE}/bookings`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(booking),
    }).then((r) => { if (!r.ok) throw new Error('api'); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]');
          all.push(booking); localStorage.setItem(LS_BOOKINGS, JSON.stringify(all));
        } catch (err) { /* storage unavailable — confirmation still shows */ }
      })
      .finally(() => { setRef(reference); setDone(true); });
  };

  const err = (name) =>
    errors[name] ? <span className="cb-bk-err" role="alert">{errors[name]}</span> : null;
  const bad = (name) => (errors[name] ? 'true' : undefined);

  const summary = useMemo(() => ([
    ['Car', car?.name || '—'],
    ['Price', `$${price.toLocaleString()}`],
    ['Reservation deposit (10%)', `$${deposit.toLocaleString()}`],
    ['Due on collection', `$${(price - deposit).toLocaleString()}`],
  ]), [car, price, deposit]);

  return (
    <>
      <Navigation />
      <section className="cb-section" style={{ paddingTop: 130, minHeight: '80vh' }}>
        <div className="cb-wrap">
          {!car ? (
            <p className="cb-sub">Loading car…</p>
          ) : done ? (
            <div className="cb-auth-card cb-bk-done" style={{ margin: '0 auto', textAlign: 'center' }}>
              <div className="cb-bk-done-ic"><i className="fas fa-check" /></div>
              <h2>Booking received</h2>
              <p className="sub">
                {car.name} — ${price.toLocaleString()}.<br />
                Your reference is <b>{ref}</b>. We'll confirm by phone within 24 hours and send the
                deposit invoice by email.
              </p>
              <Link to="/dashboard" className="cb-btn cb-btn-amber" style={{ justifyContent: 'center' }}>
                Go to my orders
              </Link>
            </div>
          ) : (
            <div className="cb-bk-grid">
              {/* ---------------- car + money summary ---------------- */}
              <aside>
                <div className="cb-card">
                  <img className="cb-card-img" style={{ height: 230 }} src={carImage(car.img)} alt={car.name} />
                  <div className="cb-card-body">
                    <h2 className="cb-card-title" style={{ fontSize: '1.25rem' }}>{car.name}</h2>
                    <span className="cb-cond">{car.condition}</span>
                    <p className="cb-desc">{car.description}</p>
                  </div>
                </div>
                <div className="cb-bk-summary">
                  {summary.map(([k, v]) => (
                    <div key={k} className={k.startsWith('Reservation') ? 'is-key' : ''}>
                      <span>{k}</span><b>{v}</b>
                    </div>
                  ))}
                  <p className="cb-bk-note">
                    <i className="fas fa-shield-alt" /> The deposit is refundable for 14 days.
                    No card or bank details are entered on this page.
                  </p>
                </div>
              </aside>

              {/* ---------------- the form ---------------- */}
              <div className="cb-bk-panel">
                <h2>Book this car</h2>
                <p className="sub">Four short sections — we call you within 24h to confirm.</p>

                <form onSubmit={submit} ref={formRef} noValidate>
                  <section className="cb-bk-sec">
                    <h3><span>1</span> Your details</h3>
                    <div className="cb-bk-row">
                      <label className="cb-bk-f">
                        <span>Full name *</span>
                        <input type="text" value={f.displayName} data-invalid={bad('displayName')}
                          onChange={(e) => set('displayName', e.target.value)} onBlur={onBlurField('displayName')}
                          placeholder="Farhana Binta Shaheed" />
                        {err('displayName')}
                      </label>
                      <label className="cb-bk-f">
                        <span>Date of birth *</span>
                        <input type="date" value={f.birthDate} max={todayISO()} data-invalid={bad('birthDate')}
                          onChange={(e) => set('birthDate', e.target.value)} onBlur={onBlurField('birthDate')} />
                        {err('birthDate')}
                      </label>
                    </div>
                    <div className="cb-bk-row">
                      <label className="cb-bk-f">
                        <span>Email *</span>
                        <input type="email" value={f.email} data-invalid={bad('email')}
                          onChange={(e) => set('email', e.target.value)} onBlur={onBlurField('email')}
                          placeholder="you@example.com" />
                        {err('email')}
                      </label>
                      <label className="cb-bk-f">
                        <span>Phone *</span>
                        <input type="tel" inputMode="tel" value={f.phone} data-invalid={bad('phone')}
                          onChange={(e) => set('phone', e.target.value)} onBlur={onBlurField('phone')}
                          placeholder="+49 162 2369395" />
                        {err('phone')}
                      </label>
                    </div>
                  </section>

                  <section className="cb-bk-sec">
                    <h3><span>2</span> Billing address</h3>
                    <label className="cb-bk-f">
                      <span>Street and house number *</span>
                      <input type="text" value={f.street} data-invalid={bad('street')}
                        onChange={(e) => set('street', e.target.value)} onBlur={onBlurField('street')}
                        placeholder="Musterstraße 12" />
                      {err('street')}
                    </label>
                    <div className="cb-bk-row cb-bk-row-3">
                      <label className="cb-bk-f">
                        <span>Postcode *</span>
                        <input type="text" inputMode="numeric" value={f.postcode} data-invalid={bad('postcode')}
                          onChange={(e) => set('postcode', e.target.value)} onBlur={onBlurField('postcode')}
                          placeholder="60311" />
                        {err('postcode')}
                      </label>
                      <label className="cb-bk-f">
                        <span>City *</span>
                        <input type="text" value={f.city} data-invalid={bad('city')}
                          onChange={(e) => set('city', e.target.value)} onBlur={onBlurField('city')}
                          placeholder="Frankfurt am Main" />
                        {err('city')}
                      </label>
                      <label className="cb-bk-f">
                        <span>Country</span>
                        <select value={f.country} onChange={(e) => set('country', e.target.value)}>
                          <option>Germany</option><option>Austria</option><option>Switzerland</option>
                          <option>Netherlands</option><option>France</option><option>Other</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className="cb-bk-sec">
                    <h3><span>3</span> Collection</h3>
                    <div className="cb-bk-row">
                      <label className="cb-bk-f">
                        <span>Preferred date *</span>
                        <input type="date" value={f.collectDate} min={tomorrowISO()} data-invalid={bad('collectDate')}
                          onChange={(e) => set('collectDate', e.target.value)} onBlur={onBlurField('collectDate')} />
                        {err('collectDate')}
                      </label>
                      <label className="cb-bk-f">
                        <span>Preferred time</span>
                        <select value={f.collectSlot} onChange={(e) => set('collectSlot', e.target.value)}>
                          {SLOTS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </label>
                    </div>
                    <label className="cb-bk-check">
                      <input type="checkbox" checked={f.tradeIn} onChange={(e) => set('tradeIn', e.target.checked)} />
                      <span>I want a trade-in valuation for my current car</span>
                    </label>
                    <label className="cb-bk-f">
                      <span>Anything we should know? (optional)</span>
                      <textarea rows="2" value={f.notes} onChange={(e) => set('notes', e.target.value)}
                        placeholder="e.g. I'd like to see the inspection report first." />
                    </label>
                  </section>

                  <section className="cb-bk-sec">
                    <h3><span>4</span> Payment method</h3>
                    <div className="cb-bk-pay" role="radiogroup" aria-label="Payment method">
                      {PAYMENTS.map((p) => (
                        <label className="cb-bk-pay-opt" key={p.id}>
                          <input type="radio" name="payment" value={p.id} checked={f.payment === p.id}
                            onChange={() => set('payment', p.id)} />
                          <span>
                            <i className={p.icon} />
                            <b>{p.label}</b>
                            <em>{p.id === 'financing' ? `≈ $${monthly.toLocaleString()}/month over 48 months` : p.hint}</em>
                          </span>
                        </label>
                      ))}
                    </div>
                    {err('payment')}

                    <label className="cb-bk-check" data-invalid={bad('terms')}>
                      <input type="checkbox" checked={f.terms} onChange={(e) => set('terms', e.target.checked)} />
                      <span>
                        I accept the reservation terms and confirm my details are correct. *
                      </span>
                    </label>
                    {err('terms')}
                  </section>

                  <button type="submit" className="cb-btn cb-btn-amber cb-bk-submit">
                    Confirm booking · ${deposit.toLocaleString()} deposit
                  </button>
                  {touched && Object.keys(errors).length > 0 && (
                    <p className="cb-bk-formerr" role="alert">
                      <i className="fas fa-exclamation-circle" /> Please correct the highlighted fields.
                    </p>
                  )}
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
