import React from 'react';
import { useForm } from "react-hook-form";
import useAuth from '../../../hooks/useAuth';


const AddReviews = () => {
    const { register, handleSubmit,reset } = useForm();
    const {user} = useAuth();
    console.log(user);
    const onSubmit = data =>{
        console.log(data);
        fetch('https://murmuring-island-34247.herokuapp.com/reviews',{
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
            <h2>Add Reviews</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Your Name" defaultValue={user.name}/>
      <br />
      <input type="email" {...register("email")} placeholder="email" defaultValue={user.email} />
      <br />
      <input {...register("opinion")} placeholder="Your Opinion"/>
      <br />
      <p>Enter Number between 0 and 5</p>
      <input type="number" step="0.1" {...register("rating", { min: 0, max: 5 })} placeholder="Rating"/>
      <br />
      <input type="submit" />
    </form>
        </div>
    );
};

export default AddReviews;