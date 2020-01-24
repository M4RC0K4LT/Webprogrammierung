import React, { Component } from 'react';
import { Container, CssBaseline, CircularProgress, withStyles, Avatar, Button, TextField, Typography, Slider, Grid } from '@material-ui/core';
import { GavelOutlined as GavelOutlinedIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, OrderFields } from "../components/exports";
import { postOrder, getCustomers } from "../api/exports"

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

    handleInputChange(event, name, value) {
        if(event == null){
            this.setState({[name]: value});
        }else{
            const target = event.target;
            const value = target.value
            const name = target.name;
        
            this.setState({
            [name]: value
            });
        }
    }

    componentDidMount() {
        this.fetchCustomers();
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

export default withStyles(useStyles) (AddOrder);