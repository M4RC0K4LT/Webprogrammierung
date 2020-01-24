import React from 'react'
import { Container, CssBaseline, CircularProgress, withStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, ListItemSecondaryAction, Fab } from '@material-ui/core';
import { Edit as EditIcon, Add as AddIcon, List as ListIcon, PermIdentityOutlined as PermIdentityOutlinedIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage } from "../components/exports";
import { getCustomers} from "../api/exports"

class Customers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      isLoading: false,
      error: null,

      open: false,
      message: "",
      snackcolor: "error",
    };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.fetchCustomers = this.fetchCustomers.bind(this);
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

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchCustomers();
    }   
  }

  render() {
    const { customers, isLoading } = this.state;
    const { classes } = this.props;

    if (isLoading) {
      return (<div className={classes.paper}><CircularProgress/></div>);
    }

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div  className={classes.paper}>
        <h1>Kundenübersicht</h1>
        <SnackbarMessage
          open={this.state.open}
          onClose={this.handleSnackbarClose}
          message={this.state.message}
          color={this.state.snackcolor}>
        </SnackbarMessage>
        <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="addcustomer">
          <AddIcon />
        </Fab>
        <List className={classes.mainlist}>
          {customers.map((customer, i) => (
          <div>
          <ListItem>
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
              <IconButton href={"/customer/statistics/" + customer.customer_id} edge="end">
                <ListIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          </div>
          ))}        
        </List>
        </div>
      </Container>
    )
  }
}

export default withStyles(useStyles) (Customers);