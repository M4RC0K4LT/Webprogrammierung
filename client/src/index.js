import React from 'react';
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { AppBar, Tabs, Tab, ButtonGroup, Button} from '@material-ui/core';
import ReactDOM from 'react-dom'
import Orders from "./orders/orders";
import Customers from "./customers/customers";
import Notfound from "./notfound";
import Login from "./users/login";
import Profile from "./users/profile";
import Register from "./users/register";
import AddCustomer from "./customers/addcustomer"
import Customerdetail from "./customers/customerdetail";
import Orderdetail from "./orders/orderdetail";
import AddOrder from "./orders/addorder";
import CustomerOrders from "./customers/customerorders";
import CustomerStatistics from "./customers/customerstatistics";

window.$apiroute = "http://localhost:3001/";

class Routing extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    sessionStorage.removeItem("authToken");
    window.location.reload();
  }

  componentDidMount(){
    if (sessionStorage.getItem("authToken") != null){
      this.setState({ isLoggedIn: true })
    }else {
      this.setState({ isLoggedIn: false })
    }
  }

  render(){

    const isLoggedIn = this.state.isLoggedIn;
    
    let userbuttons;
    if (isLoggedIn) {
      userbuttons = (
        <ButtonGroup size="small" aria-label="small outlined button group" style={{margin: "15px"}}>
                <Button onClick={this.handleClick}>Logout</Button>
        </ButtonGroup>
      );
    } else {
      //userbuttons = (
        //<Redirect to="/login"></Redirect>
      //);
    }

    return (
    <Router>
      <div>
          <AppBar position="fixed" color="default" style={{ paddingLeft: "calc(100vw - 100%)" }}>
            <Tabs centered>
              <Tab label="Aufträge" component={Link} to="/orders"/>
              <Tab label="Kunden" component={Link} to="/customers" />
              <Tab label="Profil" component={Link} to="/profile" />
              {userbuttons}
            </Tabs>
          </AppBar>

        <Switch>
          <Route exact path="/" component={Profile} />
          <Route path="/customers" component={Customers} />
          <Route exact path="/customer/:id" component={Customerdetail} />
          <Route exact path="/customer/orders/:id" component={CustomerOrders} />
          <Route exact path="/customer/statistics/:id" component={CustomerStatistics} />
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

ReactDOM.render(<Routing />, document.getElementById('root'))