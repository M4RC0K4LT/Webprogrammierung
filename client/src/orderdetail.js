import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { Redirect } from 'react-router-dom'
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import { green } from '@material-ui/core/colors';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import moment from "moment";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SnackbarMessage from './components/snackbarmessage'

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
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: green[500],
    },
    message: {
        display: 'flex',
    },
});

class Orderdetail extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            orderdata: [],
            customers: [],
            customer: null,
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            startTime: null,
            duration: null,
            disablefields: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.valuetext = this.valuetext.bind(this);
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
    }   
    
    handleSnackbarClose(){
        this.setState({ open: false })
    }

    handleStartTime = (time) => {
        this.setState({ startTime: time })
    }

    valuetext(value){
        var hours = value/60;
        return hours;
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        if(!(this.state.customers.includes(this.state.customer))){
            this.setState({ open: true, message: "Bitte wähle einen gültigen Kunden", snackcolor: "error"})
            return;
        }
        if(this.state.duration == 0){
            this.setState({ open: true, message: "Bitte wähle eine gültige Dauer", snackcolor: "error"})
            return;
        }
        var that = this;
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/orders/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "title": this.order_title.value,
                "description": this.order_description.value,
                "starting":  moment(this.state.startTime).format("YYYY-MM-DD HH:mm"),
                "duration": this.state.duration/60,
                "hourlyrate": this.order_hourlyrate.value,
                "traveldistance": this.order_traveldistance.value,
                "customer": this.state.customer.customer_id
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ orderdata: data, isLoading: false}))
        .then(function(){
            if(that.state.orderdata.request === "failed"){
                that.setState({ message: "Something went wrong", open: true, snackcolor: "error" });
                setTimeout(() => {
                    that.fetchOrder();
                  }, 1000);
            }else{
                that.setState({ message: "Changes saved successfully!", snackcolor: "success", open: true, disablefields: true })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    handleDelete(){
        var that = this;
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });

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
                that.setState({ message: "Something went wrong", open: true, snackcolor: "error", isLoading: false });
            }else{
                that.setState({ message: "Order deleted successfully! You get redirected", snackcolor: "success", open: true, isLoading: false, orderdata: [] })
                setTimeout(() => {
                    window.location.replace("/orders")
                }, 2000);

            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    fetchOrder() {
        var that = this;
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });
        fetch("http://localhost:3001/api/orders/" + id, {
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
          .then(data => this.setState({ orderdata: data, isLoading: false, message: data.request, startTime: data.order_starting, duration: data.order_duration*60 }))
          .then(function(){
            if(that.state.message === "failed"){
                that.setState({ open: true, message: that.state.orderdata.error.message, snackcolor: "error"})
            }else{
                that.setState({ open: false })
            }
        })
          .catch(error => this.setState({ error, isLoading: false, message: error.message, open: true, snackcolor: "error" }));
    }

    fetchCustomers() { 
        var that = this;   
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
          .then(function(){
                that.state.customers.map((cust) => {
                if(cust.customer_id == that.state.orderdata.order_customer){
                    that.setState({ customer: cust})
                }
            });
          })
          .catch(error => this.setState({ error, isLoading: false }));
    }

    componentDidMount() {
        if (sessionStorage.getItem("authToken") != null){
            if(!(this.state.disablefields)){
                this.fetchOrder();
                this.fetchCustomers();
            }          
        }
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, open, message } = this.state;

        if (isLoading) {
            return (<div className={classes.paper}><CircularProgress/></div>);
        }

        if (sessionStorage.getItem("authToken") == null){
            return <Redirect to='/login' />
        }

        var buttons = ""
        if(this.state.disablefields){
            buttons = (
                <Grid
                  justify="space-between"
                  container
                  margin="normal" 
                >
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" onClick={() => this.setState({ disablefields: false })}>
                    Bearbeiten
                  </Button>
                  </Grid>
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" href={"/orders"}>
                    Zur Übersicht
                  </Button>
                  </Grid>
                </Grid>
                );
        }else {
            buttons = (<div><Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Auftrag abändern
            </Button>
            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                className={classes.delete}
                onClick={() => {this.handleDelete()}}
            >
                    <DeleteOutlineOutlinedIcon edge="end" />
            </Button></div>
        )
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <GavelOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Auftragsdetails
                    </Typography>
                    <br/>
                    <SnackbarMessage
                        open={this.state.open}
                        onClose={this.handleSnackbarClose}
                        message={this.state.message}
                        color={this.state.snackcolor}>
                    </SnackbarMessage>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        inputRef={(inputRef) => {this.order_id = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled="true"
                        label="AuftragsID"
                        value={this.state.orderdata.order_id}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_title = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Titel"   
                        disabled={this.state.disablefields}
                        defaultValue={this.state.orderdata.order_title}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_description = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Beschreibung"
                        disabled={this.state.disablefields}
                        defaultValue={this.state.orderdata.order_description}
                    />
                    <Autocomplete
                        options={this.state.customers}
                        getOptionLabel={option => option.customer_id + " - " + option.customer_name}
                        autoSelect={true}
                        autoHighlight={true}
                        autoComplete={true}
                        clearOnEscape={true}
                        fullWidth
                        disabled={this.state.disablefields}
                        value={this.state.customer}
                        //onInputChange={(event, value, reason) => this.setState({ customer: value})}
                        onChange={(event, value) => this.setState({ customer: value})}
                        
                        renderInput={params => (
                            <TextField {...params} margin="normal" fullWidth label="Zugehöriger Kunde" variant="outlined" required />
                        )}
                    />     
                    <TextField
                        inputRef={(inputRef) => {this.order_traveldistance = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Fahrtstrecke - optional"
                        disabled={this.state.disablefields}
                        defaultValue={this.state.orderdata.order_traveldistance}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_hourlyrate = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Stundensatz - nur wenn auftragsspezifisch"
                        disabled={this.state.disablefields}
                        defaultValue={this.state.orderdata.order_hourlyrate}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            disableFuture
                            inputVariant="outlined"
                            fullWidth
                            ampm={false}
                            margin="normal"
                            label="Auftragsbeginn"
                            format="yyyy-MM-dd HH:mm"
                            value={this.state.startTime}
                            onChange={this.handleStartTime}
                            disabled={this.state.disablefields}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7}>
                            <Slider
                                margin="normal"
                                defaultValue={this.state.duration}
                                AriaValueText={this.valuetext}
                                aria-labelledby="discrete-slider-small-steps"
                                step={15}
                                min={15}
                                max={600}
                                valueLabelDisplay="off"
                                disabled={this.state.disablefields}
                                onChange={ (e, value) => this.setState({ duration: value }) }
                                valueLabelFormat={this.valuetext}

                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                value={this.state.duration/60 + "h - " + moment(this.state.startTime).add(this.state.duration, "m").format("HH:mm")}
                                disabled="true"
                                variant="outlined"
                                margin="normal"
                                label="Dauer - Ende"
                            />
                        </Grid>                     
                    </Grid>
                    {buttons}
                    </form>                   
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Orderdetail);