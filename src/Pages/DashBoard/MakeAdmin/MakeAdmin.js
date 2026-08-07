import React, { useState } from 'react';
import { AdminPage } from '../ui/AdminUI';
import '../MakeAdmin/MakeAdmin.css';

const MakeAdmin = () => {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/users/admin', {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {})
      .finally(() => { setOk(true); setTimeout(() => setOk(false), 4000); });
  };

  return (
    <AdminPage title="Make an Admin" subtitle="Grant administrator privileges to a registered user">
      <div className="ad-panel" style={{ maxWidth: 560 }}>
        <div className="ad-note">🔐 Admin rights let a user manage inventory and confirm customer orders.</div>
        <form className="ad-form" onSubmit={handleAdminSubmit}>
          <label>User email</label>
          <input type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
          <button className="cb-btn cb-btn-amber" type="submit"><i className="fas fa-user-shield" /> Make admin</button>
          {ok && <div className="ad-ok">✅ {email} is now an administrator.</div>}
        </form>
      </div>
    </AdminPage>
  );
};

export default MakeAdmin;
