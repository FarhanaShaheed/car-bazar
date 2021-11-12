import React from 'react';
import { Card, Container } from 'react-bootstrap';
import Rating from 'react-rating';
import '../Review/Review.css';

const Review = ({review}) => {
    const {name,email,opinion,rating} = review;


    return (
        <Container>
            <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>Name: {name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Email: {email}</Card.Subtitle>
                <Card.Text>
                "{opinion}"
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