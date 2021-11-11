import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { Table } from 'react-bootstrap';

const MyOrders = () => {
    const {user}= useAuth();
    const[myOrders,setMyOrders] = useState([]);

    useEffect( () =>{
        const url = `http://localhost:5000/bookings?email=${user.email}`
        fetch(url)
        .then(res =>res.json())
        .then(data => setMyOrders(data));
    },[])
    return (
        <div>
            <h2>Orders:{myOrders.length}</h2>
            <div className="table-responsive">
       <Table striped bordered hover variant="dark">
        <thead>
            <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Car Name</th>
            <th>Car Price</th>
            <th>Phone</th>
            <th>Action</th>
            </tr>
        </thead>
        {
         
            myOrders?.map(orders => 
            <tbody key={orders._id}>
                <tr>
                <td>{orders?.displayName}</td>
                <td>{orders?.email}</td>
                <td>{orders?.carName}</td>
                <td>$ {orders?.carPrice}</td>
                <td>{orders?.phone}</td>
                {/* <td><Button onClick={()=> handleDeletemyBooking(bookings._id)}>Cancel</Button></td> */}
                
                </tr>
            </tbody>
            )
        }
    </Table>
       </div>
        </div>
    );
};

export default MyOrders;