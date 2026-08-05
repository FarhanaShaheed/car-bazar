import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { AdminPage } from '../ui/AdminUI';

const AddReviews = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();
  const [ok, setOk] = useState(false);

  const onSubmit = (data) => {
    const review = { ...data, _id: 'r' + Date.now() };
    fetch('http://localhost:5000/reviews', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(review),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {
        try {
          const all = JSON.parse(localStorage.getItem('cb_demo_reviews') || '[]');
          all.push(review); localStorage.setItem('cb_demo_reviews', JSON.stringify(all));
        } catch (e) {}
      })
      .finally(() => { setOk(true); reset(); setTimeout(() => setOk(false), 4000); });
  };

  return (
    <AdminPage title="Add a Review" subtitle="Share your experience with Car Bazar">
      <div className="ad-panel" style={{ maxWidth: 620 }}>
        <form className="ad-form" onSubmit={handleSubmit(onSubmit)}>
          <label>Your name</label>
          <input {...register('name')} defaultValue={user.displayName} required />
          <label>Email</label>
          <input type="email" {...register('email')} defaultValue={user.email} required />
          <label>Your opinion</label>
          <textarea rows="4" {...register('opinion')} placeholder="What did you think of the service?" required />
          <label>Rating (0–5)</label>
          <input type="number" step="0.5" min="0" max="5" {...register('rating', { min: 0, max: 5 })} placeholder="5" />
          <button className="cb-btn cb-btn-amber" type="submit"><i className="fas fa-star" /> Submit review</button>
          {ok && <div className="ad-ok">✅ Thanks! Your review was submitted.</div>}
        </form>
      </div>
    </AdminPage>
  );
};

export default AddReviews;
