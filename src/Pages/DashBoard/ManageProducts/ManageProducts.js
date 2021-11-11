import React, { useEffect } from 'react';
import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const ManageProducts = () => {
    const [allProducts,setAllProducts] = useState();
    useEffect(() =>{
        fetch('http://localhost:5000/cars')
        .then(res => res.json())
        .then(data => setAllProducts(data))
    },[])

    //DELETE A PRODUCT
    const handleDeleteProducts = id =>{
        const proceed = window.confirm('Are You sure you want to delete?');
        if(proceed){
          const url = `http://localhost:5000/cars/${id}`;
          fetch(url,{
              method: 'DELETE'
          })
          .then(res=>res.json())
          .then(data =>{
              if(data.deletedCount >0){
                  alert('Deleted Successfully');
                  const remainingOrders = allProducts.filter(product => product._id !== id);
                  setAllProducts(remainingOrders);
              }
          });
        }
      }
    return (
        <div>
            <h2>All Products:{allProducts?.length}</h2>
            <div className="table-responsive">
             <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Condition</th>
                <th>Action</th>
                </tr>
            </thead>
            {
                allProducts?.map(products => 
                <tbody key={products._id}>
                    <tr>
                    <td>{products?.name}</td>
                    <td>{products?.price}</td>
                    <td>{products?.condition}</td>
                    <td><Button onClick={()=> handleDeleteProducts(products._id)}>Delete</Button></td>
                    
                    </tr>
                </tbody>)
            }
        </Table> 
             </div>
        </div>
    );
};

export default ManageProducts;