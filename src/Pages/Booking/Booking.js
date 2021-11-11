import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';
import { Col, Container, Row, Image, Button} from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import Navigation from '../Home/Navigation/Navigation';

const Booking = () => {
    const{carId} = useParams();
    const [bookingDetails,setBookingDetails] = useState([]);
    const carName = bookingDetails.name;
    const carPrice = bookingDetails.price;
    const{user} = useAuth();
    const initialInfo ={displayName:user.displayName, email:user.email, phone:''}
    const[bookingInfo,setBookingInfo]= useState(initialInfo);
    const handleOnBlur = e =>{
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = {...bookingInfo}
        newInfo[field] = value;
        console.log(newInfo);
        setBookingInfo(newInfo);
    }

    const handleBookingSubmit = e =>{
         //collect data
         const bookingData ={
             ...bookingInfo,
             carName: carName,
             carPrice: carPrice
         }
         //send to the server
         fetch('http://localhost:5000/bookings',{
             method: 'POST',
             headers: {
                 'content-type': 'application/json'
             },
             body: JSON.stringify(bookingData)
         })
         .then(res => res.json())
         .then(data =>{
             if(data.insertedId){
                 alert('Booked successfully!!');
             }
         })
        e.preventDefault();
    }

    useEffect(()=>{
        fetch(`http://localhost:5000/cars/${carId}`)
        .then(res => res.json())
        .then(data => setBookingDetails(data))
    },[])
    return (
        <div>
            <Navigation></Navigation>
            <h2>Your Car Details:{bookingDetails.name}</h2>
            <Container>
            <Row>
                <Col xs={12} md={6}>
                <Image src={bookingDetails.img}></Image>
                </Col>
                <Col xs={12} md={6}>
                    <form onSubmit={handleBookingSubmit}>
                        <input disabled type="text" name="" id="" defaultValue={bookingDetails.name} />
                        <br />
                        <input disabled type="text" name="" id="" defaultValue={bookingDetails.price}/>
                        <br />
                        <input required type="text" name="displayName" defaultValue={user.displayName} 
                        onBlur={handleOnBlur}
                        placeholder="Your Name"/>
                        <br />
                        <input required type="text" name="email" placeholder="Your Email"
                        onBlur={handleOnBlur}
                        defaultValue={user.email} />
                        <br />
                        <input required type="number" name="phone"
                        placeholder="Phone Number" 
                        onBlur={handleOnBlur}
                        />
                        <br />
                        <Button variant="dark" type="submit">Submit</Button>
                    </form> 
                </Col>
            </Row>

            </Container>
        </div>
    );
};

export default Booking;