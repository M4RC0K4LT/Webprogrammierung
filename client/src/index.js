import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import './index.css';
import Orders from "./orders";
import Customers from "./customers";
import Notfound from "./notfound";
import Login from "./login";
import Profile from "./profile";
import Register from "./register";
import AddCustomer from "./addcustomer"
import Customerdetail from "./customerdetail";
import Orderdetail from "./orderdetail";
import AddOrder from "./addorder";
import CustomerOrders from "./customerorders";
import Home from "./home";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { Route, Link, NavLink, BrowserRouter as Router, Switch } from 'react-router-dom'


class Routing extends React.Component{

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    sessionStorage.removeItem("authToken");
    window.location.reload();
  }

  render(){
    return (
    <Router>
      <div>
          <AppBar position="fixed" color="default">
            <Tabs centered>
              <Tab label="Home" component={Link} to="/"/>
              <Tab label="Orders" component={Link} to="/orders"/>
              <Tab label="Customers" component={Link} to="/customers" />
              <Tab label="Profile" component={Link} to="/profile" />
              <ButtonGroup size="small" aria-label="small outlined button group" style={{margin: "15px"}}>
                <Button onClick={this.handleClick}>Logout</Button>
                <Button href="/login">Login</Button>
              </ButtonGroup>
            </Tabs>
          </AppBar>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/customers" component={Customers} />
          <Route exact path="/customer/:id" component={Customerdetail} />
          <Route exact path="/customer/orders/:id" component={CustomerOrders} />
          <Route path="/orders" component={Orders} />
          <Route path="/addorder" component={AddOrder} />
          <Route path="/order/:id" component={Orderdetail} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/register" component={Register} />
          <Route path="/addcustomer" component={AddCustomer} />
          <Route component={Notfound} />
        </Switch>
      </div>
    </Router>
    );
  }
}

//<NavLink style={{ textDecoration: 'none' }} onClick={handleClick} to="/">Logout</NavLink>

ReactDOM.render(<Routing />, document.getElementById('root'))