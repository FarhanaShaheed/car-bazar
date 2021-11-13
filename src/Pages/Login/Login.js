import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import login from '../images/login.jfif';
import { Link,useLocation,useHistory} from 'react-router-dom';
import useAuth from './../../hooks/useAuth';

const Login = () => {
    const[loginData, setLoginData] = useState({});
    const{user,loginUser,signInWithGoogle,isLoading,authError} = useAuth();

    const location = useLocation();
    const history = useHistory();

    const handleOnBlur = e =>{
        const field = e.target.name;
        const value = e.target.value;
        const newLoginData = {...loginData};
        newLoginData[field] = value;
        setLoginData(newLoginData);
    }
    const handleLoginSubmit = e =>{
        loginUser(loginData.email, loginData.password,location,history);
        e.preventDefault();
    }
    const handleGoogleSignIn = e =>{
        signInWithGoogle(location,history);
    }
    return (
        <div>
            <Container className="mt-5">
            <Row>
            <Col xs={12} md={6} className="mt-5">
                <h2>You Can Login Here</h2>
            <Form onSubmit={handleLoginSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                    type="email" 
                    name="email"
                    onBlur={handleOnBlur}
                    placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                     type="password"
                     name="password"
                     onBlur={handleOnBlur}
                     placeholder="Password"/>
                </Form.Group>
                
                <Button variant="dark" type="submit">
                    Login
                </Button>
                <br />
                {isLoading && <Spinner animation="grow" />}
            {user?.email && <Alert className="mt-2" variant="success">
             Login is successfull !!
             </Alert> }
            {authError && <Alert variant="danger">
             {authError}
             </Alert> }
                </Form>
                

                <p>-----------------</p>
              <Button onClick={handleGoogleSignIn} variant="dark"><i class="fab fa-google"></i> Google SignIn</Button>
              <p className="mt-3">New User? Please <Link to="/register">Register</Link></p>
              <Link to="/home">
                 <Button variant="dark"><i class="fas fa-arrow-left"></i> Back to Home</Button>
             </Link>
            </Col>
            <Col xs={12} md={6}>
              <Image src={login} fluid></Image>
            </Col>
          </Row>
            </Container>
        </div>
    );
};

export default Login;