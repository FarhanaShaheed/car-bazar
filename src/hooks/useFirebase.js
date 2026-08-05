import { useEffect, useState } from "react";
import initializeFirebase from "../Pages/Login/Firebase/Firebase.init";
import { isFirebaseConfigured } from "../Pages/Login/Firebase/Firebase.config";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, getIdToken, signOut } from "firebase/auth";

if (isFirebaseConfigured) initializeFirebase();

/* DEMO MODE ------------------------------------------------------------
   When no Firebase keys are configured (public demo deploy), authentication
   runs fully client-side: any email/password works, the session is kept in
   localStorage, and the demo user has admin access so the whole dashboard
   is explorable. With keys present, the original Firebase flow is used. */
const DEMO_KEY = "cb_demo_user";
const demoRead = () => { try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || null; } catch { return null; } };
const demoWrite = (u) => { try { u ? localStorage.setItem(DEMO_KEY, JSON.stringify(u)) : localStorage.removeItem(DEMO_KEY); } catch {} };

const useFirebase = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState('');

  const auth = isFirebaseConfigured ? getAuth() : null;
  const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

  /* ---------------- demo implementations ---------------- */
  const demoSignIn = (u, location, history) => {
    demoWrite(u); setUser(u); setAdmin(true); setAuthError('');
    setIsLoading(false); setIsAdminLoading(false);
    const destination = location?.state?.from || '/dashboard';
    if (history) history.replace(destination);
  };

  const registerUser = (email, password, name, history) => {
    if (!isFirebaseConfigured) {
      if (!email || !password) { setAuthError('Please enter an email and a password.'); return; }
      demoSignIn({ email, displayName: name || email.split('@')[0], demo: true }, null, history);
      return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setAuthError('');
        const newUser = { email, displayName: name };
        setUser(newUser);
        saveUser(email, name, 'POST');
        updateProfile(auth.currentUser, { displayName: name }).catch((e) => setAuthError(e.message));
        history.replace('/');
      })
      .catch((error) => setAuthError(error.message))
      .finally(() => setIsLoading(false));
  };

  const loginUser = (email, password, location, history) => {
    if (!isFirebaseConfigured) {
      if (!email || !password) { setAuthError('Please enter an email and a password.'); return; }
      demoSignIn({ email, displayName: email.split('@')[0], demo: true }, location, history);
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const destination = location?.state?.from || '/dashboard';
        history.replace(destination);
        setAuthError('');
      })
      .catch((error) => setAuthError(error.message))
      .finally(() => setIsLoading(false));
  };

  const signInWithGoogle = (location, history) => {
    if (!isFirebaseConfigured) {
      demoSignIn({ email: 'visitor@carbazar.demo', displayName: 'Demo Visitor', demo: true }, location, history);
      return;
    }
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        saveUser(user.email, user.displayName, 'PUT');
        setAuthError('');
        const destination = location?.state?.from || '/dashboard';
        history.replace(destination);
      })
      .catch((error) => setAuthError(error.message))
      .finally(() => setIsLoading(false));
  };

  // observe user state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const u = demoRead();
      if (u) { setUser(u); setAdmin(true); }
      setIsLoading(false); setIsAdminLoading(false);
      return;
    }
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoading(true);
        setUser(user);
        fetch(`http://localhost:5000/users/${user.email}`)
          .then((res) => res.json())
          .then((data) => setAdmin(data.admin))
          .catch(() => {})
          .finally(() => setIsAdminLoading(false));
        getIdToken(user).then((idToken) => setToken(idToken));
      } else {
        setUser({});
      }
      setIsLoading(false);
    });
    return () => unsubscribed;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    if (!isFirebaseConfigured) { demoWrite(null); setUser({}); setAdmin(false); return; }
    setIsLoading(true);
    signOut(auth).catch(() => {}).finally(() => setIsLoading(false));
  };

  const saveUser = (email, displayName, method) => {
    const user = { email, displayName };
    fetch('http://localhost:5000/users', {
      method: method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(user),
    }).catch(() => {});
  };

  return {
    user,
    admin,
    isLoading,
    registerUser,
    authError,
    loginUser,
    isAdminLoading,
    signInWithGoogle,
    logout,
    token,
  };
};

export default useFirebase;
