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
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import useStyles from "./components/useStyles";
import deleteOrder from './api/deleteOrder';
import getOrders from './api/getOrders';
import getInvoice from './api/getInvoice';
import SnackbarMessage from './components/snackbarmessage'

class Orders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false,
      error: null,
      filtered: [],
      message: "",
      open: false,
      snackcolor: "error",
    };
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

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

  handleDelete(id){
    this.setState({ isLoading: true });
      deleteOrder(id).then(data => {
        this.setState({ isLoading: false });
        if(data.length<1 || data.request === "failed"){
          this.setState({ open: true, message: data.error, snackcolor: "error"});
        }else{
          this.fetchOrders() 
        }
      })
  }

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
    const { filtered, isLoading } = this.state;
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
          <h1>Auftragsübersicht</h1>
          <SnackbarMessage
            open={this.state.open}
            onClose={this.handleSnackbarClose}
            message={this.state.message}
            color={this.state.snackcolor}>
          </SnackbarMessage>
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="/addorder">
            <AddIcon/>
          </Fab>
          <List className={classes.mainlist}>
            {filtered.map((order, i) => (
            <div>
            <ListItem key={order.order_title}>
              <ListItemAvatar>
                <Avatar >
                  {order.order_id}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={order.order_title} secondary={order.order_starting + ":  " + order.order_description.slice(0, 15)} />
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
          </div>
        </Container>
    )
  }
}

export default withStyles(useStyles) (Orders);