import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Navigation from '../Home/Navigation/Navigation';
import Car from './../Car/Car';

const MoreCars = () => {
    const[cars,setCars] = useState([]);

    useEffect(() =>{
        //fetch('./cars.json')
        fetch('https://murmuring-island-34247.herokuapp.com/cars')
        .then(res => res.json())
        .then(data => setCars(data));
    },[])
    return (
        <div>
            <Navigation></Navigation>
            <Container>
            <h2 className="services-class">Available Cars</h2>
            <Row xs={1} md={3} className="g-4">
            {
                cars.map(car => <Car
                    key={car._id}
                    car={car}
                    ></Car>)
            }
           </Row>
            </Container>
        </div>
    );
};

export default MoreCars;