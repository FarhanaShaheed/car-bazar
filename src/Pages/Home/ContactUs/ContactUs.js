import React from 'react';
import { Col, Button, Row, Container } from 'react-bootstrap';
import googleMap from '../../images/google-map.jfif';
import '../ContactUs/ContactUs.css';

const ContactUs = () => {
    return (
        <div>
            <Container className="contact-class">
        
        <Row className="m-5">
        <Col xs={12} md={6}>
         <h2>Drop us a line</h2>
         <form action="">
             <input type="text" placeholder="Name"/>
             <br />
             <input type="text" placeholder="Email"/>
             <textarea placeholder="Messege" cols="30" rows="6" ></textarea>
             <br />
             <Button variant="dark">Send Us</Button>
         </form>
        </Col>
        <Col xs={12} md={6}>
            <img style={{width:'100%'}} src={googleMap} alt="" fluid/>
        </Col>
        </Row>
        <div className="row d-flex align-items-center justify-content-center">
            
            <div className="col-sm-6">
               <h5> Address: <span>Avenue 234</span></h5>
               <h5> City: <span>New York-US</span></h5>
               <h5> Check-In: <span>15:00 am</span></h5>
               
            </div>
            <div  className="col-sm-6">
            <h5> Phone: <span>374765290293</span></h5>
               <h5> Email: <span>info@travel.com</span></h5>
               <h5> Check-Out: <span>11:00am</span></h5>
            </div>
            
        </div>
      </Container>
        </div>
    );
};

export default ContactUs;