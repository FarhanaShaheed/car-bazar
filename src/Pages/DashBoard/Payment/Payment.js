import React, { useState } from 'react';
import { AdminPage } from '../ui/AdminUI';

const Payment = () => {
  const [done, setDone] = useState(false);
  return (
    <AdminPage title="Payment" subtitle="Securely pay for your reserved car">
      <div className="ad-panel" style={{ maxWidth: 560 }}>
        <div className="ad-note">💳 Demo mode: this is a UI prototype — no real card is charged and nothing is stored.</div>
        {done ? (
          <div className="ad-ok" style={{ fontSize: '.95rem' }}>✅ Payment simulated successfully. A receipt would be emailed to you.</div>
        ) : (
          <form className="ad-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <label>Cardholder name</label>
            <input placeholder="Farhana Binta Shaheed" required />
            <label>Card number</label>
            <input placeholder="4242 4242 4242 4242" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label>Expiry</label><input placeholder="12/28" required /></div>
              <div><label>CVC</label><input placeholder="123" required /></div>
            </div>
            <button className="cb-btn cb-btn-amber" type="submit"><i className="fas fa-lock" /> Pay now</button>
          </form>
        )}
      </div>
    </AdminPage>
  );
};

export default Payment;
