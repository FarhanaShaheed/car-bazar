import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import useAuth from './../../hooks/useAuth';
import { DEMO_ADMIN_EMAIL } from '../../hooks/useFirebase';
import Navigation from '../Home/Navigation/Navigation';

const Login = () => {
  const [loginData, setLoginData] = useState({});
  const { loginUser, signInWithGoogle, isLoading, authError } = useAuth();
  const location = useLocation();
  const history = useHistory();

  const handleChange = (e) => {
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
  };

  return (
    <>
      <Navigation />
      <div className="cb-auth">
        <div className="cb-auth-card">
          <h2>Welcome back</h2>
          <p className="sub">Log in to book cars and manage your orders.</p>
          <div className="cb-demo-hint">
            <b>Try the demo — any password works</b>
            <button type="button" onClick={() => setLoginData({ email: DEMO_ADMIN_EMAIL, password: 'demo1234' })}>
              <i className="fas fa-user-shield" /> Admin: {DEMO_ADMIN_EMAIL}
            </button>
            <button type="button" onClick={() => setLoginData({ email: 'customer@example.com', password: 'demo1234' })}>
              <i className="fas fa-user" /> Customer: customer@example.com
            </button>
            <em>Admins see inventory + order management; customers only see their own orders.</em>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); loginUser(loginData.email, loginData.password, location, history); }}>
            <input type="email" name="email" placeholder="Email address" value={loginData.email || ''} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={loginData.password || ''} onChange={handleChange} required />
            {authError && <div className="cb-error">{authError}</div>}
            <button type="submit" className="cb-btn cb-btn-amber" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={isLoading}>
              {isLoading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--slate)', fontSize: '.8rem', margin: '16px 0' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} /> or <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          <button className="cb-btn cb-btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => signInWithGoogle(location, history)}>
            Continue with Google
          </button>
          <p style={{ marginTop: 18, fontSize: '.9rem' }}>
            New here? <Link to="/register" style={{ color: 'var(--amber-dark)', fontWeight: 700 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
