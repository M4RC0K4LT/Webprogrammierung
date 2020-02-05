import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, withStyles, List, ListItem, ListItemText, ListItemIcon, Checkbox, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction, Button, Typography } from '@material-ui/core';
import { Edit as EditIcon, GavelOutlined as GavelOutlinedIcon, Delete as DeleteIcon, AccountBalance as AccountBalanceIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, DeleteDialog } from "../exports";
import { getCustomer, getInvoice, getCustomerOrders, deleteOrder} from "../../api/exports"

/** ListCustomerOrders Component to display orders related to one customer */
class ListCustomerOrders extends React.Component {

  //Initializes AlertDialogs and error handling
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

      openDeleteDialog: false,
      selectedOrder: null,
      selectedOrder_title: null,
    }
    this.handleCheck = this.handleCheck.bind(this);
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchCustomer = this.fetchCustomer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  //Close Error/Success Message
  handleSnackbarClose(){
    this.setState({ open: false })
  }
  
  //Handle checked orders for invoice creation
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

  //Handle Order delete
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

  //Request invoice for checked orders
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

  //Get customer related orders
  fetchOrders() {
    const id = this.props.id;
    this.setState({ isLoading: true });
    getCustomerOrders(id).then(data => {
      this.setState({ isLoading: false })
      if(data.request === "failed"){
        this.setState({ message: data.error, open: true, snackcolor: "error"});
      } else {
        this.setState({ orders: data })
      }
    })
  }

  //Get customer data/information
  fetchCustomer() {
    const id = this.props.id;
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
    this.fetchOrders();
    this.fetchCustomer();
  }

  render() {
    const { orders, isLoading, customer } = this.state;
    const { classes } = this.props;

    //No Entries
    let nulltext = null;
    if(orders.length<1){
      nulltext = <Typography component="h1" variant="subtitle2">- Keine Einträge vorhanden -</Typography>
    }

    //LoadingIcon
    if (isLoading) {
      return (<div className={classes.paper}><CircularProgress/></div>);
    }

    return (
        <div className={classes.ListItems}>
            <SnackbarMessage
                open={this.state.open}
                onClose={this.handleSnackbarClose}
                message={this.state.message}
                color={this.state.snackcolor}>
            </SnackbarMessage>
            <DeleteDialog
              open={this.state.openDeleteDialog}
              onClose={() => this.setState({openDeleteDialog: false})}
              onAgree={() => {
                  this.handleDelete(this.state.selectedOrder);
                  this.setState({ openDeleteDialog: false });
              }}
              delMessage={"Auftrag '" + this.state.selectedOrder + " - " + this.state.selectedOrder_title + "'"}>
            </DeleteDialog>
            <h2>{customer.customer_name}</h2>
            <List className={classes.mainlist}>
                {nulltext}
                {orders.map((order, i) => (
                    <ListItem key={i}>
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
                            <IconButton title="Bearbeiten" component={Link} to={"/orders/" + order.order_id} edge="end">
                            <EditIcon />
                            </IconButton>
                            <IconButton title="Löschen" onClick={() => this.setState({selectedOrder: order.order_id, selectedOrder_title: order.order_title, openDeleteDialog: true})}edge="end">
                            <DeleteIcon />
                            </IconButton>
                            <IconButton title="Rechnung" onClick={() => this.requestInvoice(order.order_id)} edge="end">
                            <AccountBalanceIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
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
    )
  }
}

/**
 * Defines the ListCustomerOrders Component.
 * Displays orders belonging to one customer
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ListCustomerOrders Component
 */
export default withStyles(useStyles) (ListCustomerOrders);