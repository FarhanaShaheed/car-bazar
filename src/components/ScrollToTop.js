import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* React Router keeps the window scroll position across route changes, so clicking
   "Book" from a car card halfway down the page opened /booking/:id already scrolled
   to the payment section. Reset to the top on every navigation — except when the URL
   carries a #hash (the home page's "What buyers say" anchor) or when the user goes
   back/forward, where the browser's own restoration is the right behaviour. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
