import React, { useEffect, useState } from 'react';
import { AdminPage } from '../ui/AdminUI';

const LS = 'cb_demo_bookings';

const ManageOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/bookings')
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .then(setAllOrders)
      .catch(() => { try { setAllOrders(JSON.parse(localStorage.getItem(LS) || '[]')); } catch (e) { setAllOrders([]); } });
  }, [approved]);

  const local = (fn) => { try { const all = JSON.parse(localStorage.getItem(LS) || '[]'); localStorage.setItem(LS, JSON.stringify(fn(all))); } catch (e) {} };

  const handleDeleteOrder = (id) => {
    if (!window.confirm('Delete this order?')) return;
    fetch(`http://localhost:5000/bookings/${id}`, { method: 'DELETE' })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => local((all) => all.filter((b) => b._id !== id)))
      .finally(() => setAllOrders((o) => o.filter((x) => x._id !== id)));
  };

  const handleUpdate = (id) => {
    fetch(`http://localhost:5000/updateStatus/${id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'Approved' }),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => local((all) => all.map((b) => (b._id === id ? { ...b, status: 'Approved' } : b))))
      .finally(() => setApproved((a) => !a));
  };

  return (
    <AdminPage title="Manage Orders" subtitle={`${allOrders.length} order${allOrders.length === 1 ? '' : 's'} across all customers`}>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>Customer</th><th>Contact</th><th>Car</th><th>Collection</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr><td colSpan="7"><div className="ad-empty"><span className="ic">📋</span>No orders yet.</div></td></tr>
            ) : allOrders.map((o) => (
              <tr key={o._id}>
                <td><b>{o.displayName}</b><br /><span style={{ color: '#8b93a3', fontSize: '.8rem' }}>{o.email}</span></td>
                <td>{o.phone}{o.address ? <><br /><span style={{ color: '#8b93a3', fontSize: '.78rem' }}>{o.address}</span></> : null}</td>
                <td>{o.carName}<br /><span style={{ color: '#8b93a3', fontSize: '.78rem' }}>${Number(o.carPrice || 0).toLocaleString()}</span></td>
                <td>{o.collectDate ? <>{o.collectDate}<br /><span style={{ color: '#8b93a3', fontSize: '.78rem' }}>{o.collectSlot}</span></> : '—'}</td>
                <td>{o.payment || '—'}{o.tradeIn ? <><br /><span style={{ color: '#e08700', fontSize: '.78rem' }}>trade-in wanted</span></> : null}</td>
                <td><span className={`ad-pill ${o.status === 'Approved' ? 'approved' : 'pending'}`}>{o.status}</span></td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="cb-btn cb-btn-amber" style={{ padding: '7px 14px', fontSize: '.8rem' }} onClick={() => handleUpdate(o._id)}>Confirm</button>
                  <button className="cb-btn cb-btn-dark" style={{ padding: '7px 14px', fontSize: '.8rem' }} onClick={() => handleDeleteOrder(o._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
};

export default ManageOrders;
