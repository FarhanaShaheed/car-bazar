import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Car from '../../../Car/Car';
import '../../Home/PopularCars/PopularCars.css';


const PopularCars = () => {
    const[cars,setCars] = useState([]);

    useEffect(() =>{
        //fetch('./cars.json')
        fetch('https://murmuring-island-34247.herokuapp.com/cars')
        .then(res => res.json())
        .then(data => setCars(data));
    },[])

    return (
            <Container>
            <h2 className="m-4">Most Demanding Cars</h2>
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