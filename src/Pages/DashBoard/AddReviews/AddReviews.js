import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { AdminPage } from '../ui/AdminUI';
import API_BASE from '../../../utils/api';

const AddReviews = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { rating: 5 } });
  const { user } = useAuth();
  const [ok, setOk] = useState(false);
  const [hover, setHover] = useState(0);
  const rating = Number(watch('rating')) || 0;

  const onSubmit = (data) => {
    const review = { ...data, _id: 'r' + Date.now() };
    fetch(`${API_BASE}/reviews`, {
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
          <label id="rating-label">Rating</label>
          <div className="ad-stars" role="radiogroup" aria-labelledby="rating-label" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={`ad-star${n <= (hover || rating) ? ' is-on' : ''}`}
                onClick={() => setValue('rating', n, { shouldDirty: true })}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                aria-checked={n === rating}
                role="radio"
              >
                <i className="fas fa-star" />
              </button>
            ))}
            <span className="ad-stars-val">{hover || rating} / 5</span>
          </div>
          <input type="hidden" {...register('rating')} />
          <button className="cb-btn cb-btn-amber" type="submit"><i className="fas fa-star" /> Submit review</button>
          {ok && <div className="ad-ok">✅ Thanks! Your review was submitted.</div>}
        </form>
      </div>
    </AdminPage>
  );
};

export default AddReviews;
