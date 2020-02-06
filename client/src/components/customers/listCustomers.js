import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, withStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction, Typography, TextField } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, List as ListIcon, PermIdentityOutlined as PermIdentityOutlinedIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, DeleteDialog } from "../exports";
import { getCustomers, deleteCustomer} from "../../api/exports"

/** ListCustomers Component to display all registered customers */
class ListCustomers extends React.Component {

  //Initializes AlertDialog, error handling and emtpy list
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      isLoading: false,
      filtered: [],
      filter: "",

      open: false,
      message: "",
      snackcolor: "error",

      openDeleteDialog: false,
      selectedCustomer: null,
      selectedCustomer_name: null,
    };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.fetchCustomers = this.fetchCustomers.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  //Close Error/Success Message
  handleSnackbarClose(){
    this.setState({ open: false });
  }

  //Get all Customers
  fetchCustomers() {    
    this.setState({ isLoading: true });
    getCustomers().then(data => {
      this.setState({ isLoading: false })
      if(data.request === "failed"){
        this.setState({ message: data.error, open: true, snackcolor: "error" });
      }else{
        this.setState({ customers: data, filtered: data })        
      }
    })
  }

  //Handle customer delete
  handleDelete(){
    const id = this.state.selectedCustomer;
    deleteCustomer(id).then(data => {
        if(data.request === "failed" || data.length<1){
            if(data.code === "SQLITE_CONSTRAINT"){
                this.setState({ message: "Fehler: Kunde hat noch zugehörige Aufträge", open: true, snackcolor: "error", disablefields: false });
            }else {
                this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
            }
        }else{
            this.fetchCustomers();
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
    this.state.customers.map((customer) => {
      if(customer.customer_name.toLowerCase().includes(new_value) || customer.customer_company.toLowerCase().includes(new_value) || JSON.stringify(customer.customer_id).toLowerCase().includes(new_value) || JSON.stringify(customer.customer_zipcode).toLowerCase().includes(new_value) || JSON.stringify(customer.customer_town).toLowerCase().includes(new_value)){
        filterd_new.push(customer);
      }
      return customer;
    });
    this.setState({filtered: filterd_new})
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  render() {
    const { filtered, filter, isLoading } = this.state;
    const { classes } = this.props;

    //No Entries
    let nulltext = null;
    if(filtered.length<1){
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
                  this.handleDelete(this.state.selectedCustomer);
                  this.setState({ openDeleteDialog: false });
              }}
              delMessage={"Kunde '" + this.state.selectedCustomer + " - " + this.state.selectedCustomer_name + "'"}>
            </DeleteDialog>
            <TextField className={classes.searchBar} size="small" placeholder="Suche nach Kunden..." variant="outlined" value={filter} onChange={this.handleSearch}/>
            <List className={classes.mainlist}>
            {nulltext}
            {filtered.map((customer, i) => (
                <ListItem key={i}>
                    <ListItemAvatar>
                    <Avatar >
                        <PermIdentityOutlinedIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={customer.customer_name} secondary={customer.customer_id + " - " + customer.customer_company} />
                    <ListItemSecondaryAction>
                    <IconButton component={Link} to={"/customers/" + customer.customer_id} edge="end">
                        <EditIcon />
                    </IconButton>
                    <IconButton title="Löschen" onClick={() => this.setState({selectedCustomer: customer.customer_id, selectedCustomer_name: customer.customer_name, openDeleteDialog: true})}edge="end">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton component={Link} to={"/customer/statistics/" + customer.customer_id} edge="end">
                        <ListIcon />
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
 * Defines the ListCustomers Component.
 * Displays all registered customers.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ListCustomers Component
 */
export default withStyles(useStyles) (ListCustomers);