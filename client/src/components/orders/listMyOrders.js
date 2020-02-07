import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Avatar, List, ListItem, ListItemText, ListItemAvatar, IconButton, ListItemSecondaryAction, Typography, TextField, Button, ButtonGroup } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, DeleteDialog, UserOrdersChart } from "../exports";
import { deleteOrder, getOrdersByUser, getUsers, getUser } from "../../api/exports"

/** ListMyOrders Component to display all registered orders created by current user */
class ListMyOrders extends React.Component {

  //Initializes AlertDialog, error handling and empty list
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      orders: [],
      isLoading: false,
      filter: "",
      filtered: [],
      users: [],
      currentUsername: null,

      watchedUserID: null,
      watchedUserName: null,
      arrayposition: 0,

      message: "",
      open: false,
      snackcolor: "error",

      openDeleteDialog: false,
      selectedOrder: null,
      selectedOrder_title: null,
    };

    this.fetchOrdersByUser = this.fetchOrdersByUser.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  //Close Error/Success Message
  handleSnackbarClose(){
    this.setState({ open: false })
  }

  //Handle delete of selected order
  handleDelete(id){
      deleteOrder(id).then(data => {
        if(data.length<1 || data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
        }else{
          this.fetchOrdersByUser() 
        }
      })
  }

  //Get all registered orders created by current user
  fetchOrdersByUser(id) {
    this.setState({ isLoading: true, filtered: [] });
    getOrdersByUser(id).then(data => {
      this.setState({ isLoading: false });
      if(data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
      }else{
          this.setState({ orders: data, filtered: data })
      }
    })
  }

  //Get all registered orders created by current user
  getAllUsers() {
    getUsers().then(data => {
      if(data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
      }else{
          this.setState({ users: data })
          data.map((user, i) => {
            if(user.user_name === this.state.currentUsername){
              this.setState({ arrayposition: i });
              this.fetchOrdersByUser(user.user_id)
            }
            return user;
          })
      }
    })
  }

  //Select next user in "User-Array" and load his orders
  showNextUser(newarrayposition){
    let newposition = newarrayposition;
    this.setState({ arrayposition: newarrayposition })
    if(newarrayposition<0){
      newposition = this.state.users.length-1;
      this.setState({ arrayposition: newposition })
    }
    if(newarrayposition>this.state.users.length-1){
      newposition = 0;
      this.setState({ arrayposition: 0 })
    }
    this.fetchOrdersByUser(this.state.users[newposition].user_id);
    this.setState({ watchedUserID: this.state.users[newposition].user_id, watchedUserName: this.state.users[newposition].user_name });
  }

  //Get data of current user
  fetchUser() {
    getUser().then(data => {
        this.setState({ isLoading: false });
        if(data.length<1 || data.request === "failed"){
            this.setState({ open: true, snackcolor: "error", message: data.error })
        }else {
            this.setState({ 
                watchedUserID: data.user_id,
                watchedUserName: data.user_name,
                currentUsername: data.user_name,
             })
        }
    })
}

  //EventHandler: changing Value of controlled Searchbar and search for a order
  handleSearch(event) {
    let new_value = event.target.value;
    this.setState({
      filter: new_value
    });
    let filterd_new = [];
    this.state.orders.map((order) => {
      if(order.order_description.toLowerCase().includes(new_value) || order.order_title.toLowerCase().includes(new_value) || JSON.stringify(order.order_id).toLowerCase().includes(new_value) || JSON.stringify(order.order_starting).toLowerCase().includes(new_value)){
        filterd_new.push(order);
      }
      return order;
    });
    this.setState({filtered: filterd_new})
  }


  componentDidMount() {
    this.fetchUser();
    this.getAllUsers();
  }

  render() {
    const { filtered, filter, watchedUserName, watchedUserID, arrayposition, showList } = this.state;
    const { classes } = this.props

    //No Entries
    let nulltext = null;
    if(filtered.length<1){
      nulltext = <Typography component="h1" variant="subtitle2">- Keine Einträge vorhanden -</Typography>
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


            Wähle deine Kollegen:<br/><br/>
            <ButtonGroup variant="contained" size="small" color="primary" aria-label="contained primary button group">
              <Button onClick={() => this.showNextUser(arrayposition-1)}><ArrowBackIcon /></Button>
              <Button>  {watchedUserName}  </Button>
              <Button onClick={() => this.showNextUser(arrayposition+1)}><ArrowForwardIcon /></Button>
            </ButtonGroup><br/><br/>

            <UserOrdersChart userid={watchedUserID}></UserOrdersChart>

            <List className={classes.mainlist} style={{display: showList ? 'block' : 'none' }}>
              <TextField className={classes.searchBar} size="small" placeholder="Suche nach Aufträgen..." variant="outlined" value={filter} onChange={this.handleSearch}/>
                {nulltext}
                {filtered.map((order, i) => (
                <ListItem key={i}>
                <ListItemAvatar>
                    <Avatar >
                    {order.order_id}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={order.order_title} secondary={order.order_starting + " -- " + order.order_duration + "h"} />
                <ListItemSecondaryAction>
                    <IconButton title="Bearbeiten" component={Link} to={"/orders/" + order.order_id} edge="end">
                      <EditIcon />
                    </IconButton>
                    <IconButton title="Löschen" onClick={() => this.setState({selectedOrder: order.order_id, selectedOrder_title: order.order_title, openDeleteDialog: true})}edge="end">
                      <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                </ListItem>
                ))}        
            </List>

            <ButtonGroup variant="outlined" size="small" color="primary" style={{display: showList ? 'none' : 'block' }}>
              <Button onClick={() => {
                if(showList){
                  this.setState({ showList: false });
                }else {
                  this.setState({ showList: true });
                }}}>
                  Zeige dem User zugehörige Aufträge
                </Button>
            </ButtonGroup>
        </div>
    )
  }
}

/**
 * Defines the ListMyOrders Component.
 * Displays all registered orders done/created by current user.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ListOrders Component
 */
export default withStyles(useStyles) (ListMyOrders);