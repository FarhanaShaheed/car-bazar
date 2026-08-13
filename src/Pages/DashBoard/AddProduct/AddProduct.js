import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AdminPage } from '../ui/AdminUI';
import API_BASE from '../../../utils/api';

/* Condition is a fixed vocabulary — the hero's condition filter groups on these
   exact strings, so admins pick one instead of typing it (a typo would spawn a
   one-car filter option). */
const CONDITIONS = [
  { value: 'Like new', hint: 'Almost no km' },
  { value: 'Excellent', hint: 'No visible wear' },
  { value: 'Very good', hint: 'Light cosmetic wear' },
  { value: 'Good', hint: 'Higher mileage' },
];

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { condition: 'Excellent' } });
  const [ok, setOk] = useState(false);

  const onSubmit = (data) => {
    const car = { ...data, _id: 'c' + Date.now() };
    fetch(`${API_BASE}/cars`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(car),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem('cb_demo_cars') || '[]');
          all.push(car); localStorage.setItem('cb_demo_cars', JSON.stringify(all));
        } catch (e) {}
      })
      .finally(() => { setOk(true); reset(); setTimeout(() => setOk(false), 4000); });
  };

  return (
    <AdminPage title="Add a Product" subtitle="List a new car in the showroom inventory">
      <div className="ad-panel" style={{ maxWidth: 620 }}>
        <div className="ad-note">💡 Demo mode: new cars are stored in your browser so you can see the flow end-to-end.</div>
        <form className="ad-form" onSubmit={handleSubmit(onSubmit)}>
          <label>Car name</label>
          <input {...register('name')} placeholder="e.g. BMW 3 Series (2021)" required />
          <label>Image URL</label>
          <input {...register('img')} placeholder="https://…" />
          <label>Price (USD)</label>
          <input type="number" {...register('price')} placeholder="32900" required />
          <label id="cond-label">Condition</label>
          <div className="ad-choice" role="radiogroup" aria-labelledby="cond-label">
            {CONDITIONS.map((c) => (
              <label className="ad-choice-opt" key={c.value}>
                <input type="radio" value={c.value} {...register('condition')} />
                <span>
                  <i className="fas fa-check" />
                  <b>{c.value}</b>
                  <em>{c.hint}</em>
                </span>
              </label>
            ))}
          </div>
          <label>Short description</label>
          <textarea rows="3" {...register('description')} placeholder="One owner, full service history, 28.000 km." />
          <button className="cb-btn cb-btn-amber" type="submit"><i className="fas fa-plus" /> Add car</button>
          {ok && <div className="ad-ok">✅ Car added to the inventory.</div>}
        </form>
      </div>
    </AdminPage>
  );
};

export default AddProduct;
