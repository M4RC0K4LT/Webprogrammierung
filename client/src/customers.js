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
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Fab from '@material-ui/core/Fab';

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


class Customers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      isLoading: false,
      error: null,
    };
  }

  fetchCustomers() {    
    this.setState({ isLoading: true });
    fetch("http://localhost:3001/api/customers/", {
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
      .then(data => this.setState({ customers: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchCustomers();
    }   
  }

  render() {
    const { customers, isLoading, error } = this.state;
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
        <h1>Customer Overview</h1>
        <Fab size="medium" color="primary" aria-label="add" href="addcustomer">
          <AddIcon />
        </Fab>
        <List className={classes.root}>
          {customers.map((customer, i) => (
          <div>
          <ListItem>
            <ListItemAvatar>
              <Avatar >
                <PermIdentityOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={customer.customer_name} secondary={customer.customer_company} />
            <ListItemSecondaryAction>
              <IconButton href={"/customer/" + customer.customer_id} edge="end">
                <EditIcon />
              </IconButton>
              <IconButton href={"/customer/orders/" + customer.customer_id} edge="end">
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