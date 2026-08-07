import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useAuth from './../../../hooks/useAuth';
import Navigation from '../../Home/Navigation/Navigation';

const Register = () => {
  const [loginData, setLoginData] = useState({});
  const { registerUser, isLoading, authError } = useAuth();
  const history = useHistory();

  const handleChange = (e) => {
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginData.password !== loginData.password2) {
      alert('Your passwords did not match');
      return;
    }
    registerUser(loginData.email, loginData.password, loginData.name, history);
  };

  return (
    <>
      <Navigation />
      <div className="cb-auth">
        <div className="cb-auth-card">
          <h2>Create your account</h2>
          <p className="sub">Book faster and keep your orders in one place.</p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="password2" placeholder="Repeat password" onChange={handleChange} required />
            {authError && <div className="cb-error">{authError}</div>}
            <button type="submit" className="cb-btn cb-btn-amber" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <p style={{ marginTop: 18, fontSize: '.9rem' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--amber-dark)', fontWeight: 700 }}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
