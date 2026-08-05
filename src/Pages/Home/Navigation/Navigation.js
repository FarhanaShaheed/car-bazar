import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from './../../../hooks/useAuth';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar fixed="top" collapseOnSelect expand="lg" className="cb-nav">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          <span className="cb-logo"><i className="fas fa-car" /></span> Car Bazar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" style={{ alignItems: 'center' }}>
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/morecars">Browse cars</Nav.Link>
            {user?.email ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <span className="cb-nav-user">{user?.displayName}</span>
                <button className="cb-btn cb-btn-amber" style={{ padding: '8px 18px', marginLeft: 8 }} onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="cb-btn cb-btn-amber" style={{ padding: '9px 20px', marginLeft: 8 }}>Login</Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
