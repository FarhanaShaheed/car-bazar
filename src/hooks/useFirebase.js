import { useEffect, useState } from "react";
import initializeFirebase from "../Pages/Login/Firebase/Firebase.init";
import { isFirebaseConfigured } from "../Pages/Login/Firebase/Firebase.config";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, getIdToken, signOut } from "firebase/auth";
import API_BASE from '../utils/api';

if (isFirebaseConfigured) initializeFirebase();

/* DEMO MODE ------------------------------------------------------------
   When no Firebase keys are configured (public demo deploy), authentication
   runs fully client-side: any email/password works, the session is kept in
   localStorage, and the demo user has admin access so the whole dashboard
   is explorable. With keys present, the original Firebase flow is used. */
const DEMO_KEY = "cb_demo_user";

/* Who is an administrator when real Firebase auth is on.
   Firebase answers "who are you", not "what may you do" — the role normally lives in the
   users collection (GET /users/:email). While that server is not hosted, this allowlist
   keeps the admin panel reachable: set REACT_APP_ADMIN_EMAILS=a@b.de,c@d.de at build time.
   Everyone else who signs up through Firebase is a normal customer. */
const ADMIN_EMAILS = (process.env.REACT_APP_ADMIN_EMAILS || "")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const isConfiguredAdmin = (email) => ADMIN_EMAILS.includes(String(email || "").toLowerCase());
const demoRead = () => { try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || null; } catch { return null; } };
const demoWrite = (u) => { try { u ? localStorage.setItem(DEMO_KEY, JSON.stringify(u)) : localStorage.removeItem(DEMO_KEY); } catch {} };


/* Raw Firebase codes are unreadable for a visitor ("Firebase: Error (auth/user-not-found)").
   Same mapper Medicate uses. */
export const friendlyAuthError = (e) => {
  const c = (e && (e.code || e.message)) || '';
  if (c.includes('unauthorized-domain')) return "Google Sign-In isn't enabled for this domain yet — please use email & password.";
  if (c.includes('invalid-api-key')) return 'Authentication is not configured for this deployment.';
  if (c.includes('email-already-in-use')) return 'That email is already registered — try logging in instead.';
  if (c.includes('weak-password')) return 'Please choose a password with at least 6 characters.';
  if (c.includes('user-not-found') || c.includes('wrong-password') || c.includes('invalid-credential') || c.includes('invalid-login-credentials')) return 'Wrong email or password.';
  if (c.includes('too-many-requests')) return 'Too many attempts — please wait a moment and try again.';
  if (c.includes('popup-closed-by-user')) return 'Sign-in window closed before completing.';
  if (c.includes('network-request-failed')) return 'Network problem — please check your connection.';
  return (e && e.message) ? e.message.replace('Firebase: ', '') : 'Something went wrong.';
};

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
        updateProfile(auth.currentUser, { displayName: name }).catch((e) => setAuthError(friendlyAuthError(e)));
        history.replace('/');
      })
      .catch((error) => setAuthError(friendlyAuthError(error)))
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
      .catch((error) => setAuthError(friendlyAuthError(error)))
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
      .catch((error) => setAuthError(friendlyAuthError(error)))
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
        fetch(`${API_BASE}/users/${user.email}`)
          .then((res) => res.json())
          .then((data) => setAdmin(Boolean(data && data.admin) || isConfiguredAdmin(user.email)))
          .catch(() => setAdmin(isConfiguredAdmin(user.email)))   // no server yet -> allowlist
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
    fetch(`${API_BASE}/users`, {
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
