import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Pages/Home/Home/Home/Home';
import MoreCars from './Pages/MoreCars/MoreCars';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register/Register';
import AuthProvider from './contexts/AuthProvider/AuthProvider';
import NotFound from './Pages/NotFound/NotFound';
import Booking from './Pages/Booking/Booking';
import PrivateRoute from './Pages/Login/PrivateRoute/PrivateRoute';
import Dashboard from './Pages/DashBoard/DashBoard/Dashboard';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route path="/home">
            <Home></Home>
          </Route>
          <Route path="/morecars">
            <MoreCars></MoreCars>
          </Route>
          <PrivateRoute path="/booking/:carId">
            <Booking></Booking>
          </PrivateRoute>
          <PrivateRoute path="/dashboard">
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/register">
            <Register></Register>
          </Route>
          <Route path="*">
            <NotFound></NotFound>
          </Route>
        </Switch>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
