import React from 'react';
import { Card, Container } from 'react-bootstrap';
import Rating from 'react-rating';
import '../Review/Review.css';

const Review = ({review}) => {
    const {name,email,opinion,rating} = review;


    return (
        <Container>
            <Card className="review-card">
            <Card.Body>
                <Card.Title><i class="fas fa-user"></i> {name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Email: {email}</Card.Subtitle>
                <Card.Text>
                "{opinion.slice(0,15)}"
                </Card.Text>
                 <br />
                 <Rating
                 emptySymbol="far fa-star icon-color"
                 fullSymbol="fas fa-star icon-color"
                 initialRating={rating}
                 readonly
                 />
            </Card.Body>
            </Card>
        </Container>
    );
};

export default Review;