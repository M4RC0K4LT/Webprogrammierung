import React from 'react'
import './index.css'
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Bar } from 'react-chartjs-2';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import useStyles from "./components/useStyles";
import getCustomer from "./api/getCustomer";
import postCustomerStatistics from './api/postCustomerStatistics';
import SnackbarMessage from './components/snackbarmessage'

class CustomerStatistics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      snackcolor: "error",

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
    this.fetchCustomer = this.fetchCustomer.bind(this);
    this.fetchStatistics = this.fetchStatistics.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleSnackbarClose(){
    this.setState({ open: false });
  }
  
  fetchCustomer() {
    const id = this.props.match.params.id;
    this.setState({ isLoading: true });
    getCustomer(id).then(data => {
      this.setState({ isLoading: false });
      if(data.length<1 || data.request === "failed"){
          this.setState({ message: data.error, snackcolor: "error", open: true })
      }else{
          this.setState({ customer: data })
      }
    })
  }

  fetchStatistics(year){
    this.setState({ year: year });
    if(year==null){
      return;
    }
    year = year.toString();
    postCustomerStatistics(this.props.match.params.id, year).then(data => {
      if(data.request === "failed"){
        this.setState({ message: data.error, snackcolor: "error", open: true })
      }else{
        var datasetsCopy = this.state.diagram.datasets.slice(0);
        var dataCopy = [null, null, null, null, null, null, null, null, null, null, null, null];
        data.map((stats) => {
          var monthint = parseInt(stats.month)-1;
          return (dataCopy[monthint] = stats.anzahl);
        });
        datasetsCopy[0].data = dataCopy;
        this.setState({diagram: Object.assign({}, this.state.diagram, {datasets: datasetsCopy})});
      }
    })
  }

  componentDidMount() {
    if (sessionStorage.getItem("authToken") != null){
      this.fetchStatistics(this.state.year);
      this.fetchCustomer();
    }
  }

  render() {
    const { isLoading } = this.state;
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
          <h1>Übersicht Kunde - Statistik</h1><br />
          <SnackbarMessage
            open={this.state.open}
            onClose={this.handleSnackbarClose}
            message={this.state.message}
            color={this.state.snackcolor}>
          </SnackbarMessage>
          <Bar data={this.state.diagram} options={this.state.options}/><br />
          <ButtonGroup variant="outlined" size="small" margin="normal" color="primary" aria-label="contained primary button group">
            <Button onClick={() => this.fetchStatistics(this.state.year-1)}><ArrowBackIcon /></Button>
            <Button>{this.state.year}</Button>
            <Button onClick={() => this.fetchStatistics(this.state.year+1)}><ArrowForwardIcon /></Button>
          </ButtonGroup><br /><br />
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Kundenname:</TableCell>
                    <TableCell align="right">{this.state.customer.customer_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Firma:</TableCell>
                    <TableCell align="right">{this.state.customer.customer_company}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Stundensatz:</TableCell>
                    <TableCell align="right">{this.state.customer.customer_hourlyrate + " €/h"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Durchsch. Stundensatz:</TableCell>
                    <TableCell align="right">{parseFloat(this.state.customer.avg_hourlyrate).toFixed(2) + " €/h"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Durchschn. Fahrtstrecke:</TableCell>
                    <TableCell align="right">{parseFloat(this.state.customer.avg_traveldistance).toFixed(2) + " km"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Durchschn. Auftragsdauer:</TableCell>
                    <TableCell align="right">{parseFloat(this.state.customer.avg_duration).toFixed(2) + " h"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Durchschn. Auftragskosten:</TableCell>
                    <TableCell align="right">{parseFloat(this.state.customer.avg_ordercost).toFixed(2) + " €"}</TableCell>
                  </TableRow>
              </TableBody>
            </Table><br /><br />
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button variant="contained" color="primary" href={"/customer/" + this.props.match.params.id}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" href={"/customer/orders/" + this.props.match.params.id}>
                Aufträge
              </Button>
              </Grid>
            </Grid>
            
          </TableContainer>
          </div>
        </Container>
        
    )
  }
}

export default withStyles(useStyles) (CustomerStatistics);