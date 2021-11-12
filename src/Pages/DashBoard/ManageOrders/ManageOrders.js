import React from 'react';
import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const ManageOrders = () => {
    const[allOrders,setAllOrders] = useState();
    const[approved,setApproved] = useState(false);

    useEffect(() =>{
        fetch('https://murmuring-island-34247.herokuapp.com/bookings')
        .then(res => res.json())
        .then(data => setAllOrders(data))
    },[approved])

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
    
    //UPDATE STATUS

    const update ={
        status: 'Approved'
    }

    const handleUpdate = (id) =>{
        fetch(`https://murmuring-island-34247.herokuapp.com/updateStatus/${id}`,{
            method: 'PUT',
            headers:{
               'content-type': 'application/json'    
            },
            body: JSON.stringify(update)
        })
        .then(res => res.json())
        .then(data => {
            if( data.modifiedCount > 0){
                alert('approved successfully')
                setApproved(!approved)
            }
        })
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
                <th>Status</th>
                <th colSpan="2">Action</th>
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
                    <td>{order?.status}</td>
                    <td><Button onClick={()=> handleDeleteOrder(order?._id)}>Delete</Button></td>
                    <td><Button onClick={()=> handleUpdate(order?._id)}>Confirm</Button></td>
                    </tr>
                </tbody>)
            }
        </Table> 
             </div>
        </div>
    );
};

export default ManageOrders;