import React, { useEffect, useState } from 'react';
import { StatCard, LineChart, BarChart } from '../ui/AdminUI';

const DashboardHome = () => {
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()).then(setCars).catch(() => {});
    try { setOrders(JSON.parse(localStorage.getItem('cb_demo_bookings') || '[]')); } catch (e) {}
  }, []);

  const revenue = orders.reduce((s, o) => s + (Number(o.carPrice) || 0), 0);
  const inventory = cars.reduce((s, c) => s + (Number(c.price) || 0), 0);

  return (
    <>
      <div className="ad-stats">
        <StatCard icon={<i className="fas fa-car" />} label="Cars in stock" value={cars.length} tone="amber" trend="+2 this week" delay={0} />
        <StatCard icon={<i className="fas fa-receipt" />} label="Bookings" value={orders.length} tone="blue" delay={80} />
        <StatCard icon={<i className="fas fa-euro-sign" />} label="Booked value" value={revenue} prefix="$" tone="green" delay={160} />
        <StatCard icon={<i className="fas fa-warehouse" />} label="Inventory value" value={inventory} prefix="$" tone="violet" delay={240} />
      </div>

      <div className="ad-grid">
        <div className="ad-panel ad-rev" style={{ animationDelay: '160ms' }}>
          <h3>Visitors &amp; bookings</h3>
          <div className="ph">Last 7 days of showroom activity</div>
          <LineChart points={[12, 19, 15, 27, 22, 34, 30]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} />
        </div>
        <div className="ad-panel ad-rev" style={{ animationDelay: '240ms' }}>
          <h3>Sales by month</h3>
          <div className="ph">Units sold this half-year</div>
          <BarChart data={[{ k: 'Jan', v: 8 }, { k: 'Feb', v: 12 }, { k: 'Mar', v: 9 }, { k: 'Apr', v: 17 }, { k: 'May', v: 14 }, { k: 'Jun', v: 21 }]} />
        </div>
      </div>

      <div className="ad-panel ad-rev" style={{ marginTop: 18, animationDelay: '320ms' }}>
        <h3>Recent bookings</h3>
        <div className="ph">Requests submitted from the showroom</div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Customer</th><th>Car</th><th>Price</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5"><div className="ad-empty"><span className="ic">🗂</span>No bookings yet — book a car from the showroom and it will appear here.</div></td></tr>
              ) : orders.slice(-6).reverse().map((o) => (
                <tr key={o._id}>
                  <td><b>{o.displayName}</b><br /><span style={{ color: '#8b93a3', fontSize: '.8rem' }}>{o.email}</span></td>
                  <td>{o.carName}</td>
                  <td>${Number(o.carPrice || 0).toLocaleString()}</td>
                  <td>{o.date}</td>
                  <td><span className="ad-pill pending">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
