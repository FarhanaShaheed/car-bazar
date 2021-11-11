import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import '../DashBoard/Dashboard.css';
import DashboardHome from './../DashboardHome/DashboardHome';
import{
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
import MakeAdmin from '../MakeAdmin/MakeAdmin';
import AddProduct from './../AddProduct/AddProduct';
import ManageProducts from './../ManageProducts/ManageProducts';
import ManageOrders from './../ManageOrders/ManageOrders';
import useAuth from '../../../hooks/useAuth';
import Payment from '../Payment/Payment';
import MyOrders from '../MyOrders/MyOrders';
import Reviews from './../Reviews/Reviews';

const Dashboard = () => {
    let { path, url } = useRouteMatch();
    const{logout,admin} = useAuth();

    return (
        <div>
            <Row>
                <Col className="side-nav" sm={3}>
                    <h2>Side Nav</h2>
                    <Link className="nav-link" to="/home">Home</Link>
                    <Link  className="nav-link" to={`${url}`}>Dashboard</Link>
                    {admin ? <div>
                    <Link  className="nav-link" to={`${url}/makeAdmin`}>Make Admin</Link>
                    <Link  className="nav-link" to={`${url}/addProduct`}>Add Product</Link>
                    <Link  className="nav-link" to={`${url}/manageProducts`}>Manage Products</Link>
                    <Link  className="nav-link" to={`${url}/manageOrders`}>Manage Orders</Link>  
                    </div> : 
                    <div>
                        <Link  className="nav-link" to={`${url}/payment`}>Payment</Link>
                        <Link  className="nav-link" to={`${url}/myOrders`}>My Orders</Link>
                        <Link  className="nav-link" to={`${url}/reviews`}>Reviews</Link>
                    </div>
                    }
                    <Button variant="dark" onClick={logout}>Logout</Button>
                </Col>
            
            
            <Col sm={9}>
                <h2 className="dashboard">DashBoard</h2>
            <Switch>
                    <Route exact path={path}>
                    <DashboardHome></DashboardHome>
                    </Route>
                    <Route path={`${path}/makeAdmin`}>
                    <MakeAdmin></MakeAdmin>
                    </Route>
                    <Route path={`${path}/addProduct`}>
                    <AddProduct></AddProduct>
                    </Route>
                    <Route path={`${path}/manageProducts`}>
                    <ManageProducts></ManageProducts>
                    </Route>
                    <Route path={`${path}/manageOrders`}>
                    <ManageOrders></ManageOrders>
                    </Route>
                    <Route path={`${path}/payment`}>
                    <Payment></Payment>
                    </Route>
                    <Route path={`${path}/myOrders`}>
                    <MyOrders></MyOrders>
                    </Route>
                    <Route path={`${path}/reviews`}>
                     <Reviews></Reviews>
                    </Route>
                </Switch>
                </Col>
            </Row>
                
            
        </div>
    );
};

export default Dashboard;