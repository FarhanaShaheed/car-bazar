import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home/Home/Home';
import MoreCars from './Pages/MoreCars/MoreCars';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register/Register';
import AuthProvider from './contexts/AuthProvider/AuthProvider';
import NotFound from './Pages/NotFound/NotFound';
import Booking from './Pages/Booking/Booking';
import PrivateRoute from './Pages/Login/PrivateRoute/PrivateRoute';
import Dashboard from './Pages/DashBoard/DashBoard/Dashboard';
import ScrollToTop from './components/ScrollToTop';

function App() {
  // scroll-reveal: mark section children and reveal on intersect
  React.useEffect(() => {
    const els = document.querySelectorAll('.cb-section .cb-wrap, .cb-3d .cb-wrap');
    els.forEach((el) => el.classList.add('cb-reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route path="/home">
            <Home></Home>
          </Route>
          <Route path="/morecars">
            <MoreCars></MoreCars>
          </Route>
          <PrivateRoute path="/booking/:carId">
            <Booking></Booking>
          </PrivateRoute>
          <PrivateRoute path="/dashboard">
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/register">
            <Register></Register>
          </Route>
          <Route path="*">
            <NotFound></NotFound>
          </Route>
        </Switch>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
