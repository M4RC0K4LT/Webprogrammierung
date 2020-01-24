import React, { Component } from 'react';
import 'date-fns';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';
import { Container, CssBaseline, CircularProgress, withStyles, Avatar, Button, TextField, Typography, Slider, Grid } from '@material-ui/core';
import { GavelOutlined as GavelOutlinedIcon, DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, OrderFields } from "../components/exports";
import { putOrder, getCustomers, deleteOrder, getOrder } from "../api/exports"
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';

class Orderdetail extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            customers: [],
            customer: null,
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            disablefields: false,

            order_id: "",
            title: "",
            description: "",
            customerid: "",
            traveldistance: "",
            hourlyrate: "",
            startTime: null,
            duration: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.valuetext = this.valuetext.bind(this);
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
    
        this.setState({
          [name]: value
        });
        alert(this.state.customer.customer_name + this.state.customer.customer_id)
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        if(!(this.state.customers.includes(this.state.customer))){
            this.setState({ open: true, message: "Bitte wähle einen gültigen Kunden", snackcolor: "error"})
            return;
        }
        if(this.state.duration === 0){
            this.setState({ open: true, message: "Bitte wähle eine gültige Dauer", snackcolor: "error"})
            return;
        }
        const id = this.props.match.params.id;
        this.setState({ isLoading: true, disablefields: true});

        const { title, description, startTime, duration, hourlyrate, traveldistance, customer } = this.state;
        putOrder(id, [title, description, startTime, duration, hourlyrate, traveldistance, customer.customer_id]).then(data => {
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
                    customerid: data.order_customer,
                    startTime: data.order_starting,
                    duration: data.order_duration*60,
                    hourlyrate: data.order_hourlyrate,
                    traveldistance: data.order_traveldistance,
                    disablefields: true })
            }
        })
    }

    handleDelete(){
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });
        deleteOrder(id).then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", isLoading: false });
            }else{
                this.setState({ message: "Auftrag erfolgreich gelöscht", snackcolor: "success", open: true, orderdata: [] })
                setTimeout(() => {
                    window.location.replace("/orders")
                }, 2000);
            }
        })
    }

    fetchOrder() {
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });
        getOrder(id).then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, message: data.error, snackcolor: "error"});
            }else{
                this.setState({ 
                    order_id: data.order_id,
                    title: data.order_title, 
                    description: data.order_description,
                    customerid: data.order_customer,
                    traveldistance: data.order_traveldistance,
                    hourlyrate: data.order_hourlyrate,
                    startTime: data.order_starting, 
                    duration: data.order_duration*60 })
            }
        })
    }

    fetchCustomers() {  
        this.setState({ isLoading: true });
        getCustomers().then(data => {
            this.setState({ isLoading: false, customers: data })
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, message: data.error})
            }else {
                this.state.customers.map((cust) => {
                    if(cust.customer_id === this.state.customerid){
                        return (this.setState({ customer: cust}));              
                    }
                    return cust;
                });
            }
        })
    }

    componentDidMount() {
        if(!(this.state.disablefields)){
            this.fetchOrder();
            this.fetchCustomers();
        }          
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, disablefields, customers, title, description, customer, traveldistance, hourlyrate, startTime, duration } = this.state;

        var loading = null;
        if (isLoading) {
            loading = <CircularProgress style={{position: "absolute", top: "45%"}} size={100}/>;
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
                    {loading}
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled={true}
                        label="AuftragsID"
                        value={this.state.order_id}
                    />
                    <OrderFields
                        title={title}
                        description={description}
                        customer={customer}
                        startTime={startTime}
                        duration={duration}
                        hourlyrate={hourlyrate}
                        traveldistance={traveldistance}
                        customers={customers}
                        disablefields={disablefields}
                        onChange={this.handleInputChange}>
                    </OrderFields>
                    {buttons}
                    </form>                   
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Orderdetail);