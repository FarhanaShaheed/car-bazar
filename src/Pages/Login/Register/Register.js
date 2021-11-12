import React, { useState } from 'react';
import { Button, Col, Form, Image, Container, Row, Spinner, Alert } from 'react-bootstrap';
import { Link,useHistory } from 'react-router-dom';
import login from '../../images/login.jfif';
import useAuth from './../../../hooks/useAuth';

const Register = () => {

    const[loginData, setLoginData] = useState({});
    const{user,registerUser,isLoading,authError} = useAuth();
    const history = useHistory();

    const handleOnBlur = e =>{
        const field = e.target.name;
        const value = e.target.value;
        const newLoginData = {...loginData};
        newLoginData[field] = value;
        console.log(newLoginData);
        setLoginData(newLoginData);
    }
    const handleLoginSubmit = e =>{
        if(loginData.password !== loginData.password2){
            alert("your password did not match");
            return;
        }
         registerUser(loginData.email, loginData.password,loginData.name,history); 
        e.preventDefault();
   }
    return (
        <div>
        <Container className="mt-5">
        <Row>
        <Col xs={12} md={6} className="mt-5">
            <h2>You Can Register Here</h2>
        {!isLoading && <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Your Name</Form.Label>
                <Form.Control 
                type="text" 
                name="name"
                required
                onBlur={handleOnBlur}
                placeholder="Enter Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                type="email" 
                name="email"
                onBlur={handleOnBlur}
                placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                 type="password"
                 name="password"
                 onBlur={handleOnBlur}
                 placeholder="Password"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>ReType Your Password</Form.Label>
                <Form.Control
                 type="password"
                 name="password2"
                 onBlur={handleOnBlur}
                 placeholder="Password"/>
            </Form.Group>
            
            <Button variant="dark" type="submit">
                Register
            </Button>
            </Form>}
            {isLoading && <Spinner animation="grow" />}
            {user?.email && <Alert variant="success">
             Registartion is successfull !!
             </Alert> }
            {authError && <Alert variant="danger">
             {authError}
             </Alert> }

          <p className="mt-3">Already Registered? Please <Link to="/login">Login</Link></p>
        </Col>
        <Col xs={12} md={6}>
          <Image src={login} fluid></Image>
        </Col>
      </Row>
        </Container>
    </div>
    );
};

export default Register;