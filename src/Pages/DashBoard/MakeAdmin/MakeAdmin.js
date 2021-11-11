import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const MakeAdmin = () => {
    const[email,setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const handleOnBlur = e =>{
        setEmail(e.target.value);
    }
    const handleAdminSubmit = e =>{
        const user = {email};
        fetch('http://localhost:5000/users/admin',{
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
        <div>
            <h2>Make An Admin</h2>
            <form onSubmit={handleAdminSubmit}>
             <input style={{width:'40%'}} type="email"
             placeholder="Enter Email"
             onBlur={handleOnBlur}
             name=""/>
             <br />
             <Button className="mt-3" type="submit">Make Admin</Button>
            </form>
            {success && <Alert className="mt-2" variant="success">
             Made Admin successfully !!
             </Alert> }
        </div>
    );
};

export default MakeAdmin;