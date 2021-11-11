import React from 'react';
import { Card, Container } from 'react-bootstrap';

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
                 Rating: {rating}
                 
                 <br />
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>
        </Container>
    );
};

export default Review;