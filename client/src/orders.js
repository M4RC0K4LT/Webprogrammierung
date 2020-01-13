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
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

class Orders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      isLoading: false,
      error: null,
      filtered: [],
    };
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
    const { orders, filtered, isLoading, error } = this.state;
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
          <h1>Order Overview</h1>
          <Fab size="medium" color="primary" aria-label="add" href="/addorder">
            <AddIcon/>
          </Fab>
          <List className={classes.root}>
            {filtered.map((order, i) => (
            <div>
            <ListItem key={order.order_title}>
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
          </div>
        </Container>
    )
  }
}

export default withStyles(useStyles) (Orders);