import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from './../../../hooks/useAuth';
import './Navigation.css';

const Navigation = () => {
  const{user, logout} = useAuth();
  console.log()
    return (
        <div>
            <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="lg">
    <Container>
    <Navbar.Brand href="#home"><i class="fas fa-car"></i> Car Bazar</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id = "responsve-navbar-nav">
    <Nav className="ms-auto">
      <Nav.Link as={Link} to="/home#home">Home</Nav.Link>
      <Nav.Link as={Link} to="/morecars">More Cars</Nav.Link>
      {
        user?.email ?
        <div className="custom-class">
          <Nav.Link as={Link} to="/dashboard">Dashboard </Nav.Link>
          <Navbar.Text>
                Sign: <a href="#login">{user?.displayName}</a>
          </Navbar.Text>
          <Button className="ms-3" variant="secondary" onClick={logout}>Logout</Button>
        </div>
        :
        <Nav.Link as={Link} to="/login">Login</Nav.Link>
      }
    </Nav>
    </Navbar.Collapse>
    </Container>
  </Navbar>
  
        </div>
    );
};

export default Navigation;
