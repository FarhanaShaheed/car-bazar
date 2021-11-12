import React from 'react';
import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const ManageOrders = () => {
    const[allOrders,setAllOrders] = useState();

    useEffect(() =>{
        fetch('https://murmuring-island-34247.herokuapp.com/bookings')
        .then(res => res.json())
        .then(data => setAllOrders(data))
    },[])

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
                const remainingOrders = allOrders.filter(order => order._id !== id);
                setAllOrders(remainingOrders);
            }
        });
      }
    }
    return (
        <div>
            <h2>All Orders : {allOrders?.length}</h2>
            <div className="table-responsive">
             <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Car Name</th>
                <th>Car Price</th>
                <th>Action</th>
                </tr>
            </thead>
            {
                allOrders?.map(order => 
                <tbody key={order._id}>
                    <tr>
                    <td>{order?.displayName}</td>
                    <td>{order?.email}</td>
                    <td>{order?.phone}</td>
                    <td>{order?.carName}</td>
                    <td>{order?.carPrice}</td>
                    <td><Button onClick={()=> handleDeleteOrder(order._id)}>Delete</Button></td>
                    
                    </tr>
                </tbody>)
            }
        </Table> 
             </div>
        </div>
    );
};

export default ManageOrders;