import React from 'react';
import '../Review/Review.css';

const Review = ({ review }) => {
  const { name, email, opinion, rating } = review;
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <div className="cb-review">
      <div className="who">
        <span className="cb-avatar">{initial}</span>
        <span><span className="nm">{name}</span><br /><span className="em">{email}</span></span>
      </div>
      <p>“{opinion}”</p>
      <div className="cb-stars">{'★'.repeat(Math.round(rating || 0))}{'☆'.repeat(5 - Math.round(rating || 0))}</div>
    </div>
  );
};

export default Review;
