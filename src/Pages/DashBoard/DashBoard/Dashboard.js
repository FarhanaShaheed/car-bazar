import React from 'react';
import '../DashBoard/Dashboard.css';
import DashboardHome from './../DashboardHome/DashboardHome';
import { Switch, Route, Link, useRouteMatch, useLocation } from 'react-router-dom';
import MakeAdmin from '../MakeAdmin/MakeAdmin';
import AddProduct from './../AddProduct/AddProduct';
import ManageProducts from './../ManageProducts/ManageProducts';
import ManageOrders from './../ManageOrders/ManageOrders';
import useAuth from '../../../hooks/useAuth';
import Payment from '../Payment/Payment';
import MyOrders from '../MyOrders/MyOrders';
import AddReviews from './../AddReviews/AddReviews';
import AdminRoute from './../../Login/AdminRoute/AdminRoute';

const Dashboard = () => {
  const { path, url } = useRouteMatch();
  const { logout, admin, user } = useAuth();
  const loc = useLocation();
  const is = (p) => (loc.pathname === p ? 'ad-navlink active' : 'ad-navlink');
  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <Link to="/home" className="ad-brand" title="Back to the showroom">
          <span className="cb-logo"><i className="fas fa-car" /></span> Car Bazar
        </Link>

        <div className="ad-sect">Overview</div>
        <Link className={is(url)} to={`${url}`}><i className="fas fa-chart-line" /> Dashboard</Link>
        <Link className="ad-navlink" to="/home"><i className="fas fa-store" /> Back to shop</Link>

        <div className="ad-sect">My account</div>
        <Link className={is(`${url}/myOrders`)} to={`${url}/myOrders`}><i className="fas fa-receipt" /> My Orders</Link>
        <Link className={is(`${url}/addreviews`)} to={`${url}/addreviews`}><i className="fas fa-star" /> Add Review</Link>
        <Link className={is(`${url}/payment`)} to={`${url}/payment`}><i className="fas fa-credit-card" /> Payment</Link>

        {admin && (
          <>
            <div className="ad-sect">Administration</div>
            <Link className={is(`${url}/manageOrders`)} to={`${url}/manageOrders`}><i className="fas fa-tasks" /> Manage Orders</Link>
            <Link className={is(`${url}/manageProducts`)} to={`${url}/manageProducts`}><i className="fas fa-boxes" /> Manage Products</Link>
            <Link className={is(`${url}/addProduct`)} to={`${url}/addProduct`}><i className="fas fa-plus-circle" /> Add Product</Link>
            <Link className={is(`${url}/makeAdmin`)} to={`${url}/makeAdmin`}><i className="fas fa-user-shield" /> Make Admin</Link>
          </>
        )}

        <button className="cb-btn cb-btn-amber" style={{ width: '100%', justifyContent: 'center', marginTop: 22 }} onClick={logout}>
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      </aside>

      <main className="ad-main">
        <header className="ad-top">
          <div>
            <h1>Dashboard</h1>
            <div className="sub">Welcome back, {user?.displayName || 'there'} 👋</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={`ad-chip${admin ? ' is-admin' : ''}`}>{admin ? 'ADMIN' : 'CUSTOMER'}</span>
            <div className="ad-user"><span className="ad-avatar">{initial}</span>
              <span style={{ display: 'none' }} className="d-sm-inline">{user?.displayName}</span></div>
          </div>
        </header>

        <div className="ad-body">
          <Switch>
            <Route exact path={path}><DashboardHome /></Route>
            <AdminRoute path={`${path}/makeAdmin`}><MakeAdmin /></AdminRoute>
            <AdminRoute path={`${path}/addProduct`}><AddProduct /></AdminRoute>
            <AdminRoute path={`${path}/manageProducts`}><ManageProducts /></AdminRoute>
            <AdminRoute path={`${path}/manageOrders`}><ManageOrders /></AdminRoute>
            <Route path={`${path}/payment`}><Payment /></Route>
            <Route path={`${path}/myOrders`}><MyOrders /></Route>
            <Route path={`${path}/addreviews`}><AddReviews /></Route>
          </Switch>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
