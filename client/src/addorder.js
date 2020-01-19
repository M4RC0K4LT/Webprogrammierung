import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom'
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import moment from "moment";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SnackbarMessage from './components/snackbarmessage'
import getCustomers from './api/getCustomers'
import postOrder from './api/postOrder'
import useStyles from "./components/useStyles";

class AddOrder extends Component {

    constructor(props){
        super(props);
        
        var today = new Date().toISOString().slice(0,10).toString() + " 06:00";

        this.state = {
            customers: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            data: null,
            disablefields: false,

            order_id: "",
            title: "",
            description: "",
            customer: null,
            traveldistance: "",
            hourlyrate: "",
            startTime: today,
            duration: 0,


        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this); 
        this.valuetext = this.valuetext.bind(this);
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
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
        getCustomers().then(data => {
            this.setState({isLoading: false, customers: data})
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, message: data.error})
            }
        })
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
        if(this.state.duration === 0){
            this.setState({ open: true, message: "Bitte wähle eine gültige Dauer"})
            return;
        }

        this.setState({ isLoading: true, disablefields: true });
        const { title, description, startTime, duration, hourlyrate, traveldistance, customer } = this.state;
        postOrder([title, description, startTime, duration, hourlyrate, traveldistance, customer.customer_id]).then(data => {
            this.setState({ isLoading: false })
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
            }else{
                this.setState({ 
                    message: "Auftrag erfolgreich hinzugefügt", 
                    snackcolor: "success", 
                    open: true, 
                    order_id: data.order_id,
                    title: data.order_title,
                    description: data.order_description,
                    customer: data.order_customer,
                    startTime: data.order_starting,
                    duration: data.order_duration*60,
                    hourlyrate: data.order_hourlyrate,
                    traveldistance: data.order_traveldistance,
                    disablefields: true })
            }
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    componentDidMount() {
        if (sessionStorage.getItem("authToken") != null){
          this.fetchCustomers();
        }
    }

    render() {
        const { classes } = this.props;
        const { isLoading, disablefields } = this.state;

        var loading = null;
        if (isLoading && disablefields) {
            loading = <CircularProgress style={{position: "absolute", top: "45%"}} size={100}/>;
        }

        if (isLoading && disablefields === false) {
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
                <Button className={classes.submit} variant="outlined" color="primary" href={"/order/" + this.state.order_id}>
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
                    {loading}
                    <SnackbarMessage
                        open={this.state.open}
                        onClose={this.handleSnackbarClose}
                        message={this.state.message}
                        color={this.state.snackcolor}>
                    </SnackbarMessage>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        value={this.state.title}
                        margin="normal"
                        required
                        fullWidth
                        label="Titel"
                        name="title"
                        onChange={this.handleInputChange}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Beschreibung"
                        multiline={true}
                        name="description"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                        disabled={this.state.disablefields}
                    />
                    <Autocomplete
                        options={this.state.customers}
                        getOptionLabel={option => option.customer_id + " - " + option.customer_name}
                        autoSelect={true}
                        autoHighlight={true}
                        autoComplete={true}
                        clearOnEscape={true}
                        disabled={this.state.disablefields}
                        name="customer"
                        inputValue={this.state.customer}
                        onChange={(event, value) => this.setState({ customer: value})}
                        renderInput={params => (
                            <TextField {...params} margin="normal" fullWidth label="Zugehöriger Kunde" variant="outlined" required />
                        )}
                    />                    
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Fahrtstrecke - optional"
                        name="traveldistance"
                        value={this.state.traveldistance}
                        onChange={this.handleInputChange}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        name="hourlyrate"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Stundensatz - nur wenn auftragsspezifisch"
                        onChange={this.handleInputChange}
                        value={this.state.hourlyrate}
                        disabled={this.state.disablefields}
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
                        />
                    </MuiPickersUtilsProvider>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7}>
                            <Slider
                                margin="normal"
                                value={this.state.duration}
                                aria-labelledby="discrete-slider-small-steps"
                                step={15}
                                min={0}
                                max={600}
                                valueLabelDisplay="off"
                                name="duration"
                                onChange={ (e, value) => this.setState({ duration: value }) }
                                valueLabelFormat={this.valuetext}
                                disabled={this.state.disablefields}

                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                value={this.state.duration/60 + "h - " + moment(this.state.startTime).add(this.state.duration, "m").format("HH:mm")}
                                disabled={true}
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