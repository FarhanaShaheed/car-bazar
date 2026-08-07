import React, { useEffect, useState } from 'react';
import Review from './../Review/Review';
import loadReviews from '../../../utils/reviewsSource';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews().then(setReviews);
  }, []);

  return (
    <section className="cb-section alt" id="reviews">
      <div className="cb-wrap cb-center">
        <span className="cb-eyebrow">Social proof</span>
        <h2 className="cb-h2">What buyers say</h2>
        <p className="cb-sub">Real reviews from real Car Bazar customers.</p>
        <div className="cb-grid-4">
          {reviews.map((review) => <Review key={review._id} review={review} />)}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
