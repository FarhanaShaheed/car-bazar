import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const MyOrders = () => {
    const {user}= useAuth();
    const[myOrders,setMyOrders] = useState([]);

    useEffect( () =>{
        const url = `https://murmuring-island-34247.herokuapp.com/bookings/${user?.email}`
        fetch(url)
        .then(res =>res.json())
        .then(data => setMyOrders(data));
    },[user?.email])

    //DELETE AN ORDER
    const handleDeleteOrder = id =>{
        const proceed = window.confirm('Are You sure you want to delete?');
        if(proceed){
          const url = `https://murmuring-island-34247.herokuapp.com/bookings/${id}`;
          fetch(url,{
              method: 'DELETE'
          })
          .then(res=>res.json())
          .then(data =>{
              if(data.deletedCount >0){
                  alert('Deleted Successfully');
                  const remainingOrders = myOrders.filter(orders => orders._id !== id);
                  setMyOrders(remainingOrders);
              }
          });
        }
      }
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
                <td><Button onClick={()=> handleDeleteOrder(orders._id)}>Delete</Button></td>
                
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