import React from 'react'
import './index.css'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Fab from '@material-ui/core/Fab';
import useStyles from "./components/useStyles";
import getCustomers from "./api/getCustomers"
import SnackbarMessage from './components/snackbarmessage'

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

    if (sessionStorage.getItem("authToken") == null){
      return <Redirect to='/login' />
    }

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