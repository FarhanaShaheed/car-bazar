import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from './../../../hooks/useAuth';

const Navigation = () => {
  const{user, logout} = useAuth();
  console.log()
    return (
        <div>
            <Navbar bg="dark" variant="dark">
    <Container>
    <Navbar.Brand href="#home">Car Bazar</Navbar.Brand>
    <Nav className="ms-auto">
      <Nav.Link as={Link} to="/home#home">Home</Nav.Link>
      <Nav.Link as={Link} to="/morecars">More Cars</Nav.Link>
      {
        user?.email ?
        <div className="d-flex">
          <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          <Navbar.Text>
                Sign: <a href="#login">{user?.displayName}</a>
          </Navbar.Text>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
        :
        <Nav.Link as={Link} to="/login">Login</Nav.Link>
      }
    </Nav>
    </Container>
  </Navbar>
  
        </div>
    );
};

export default Navigation;