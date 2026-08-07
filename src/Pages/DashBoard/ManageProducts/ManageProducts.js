import React, { useEffect, useState } from 'react';
import { AdminPage } from '../ui/AdminUI';
import carImage from '../../../utils/carImage';

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cars')
      .then((res) => { if (!res.ok) throw new Error('api'); return res.json(); })
      .then(setAllProducts)
      .catch(() => fetch(process.env.PUBLIC_URL + '/cars.json').then((r) => r.json()).then(setAllProducts).catch(() => setAllProducts([])));
  }, []);

  const handleDeleteProducts = (id) => {
    if (!window.confirm('Remove this car from the inventory?')) return;
    fetch(`http://localhost:5000/cars/${id}`, { method: 'DELETE' })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {})
      .finally(() => setAllProducts((p) => p.filter((x) => x._id !== id)));
  };

  return (
    <AdminPage title="Manage Products" subtitle={`${allProducts.length} cars in the inventory`}>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>Car</th><th>Price</th><th>Condition</th><th>Action</th></tr></thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr><td colSpan="4"><div className="ad-empty"><span className="ic">📦</span>No cars in the inventory.</div></td></tr>
            ) : allProducts.map((p) => (
              <tr key={p._id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {p.img && <img src={carImage(p.img)} alt={p.name} style={{ width: 54, height: 38, objectFit: 'cover', borderRadius: 8 }} />}
                  <b>{p.name}</b>
                </td>
                <td>${Number(p.price || 0).toLocaleString()}</td>
                <td><span className="ad-pill approved">{p.condition}</span></td>
                <td><button className="cb-btn cb-btn-dark" style={{ padding: '7px 14px', fontSize: '.8rem' }} onClick={() => handleDeleteProducts(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
};

export default ManageProducts;
