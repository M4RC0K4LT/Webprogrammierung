import React from 'react'
import { CircularProgress, withStyles, Avatar, List, ListItem, ListItemText, ListItemAvatar, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, AccountBalance as AccountBalanceIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, DeleteDialog } from "../exports";
import { deleteOrder, getOrders, getInvoice } from "../../api/exports"

/** ListOrders Component to display all registered orders */
class ListOrders extends React.Component {

  //Initializes AlertDialog, error handling and empty list
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false,

      message: "",
      open: false,
      snackcolor: "error",

      openDeleteDialog: false,
      selectedOrder: null,
      selectedOrder_title: null,
    };
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  //Close Error/Success Message
  handleSnackbarClose(){
    this.setState({ open: false })
  }

  //Create invoice for selected order
  requestInvoice(id) {
    var invoicelist = [];
    invoicelist.push(id);
    getInvoice(invoicelist).then(response => {
      if(response.request === "failed"){
        this.setState({ open: true, message: response.error, snackcolor: "error"});
      }else{
        const file = new Blob(
          [response], 
          {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  //Handle delete of selected order
  handleDelete(id){
      deleteOrder(id).then(data => {
        if(data.length<1 || data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
        }else{
          this.fetchOrders() 
        }
      })
  }

  //Get all registered orders
  fetchOrders() {
    this.setState({ isLoading: true });
    getOrders().then(data => {
      this.setState({ isLoading: false });
      if(data.length<1 || data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
      }else{
          this.setState({ orders: data, filtered: data })
      }
    })
  }


  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchOrders();
    }
  }

  render() {
    const { orders, isLoading } = this.state;
    const { classes } = this.props

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
            <List className={classes.mainlist}>
                {orders.map((order, i) => (
                <ListItem key={i}>
                <ListItemAvatar>
                    <Avatar >
                    {order.order_id}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={order.order_title} secondary={order.order_starting + ":  " + order.order_description.slice(0, 15)} />
                <ListItemSecondaryAction>
                    <IconButton title="Bearbeiten" href={"/orders/" + order.order_id} edge="end">
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
        </div>
    )
  }
}

/**
 * Defines the ListOrders Component.
 * Displays all registered orders.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ListOrders Component
 */
export default withStyles(useStyles) (ListOrders);