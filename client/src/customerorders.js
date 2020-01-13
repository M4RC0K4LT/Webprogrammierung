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
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
});

class CustomerOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      checkedforinvoice: [],
      buttondisabled: true,
      customername: null,
      isLoading: false,
      error: null,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.requestInvoice = this.requestInvoice.bind(this);
  }

  handleCheck(orderid){
    this.setState({ buttondisabled: false })
    const id = parseInt(orderid)
    this.setState({ checkedforinvoice: [...this.state.checkedforinvoice, id] });
    if(this.state.checkedforinvoice.includes(id)){
      let filteredArray = this.state.checkedforinvoice.filter(item => item !== id)
      this.setState({ checkedforinvoice: filteredArray });
      if(filteredArray.length == 0){
        this.setState({ buttondisabled: true })
      }
    }
  }

  requestInvoice() {
    fetch("http://localhost:3001/api/orders/get/invoice", {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
     },body: JSON.stringify({
        "idlist": this.state.checkedforinvoice,
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

  fetchOrders() {
    const id = this.props.match.params.id;
    this.setState({ isLoading: true });
    fetch("http://localhost:3001/api/orders/customer/" + id, {
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
      .then(data => this.setState({ orders: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
    this.setState({ isLoading: true });
    fetch("http://localhost:3001/api/customers/" + id, {
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
      .then(data => this.setState({ customername: data.customer_name, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchOrders();
    }
  }

  render() {
    const { orders, isLoading, error, customername } = this.state;
    const { classes } = this.props;

    if (sessionStorage.getItem("authToken") == null){
      return <Redirect to='/login' />
    }

    if (isLoading) {
      return (<div className={classes.paper}><CircularProgress/></div>);
    }
    return (
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div  className={classes.paper}>
          <h1>Overview for Customer:</h1>
          <h2 >{customername}</h2><br/>
          <List className={classes.root}>
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
              <ListItemText primary={order.order_id + ": " + order.order_title} secondary={order.order_ending} />
              <ListItemSecondaryAction>
                <IconButton href={"/order/" + order.order_id} edge="end">
                  <EditIcon />
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
            Create invoice ({this.state.checkedforinvoice.length})
        </Button>
          </div>
        </Container>
    )
  }
}

export default withStyles(useStyles) (CustomerOrders);