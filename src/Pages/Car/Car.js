import React from 'react';
import { Card, Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Car/Car.css';

const Car = ({car}) => {
    const {name,img,_id,price,condition} = car;
    return (
        <Container>
           <Col>
     <Card className="service-card">
       <Card.Img variant="top" src={img} style={{height:'20rem'}}  fluid/>
       <Card.Body>
         <Card.Title className="card-title"><i class="fas fa-user"></i> {name}</Card.Title>
         <Card.Title className="card-title"><i class="fas fa-money-bill-alt"></i> $ {price}</Card.Title>
         
         <Card.Text>Condition: <b>{condition}</b></Card.Text>
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