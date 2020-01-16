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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
});

class CustomerOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      checkedforinvoice: [],
      buttondisabled: true,
      customer: [],
      isLoading: false,
      error: null,
      year: 2020,
      diagram: {
        labels: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        datasets: [
          {
            label: 'Aufträge',
            backgroundColor: 'rgba(75,192,192,0.4)',
            data: [null, null, null, null, null, null, null, null, null, null, null, null]
          }
        ],
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0,
              suggestedMax: 30,
              precision: 0
            }
          }]
        }
    }
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.requestInvoice = this.requestInvoice.bind(this);
    this.fetchCustomer = this.fetchCustomer.bind(this);
    this.fetchStatistics = this.fetchStatistics.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCheck(orderid){
    this.setState({ buttondisabled: false })
    const id = parseInt(orderid)
    this.setState({ checkedforinvoice: [...this.state.checkedforinvoice, id] });
    if(this.state.checkedforinvoice.includes(id)){
      let filteredArray = this.state.checkedforinvoice.filter(item => item !== id)
      this.setState({ checkedforinvoice: filteredArray });
      if(filteredArray.length === 0){
        this.setState({ buttondisabled: true })
      }
    }
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

  requestInvoice(id) {
    var invoicelist = [];
    if(id == null){
      invoicelist = this.state.checkedforinvoice;
    }else {
      invoicelist.push(id);
    }
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
  }

  fetchCustomer() {
    const id = this.props.match.params.id;
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
      .then(data => this.setState({ customer: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  fetchStatistics(year){
    this.setState({ year: year });
    var that = this;
    if(year==null){
      return;
    }
    year = year.toString();
    fetch("http://localhost:3001/api/customers/statistics", {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
     },body: JSON.stringify({
        "id": this.props.match.params.id,
        "year": year
    })})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then((data => {
        var datasetsCopy = that.state.diagram.datasets.slice(0);
        var dataCopy = [null, null, null, null, null, null, null, null, null, null, null, null];
        data.map((stats) => {
          var monthint = parseInt(stats.month)-1;
          dataCopy[monthint] = stats.anzahl;
        });
        datasetsCopy[0].data = dataCopy;
        that.setState({diagram: Object.assign({}, that.state.diagram, {datasets: datasetsCopy})});
      }))
      .catch(error => this.setState({ error}));
  }

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchOrders();
      this.fetchStatistics(this.state.year);
      this.fetchCustomer();
    }
  }

  render() {
    const { orders, isLoading, customername } = this.state;
    const { classes } = this.props;

    if (sessionStorage.getItem("authToken") == null){
      return <Redirect to='/login' />
    }

    if (isLoading) {
      return (<div className={classes.paper}><CircularProgress/></div>);
    }
    var emptyText = "";
    if(orders.length==0){
      emptyText = <h4>---Für diesen Kunden sind keine Aufträge hinterlegt---</h4>
    }
    return (
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div  className={classes.paper}>
          <h1>Übersicht Kunde - Aufträge</h1><br />
          <List className={classes.root}>
            {emptyText}
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
              <ListItemText primary={order.order_id + ": " + order.order_title} secondary={order.order_starting} />
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
          <Button
            type="submit"
            fullWidth
            disabled={this.state.buttondisabled}
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={() => {this.requestInvoice()}}
        >
            Erstelle Rechnung ({this.state.checkedforinvoice.length})
        </Button>
          </div>
        </Container>
        
    )
  }
}

export default withStyles(useStyles) (CustomerOrders);