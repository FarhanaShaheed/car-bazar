import React from 'react';
import { useForm } from "react-hook-form";
import useAuth from '../../../hooks/useAuth';
import '../AddReviews/AddReviews.css';


const AddReviews = () => {
    const { register, handleSubmit,reset } = useForm();
    const {user} = useAuth();
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
        <div className="reviews-form">
            <h2 >Add Reviews</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Your Name" defaultValue={user.displayName}/>
      <br />
      <input type="email" {...register("email")} placeholder="email" defaultValue={user.email} />
      <br />
      <input {...register("opinion")} placeholder="Your Opinion"/>
      <br />
      <input type="number" step="0.1" {...register("rating", { min: 0, max: 5 })} placeholder="Rating (0-5)"/>
      <br />
      <input className="reviews-submit" type="submit" />
    </form>
        </div>
    );
};

export default AddReviews;