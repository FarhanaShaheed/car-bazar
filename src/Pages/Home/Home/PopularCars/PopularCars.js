import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Car from '../../../Car/Car';

const PopularCars = () => {
    const[cars,setCars] = useState([]);

    useEffect(() =>{
        //fetch('./cars.json')
        fetch('http://localhost:5000/cars')
        .then(res => res.json())
        .then(data => setCars(data));
    },[])

    return (
            <Container>
            <h2 className="services-class">Most Demanding Cars</h2>
            <Row xs={1} md={3} className="g-4">
            {
                cars.slice(0,6)?.map(car => <Car
                    key={car._id}
                    car={car}
                    ></Car>)
            }
           </Row>
            </Container>
    );
};

export default PopularCars;