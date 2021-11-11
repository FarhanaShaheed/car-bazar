import React from 'react';
import { Card, Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Car = ({car}) => {
    const {name,img,_id,price,condition} = car;
    return (
        <Container>
           <Col>
     <Card className="service-card">
       <Card.Img variant="top" src={img} style={{height:'20rem'}}  fluid/>
       <Card.Body>
         <Card.Title className="card-title">{name}</Card.Title>
         <Card.Title className="card-title">$ {price}</Card.Title>
         <Card.Text>Condition: {condition}</Card.Text>
         <Link to={`/booking/${_id}`}>
         <Button variant="dark">Book Here </Button>
         </Link>
         </Card.Body>
     </Card>
   </Col>
        </Container>
    );
};

export default Car;