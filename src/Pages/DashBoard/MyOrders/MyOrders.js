import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { AdminPage } from '../ui/AdminUI';
import '../MyOrders/MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/bookings/${user?.email}`)
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .then(setMyOrders)
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem('cb_demo_bookings') || '[]');
          setMyOrders(all.filter((b) => b.email === user?.email));
        } catch (e) { setMyOrders([]); }
      });
  }, [user?.email]);

  const handleDeleteOrder = (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    fetch(`http://localhost:5000/bookings/${id}`, { method: 'DELETE' })
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem('cb_demo_bookings') || '[]');
          localStorage.setItem('cb_demo_bookings', JSON.stringify(all.filter((b) => b._id !== id)));
        } catch (e) {}
      })
      .finally(() => setMyOrders((o) => o.filter((x) => x._id !== id)));
  };

  return (
    <AdminPage title="My Orders" subtitle={`${myOrders.length} booking${myOrders.length === 1 ? '' : 's'} on your account`}>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>Car</th><th>Price</th><th>Collection</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {myOrders.length === 0 ? (
              <tr><td colSpan="6"><div className="ad-empty"><span className="ic">🚗</span>No bookings yet — reserve a car from the showroom.</div></td></tr>
            ) : myOrders.map((o) => (
              <tr key={o._id}>
                <td><b>{o.carName}</b><br /><span style={{ color: '#8b93a3', fontSize: '.8rem' }}>{o.reference ? `Ref ${o.reference}` : o.email}</span></td>
                <td>${Number(o.carPrice || 0).toLocaleString()}</td>
                <td>{o.collectDate ? <>{o.collectDate}<br /><span style={{ color: '#8b93a3', fontSize: '.8rem' }}>{o.collectSlot}</span></> : '—'}</td>
                <td>{o.payment || '—'}{o.deposit ? <><br /><span style={{ color: '#8b93a3', fontSize: '.8rem' }}>deposit ${Number(o.deposit).toLocaleString()}</span></> : null}</td>
                <td><span className={`ad-pill ${o.status === 'Approved' ? 'approved' : 'pending'}`}>{o.status}</span></td>
                <td>{o.status === 'pending'
                  ? <button className="cb-btn cb-btn-dark" style={{ padding: '7px 14px', fontSize: '.8rem' }} onClick={() => handleDeleteOrder(o._id)}>Cancel</button>
                  : <span style={{ color: '#12a06a' }}><i className="fas fa-check" /> Confirmed</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
};

export default MyOrders;
