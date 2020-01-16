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
      width: '100%', // Fix IE 11 issue.
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
    margin: {
        marginTop: "30px"
    }
});

class AddOrder extends Component {

    constructor(props){
        super(props);
        
        var today = new Date().toISOString().slice(0,10).toString() + " 06:00";

        this.state = {
            orderdata: [],
            customers: [],
            customer: null,
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            data: null,
            startTime: today,
            duration: 0,
            disablefields: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this); 
        this.valuetext = this.valuetext.bind(this);
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
    } 

    handleSnackbarClose(){
        this.setState({ open: false })
    }

    handleStartTime = (time) => {
        this.setState({
            startTime: time
        })
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

    valuetext(value){
        var hours = value/60;
        return hours;
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        if(!(this.state.customers.includes(this.state.customer))){
            this.setState({ open: true, message: "Bitte wähle einen gültigen Kunden"})
            return;
        }
        if(this.state.duration == 0){
            this.setState({ open: true, message: "Bitte wähle eine gültige Dauer"})
            return;
        }
        var that = this;
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "title": this.order_title.value,
                "description": this.order_description.value,
                "starting": moment(this.state.startTime).format("YYYY-MM-DD HH:mm"),
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
                that.setState({ message: "Fehler bei der Bearbeitung", open: true, snackcolor: "error" });
            }else{
                that.setState({ message: "Auftrag erfolgreich hinzugefügt", snackcolor: "success", open: true, disablefields: true })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    componentDidMount() {
        if (sessionStorage.getItem("authToken") != null){
          this.fetchCustomers();
          if(!(this.state.orderdata.length==0)){
              this.setState({ startTime: this.state.orderdata.order_starting, duration: this.state.orderdata.order_duration })
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
                <Button className={classes.submit} variant="outlined" color="primary" href={"/order/" + this.state.orderdata.order_id}>
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
        }else{
            buttons = (
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={this.state.disablefields}
                        className={classes.submit}
                    >
                        Auftrag hinzufügen
                    </Button>
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
                    Auftrag hinzufügen
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
                        inputRef={(inputRef) => {this.order_title = inputRef}}
                        variant="outlined"
                        defaultValue={this.state.orderdata.order_title}
                        margin="normal"
                        required
                        fullWidth
                        label="Titel"
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_description = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Beschreibung"
                        defaultValue={this.state.orderdata.order_description}
                        disabled={this.state.disablefields}
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
                        inputValue={this.state.orderdata.order_customer}
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
                        defaultValue={this.state.orderdata.order_traveldistance}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_hourlyrate = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        defaultValue={this.state.orderdata.order_hourlyrate}
                        label="Stundensatz - nur wenn auftragsspezifisch"
                        disabled={this.state.disablefields}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            disableFuture
                            inputVariant="outlined"
                            fullWidth
                            ampm={false}
                            margin="normal"
                            id="time-picker"
                            label="Auftragsbeginn"
                            format="yyyy-MM-dd HH:mm"
                            value={this.state.startTime}
                            onChange={this.handleStartTime}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            disabled={this.state.disablefields}
                        />
                    </MuiPickersUtilsProvider>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7}>
                            <Slider
                                margin="normal"
                                defaultValue={15}
                                AriaValueText={this.valuetext}
                                aria-labelledby="discrete-slider-small-steps"
                                step={15}
                                min={0}
                                max={600}
                                valueLabelDisplay="off"
                                onChange={ (e, value) => this.setState({ duration: value }) }
                                valueLabelFormat={this.valuetext}
                                disabled={this.state.disablefields}

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

export default withStyles(useStyles) (AddOrder);