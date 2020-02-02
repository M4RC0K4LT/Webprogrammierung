import React from 'react'
import { Container, CssBaseline, CircularProgress, withStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction, Fab } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, List as ListIcon, PermIdentityOutlined as PermIdentityOutlinedIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, DeleteDialog } from "../exports";
import { getCustomers, deleteCustomer} from "../../api/exports"

class ListOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      isLoading: false,
      error: null,

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
  }

  handleSnackbarClose(){
    this.setState({ open: false });
  }

  fetchCustomers() {    
    this.setState({ isLoading: true });
    getCustomers().then(data => {
      this.setState({ isLoading: false })
      if(data.length<1 || data.request === "failed"){
        this.setState({ message: data.error, open: true, snackcolor: "error" });
      }else{
        this.setState({ customers: data })
      }
    })
  }

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

  componentDidMount() {
    this.fetchCustomers();
  }

  render() {
    const { customers, isLoading } = this.state;
    const { classes } = this.props;

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
              onAgree={() => (
                  this.handleDelete(this.state.selectedCustomer),
                  this.setState({ openDeleteDialog: false })
              )}
              delMessage={"Kunde '" + this.state.selectedCustomer + " - " + this.state.selectedCustomer_name + "'"}>
            </DeleteDialog>
            <List className={classes.mainlist}>
            {customers.map((customer, i) => (
                <ListItem key={i}>
                    <ListItemAvatar>
                    <Avatar >
                        <PermIdentityOutlinedIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={customer.customer_name} secondary={customer.customer_id + " - " + customer.customer_company + " - " + customer.customer_town} />
                    <ListItemSecondaryAction>
                    <IconButton href={"/customer/" + customer.customer_id} edge="end">
                        <EditIcon />
                    </IconButton>
                    <IconButton title="Löschen" onClick={() => this.setState({selectedCustomer: customer.customer_id, selectedCustomer_name: customer.customer_name, openDeleteDialog: true})}edge="end">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton href={"/customer/statistics/" + customer.customer_id} edge="end">
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

export default withStyles(useStyles) (ListOrders);