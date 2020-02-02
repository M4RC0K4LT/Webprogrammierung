import React from 'react';
import ReactDOM from 'react-dom'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import { AppBar, Tabs, Tab, ButtonGroup, Button, Container} from '@material-ui/core';
import { Customers, AddCustomer, CustomerOrders, CustomerStatistics, Customerdetail } from './customers/exports';
import { Login, Profile, Register} from './users/exports';
import { AddOrder, Orderdetail, Orders } from './orders/exports';
import { PrivateRoute, ResponsiveDrawer } from './components/exports';
import Notfound from "./notfound";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#424242',
    },
  },
});

window.$apiroute = "http://localhost:3001/";

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
    
    let userbuttons;
    if (sessionStorage.getItem("authToken") != null) {
      userbuttons = (
        <ButtonGroup size="small" aria-label="small outlined button group" style={{margin: "15px"}}>
                <Button onClick={this.handleClick}>Logout</Button>
        </ButtonGroup>
      );
    }

    return (
    
    <Router>
      <div>
        <Container>
        <ThemeProvider theme={theme}>
          <ResponsiveDrawer></ResponsiveDrawer>
        </ThemeProvider>
        </Container>
        <Container>
        <Switch>
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/" component={Profile} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/customers" component={Customers} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customer/:id" component={Customerdetail} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customer/orders/:id" component={CustomerOrders} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} exact path="/customer/statistics/:id" component={CustomerStatistics} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/orders" component={Orders} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/addorder" component={AddOrder} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/order/:id" component={Orderdetail} />
          <Route path="/login" component={Login} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn}path="/profile" component={Profile} />
          <Route path="/register" component={Register} />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/addcustomer" component={AddCustomer} />
          <Route component={Notfound} />
        </Switch>
        </Container>
      </div>
    </Router>
    
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))