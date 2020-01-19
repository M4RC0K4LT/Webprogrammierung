import React from 'react'
import './index.css'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import useStyles from "./components/useStyles";
import getInvoice from './api/getInvoice';
import getCustomerOrders from './api/getCustomerOrders';
import getCustomer from "./api/getCustomer";
import deleteOrder from "./api/deleteOrder";
import SnackbarMessage from './components/snackbarmessage'

class CustomerOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      snackcolor: "error",

      orders: [],
      checkedforinvoice: [],
      buttondisabled: true,
      customer: [],
      isLoading: false,
      error: null,
    }
    this.handleCheck = this.handleCheck.bind(this);
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchCustomer = this.fetchCustomer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleSnackbarClose(){
    this.setState({ open: false })
  }
  
  handleCheck(orderid){
    this.setState({ buttondisabled: false })
    const id = parseInt(orderid)
    this.setState({ checkedforinvoice: [...this.state.checkedforinvoice, id] });
    if(this.state.checkedforinvoice.includes(id)){
      let filteredArray = this.state.checkedforinvoice.filter(item => item !== id)
      this.setState({ checkedforinvoice: filteredArray });
      if(filteredArray.length === 0){
        this.setState({ buttondisabled: true })
      }
    }
  }

  handleDelete(id){
    deleteOrder(id).then(data => {
      this.setState({ isLoading: false })
      if(data.request === "failed" || data.length<1){
        this.setState({ message: data.error, open: true, snackcolor: "error" });
      } else {
        this.fetchOrders()
      }
    })
  }

  requestInvoice(id) {
    var invoicelist = [];
    if(id == null){
      invoicelist = this.state.checkedforinvoice;
    }else {
      invoicelist.push(id);
    }
    getInvoice(invoicelist).then(response => {
      if(response.request === "failed"){
        this.setState({ message: response.error, open: true, snackcolor: "error"});
      }else{
        const file = new Blob(
          [response], 
          {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  fetchOrders() {
    const id = this.props.match.params.id;
    this.setState({ isLoading: true });
    getCustomerOrders(id).then(data => {
      this.setState({ isLoading: false })
      if(data.request === "failed" || data.length<1){
        this.setState({ message: data.error, open: true, snackcolor: "error"});
      } else {
        this.setState({ orders: data })
      }
    })
  }

  fetchCustomer() {
    const id = this.props.match.params.id;
    this.setState({ isLoading: true });
    getCustomer(id).then(data => {
      this.setState({ isLoading: false })
      if(data.request === "failed" || data.length<1){
        this.setState({ message: data.error, open: true, snackcolor: "error"});
      } else {
        this.setState({ customer: data })
      }
    })
  }

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchOrders();
      this.fetchCustomer();
    }
  }

  render() {
    const { orders, isLoading, customer } = this.state;
    const { classes } = this.props;

    if (sessionStorage.getItem("authToken") == null){
      return <Redirect to='/login' />
    }

    if (isLoading) {
      return (<div className={classes.paper}><CircularProgress/></div>);
    }
    var emptyText = "";
    if(orders.length===0){
      emptyText = <h4>---Für diesen Kunden sind keine Aufträge hinterlegt---</h4>
    }
    return (
      <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div  className={classes.paper}>
          <h1>Übersicht Kunde - Aufträge</h1><br />
          <SnackbarMessage
            open={this.state.open}
            onClose={this.handleSnackbarClose}
            message={this.state.message}
            color={this.state.snackcolor}>
          </SnackbarMessage>
          <h2>{customer.customer_name}</h2>
          <List className={classes.mainlist}>
            {emptyText}
            {orders.map((order, i) => (
            <div>
            <ListItem>
              <ListItemIcon >
                <Checkbox
                  onChange={() => this.handleCheck(order.order_id)}
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar >
                  <GavelOutlinedIcon  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={order.order_id + ": " + order.order_title} secondary={order.order_starting} />
              <ListItemSecondaryAction>
                <IconButton title="Bearbeiten" href={"/order/" + order.order_id} edge="end">
                  <EditIcon />
                </IconButton>
                <IconButton title="Löschen" onClick={() => this.handleDelete(order.order_id)}edge="end">
                  <DeleteIcon />
                </IconButton>
                <IconButton title="Rechnung" onClick={() => this.requestInvoice(order.order_id)} edge="end">
                  <AccountBalanceIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            </div>
            ))}
          </List>
          <Button
            type="submit"
            fullWidth
            disabled={this.state.buttondisabled}
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={() => {this.requestInvoice()}}
        >
            Erstelle Rechnung ({this.state.checkedforinvoice.length})
        </Button>
          </div>
        </Container>
        
    )
  }
}

export default withStyles(useStyles) (CustomerOrders);