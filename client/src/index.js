import React from 'react';
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Customers, AddCustomer, CustomerOrders, CustomerStatistics, Customerdetail } from './customers/exports';
import { Login, Profile, Register} from './users/exports';
import { AddOrder, Orderdetail, Orders } from './orders/exports';
import { PrivateRoute, ResponsiveDrawer } from './components/exports';
import Notfound from "./notfound";

window.$apiroute = "http://192.168.2.122:3001/";

class Index extends React.Component{

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

  render(){    
    let content = (     
        <Switch>
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/" component={Profile} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customers" component={Customers} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customers/add" component={AddCustomer} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customers/:id" component={Customerdetail} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customer/orders/:id" component={CustomerOrders} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customer/statistics/:id" component={CustomerStatistics} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/orders" component={Orders} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/orders/add" component={AddOrder} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/orders/:id" component={Orderdetail} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={Notfound} />
        </Switch>    
    )

    return (
      <Router>
          <ResponsiveDrawer content={content}></ResponsiveDrawer>
      </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))