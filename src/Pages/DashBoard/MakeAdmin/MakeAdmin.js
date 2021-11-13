import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import '../MakeAdmin/MakeAdmin.css';

const MakeAdmin = () => {
    const[email,setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const handleOnBlur = e =>{
        setEmail(e.target.value);
    }
    const handleAdminSubmit = e =>{
        const user = {email};
        fetch('https://murmuring-island-34247.herokuapp.com/users/admin',{
            method: 'PUT',
            headers:{
                'content-type': 'application/json'
            },
            body:JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data =>{
            if(data.modifiedCount){
                console.log(data);
                setSuccess(true);
            }
        })
        e.preventDefault();
    }
    return (
        <div className="admin-form">
            <h2>Make An Admin</h2>
            <form onSubmit={handleAdminSubmit}>
             <input style={{width:'40%'}} type="email"
             placeholder="Enter Email"
             onBlur={handleOnBlur}
             name=""/>
             <br />
             <Button variant="dark" className="mt-3" type="submit">Make Admin</Button>
            </form>
            {success && <Alert className="mt-2" variant="success">
             Made Admin successfully !!
             </Alert> }
        </div>
    );
};

export default MakeAdmin;