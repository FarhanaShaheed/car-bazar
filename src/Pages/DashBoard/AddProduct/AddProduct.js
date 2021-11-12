import React from 'react';
import { useForm } from "react-hook-form";

const AddProduct = () => {
    const { register, handleSubmit,reset } = useForm();
  const onSubmit = data =>{
       console.log(data);
       fetch('https://murmuring-island-34247.herokuapp.com/cars',{
           method: 'POST',
           headers:{
            'content-type': 'application/json'
           },
           body: JSON.stringify(data)
       })
       .then(res => res.json())
       .then(data =>{
        if(data.insertedId){
          alert('Service added successfully');
          reset();
        }
    })
    }

    return (
        <div>
            <h2>Add A Product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Product Name"/>
      <br />
      <input {...register("img")} placeholder="Product Img URL"/>
      <br />
      <input type="number" {...register("price")} placeholder="Product Price"/>
      <br />
      <input {...register("condition")} placeholder="Product Condition"/>
      <br />
      <input type="submit" />
    </form>
            
        </div>
    );
};

export default AddProduct;