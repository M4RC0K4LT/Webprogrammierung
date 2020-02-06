import React from 'react';
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Customers, AddCustomer, CustomerOrders, CustomerStatistics, Customerdetail } from './customers/exports';
import { Login, Profile, Register} from './users/exports';
import { AddOrder, Orderdetail, Orders, MyOrders } from './orders/exports';
import { PrivateRoute, ResponsiveDrawer, NotFound } from './components/exports';

//API-Route - has to be removed in Production build
window.$apiroute = "https://kaltenstadler.net/";

/** Main component including Router */
class Index extends React.Component{

  render(){    
    let content = (     
        <Switch>
          <PrivateRoute exact path="/" component={Profile} />
          <PrivateRoute exact path="/customers" component={Customers} />
          <PrivateRoute exact path="/customers/add" component={AddCustomer} />
          <PrivateRoute exact path="/customers/:id" component={Customerdetail} />
          <PrivateRoute exact path="/customer/orders/:id" component={CustomerOrders} />
          <PrivateRoute exact path="/customer/statistics/:id" component={CustomerStatistics} />
          <PrivateRoute exact path="/orders" component={Orders} />
          <PrivateRoute exact path="/orders/mine" component={MyOrders} />
          <PrivateRoute exact path="/orders/add" component={AddOrder} />
          <PrivateRoute exact path="/orders/:id" component={Orderdetail} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>    
    )

    return (
      <Router>
          <ResponsiveDrawer content={content}></ResponsiveDrawer>
      </Router>
    );
  }
}

//Render whole component inside "root"-div
ReactDOM.render(<Index />, document.getElementById('root'))