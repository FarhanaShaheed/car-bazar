import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import useAuth from './../../hooks/useAuth';
import Navigation from '../Home/Navigation/Navigation';

const Login = () => {
  const [loginData, setLoginData] = useState({});
  const { loginUser, signInWithGoogle, isLoading, authError, resetPassword } = useAuth();
  const [reset, setReset] = useState(null);   // null | 'form' | 'sending' | 'sent'
  const [resetError, setResetError] = useState('');
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
          <p className="sub">Log in to book cars and manage your orders. <b>Demo tip:</b> any email + password works.</p>
          {reset && (
            <div className="cb-reset" role="region" aria-label="Reset your password">
              {reset === 'sent' ? (
                <>
                  <b><i className="fas fa-envelope-open-text" /> Check your inbox</b>
                  <p>
                    If <b>{loginData.email}</b> has an account, a reset link is on its way.
                    It expires in an hour — remember to look in spam.
                  </p>
                  <button type="button" className="cb-linkbtn" onClick={() => setReset(null)}>Back to login</button>
                </>
              ) : (
                <>
                  <b>Reset your password</b>
                  <p>Enter the email you registered with and we'll send you a reset link.</p>
                  <input type="email" name="email" placeholder="Email address"
                    value={loginData.email || ''} onChange={handleChange} />
                  {resetError && <div className="cb-error">{resetError}</div>}
                  <div className="cb-reset-actions">
                    <button type="button" className="cb-btn cb-btn-amber" disabled={reset === 'sending'}
                      onClick={() => {
                        setReset('sending'); setResetError('');
                        resetPassword(loginData.email)
                          .then(() => setReset('sent'))
                          .catch((err) => { setResetError(err.message); setReset('form'); });
                      }}>
                      {reset === 'sending' ? 'Sending…' : 'Send reset link'}
                    </button>
                    <button type="button" className="cb-linkbtn" onClick={() => setReset(null)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); loginUser(loginData.email, loginData.password, location, history); }}>
            <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <div className="cb-forgot-row">
              <button type="button" className="cb-linkbtn"
                onClick={() => { setReset('form'); setResetError(''); }}>
                Forgot password?
              </button>
            </div>
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
