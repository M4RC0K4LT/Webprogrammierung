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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
      backgroundColor: theme.palette.error.dark,
  },
  message: {
      display: 'flex',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  addbutton: {
    margin: 20,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed'
  }
});

class Orders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false,
      error: null,
      filtered: [],
    };
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  requestInvoice(id) {
    var invoicelist = [];
    invoicelist.push(id);
    fetch("http://localhost:3001/api/orders/get/invoice", {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
     },body: JSON.stringify({
        "idlist": invoicelist,
    })})
      .then(res => res.blob())
      .then(response => {
        const file = new Blob(
          [response], 
          {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  handleDelete(id){
    var that = this;

    fetch('http://localhost:3001/api/orders/', {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        },
        body: JSON.stringify({
            "id": id,
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.request === "failed"){
            that.setState({ isLoading: false });
        }else{
            that.setState({ isLoading: false})
            this.fetchOrders();

        }
    })
    .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
  }

  fetchOrders() {
    this.setState({ isLoading: true });
    fetch("http://localhost:3001/api/orders/", {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
      }})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ orders: data, filtered: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
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
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="/addorder">
            <AddIcon/>
          </Fab>
          <List className={classes.root}>
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