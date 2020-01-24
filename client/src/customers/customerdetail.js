import React, { Component } from 'react';
import { Avatar, TextField, CssBaseline, Typography, Container, withStyles, CircularProgress } from '@material-ui/core';
import { PermContactCalendarOutlined as PermContactCalendarOutlinedIcon } from '@material-ui/icons';
import { SnackbarMessage, useStyles, CustomerFields, EditCustomerButtons } from '../components/exports'
import { getCustomer, deleteCustomer, putCustomer } from "../api/exports";


class Customerdetail extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            customerdata: [],
            updatedvalue: null, 
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            disablefields: false,

            customerid: "",
            customername: "",
            company: "",
            mail: "",
            country: "",
            zip: "",
            town: "",
            street_number: "",
            hourlyrate: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
        this.fetchCustomer = this.fetchCustomer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);        
    }  
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        const id = this.props.match.params.id;
        this.setState({ isLoading: true, disablefields: true });
        const { customername, company, mail, country, zip, town, street_number, hourlyrate } = this.state;
        putCustomer(id, [customername, company, mail, country, zip, town, street_number, hourlyrate]).then(data => {
            this.setState({ isLoading: false })
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
            }else{
                this.setState({ 
                    message: "Kunde erfolgreich aktualisiert", 
                    snackcolor: "success", 
                    open: true, 
                    customerid: data.customer_id,
                    customername: data.customer_name,
                    company: data.customer_company,
                    mail: data.customer_mail,
                    country: data.customer_country,
                    zip: data.customer_zipcode,
                    town: data.customer_town,
                    street_number: data.customer_street_number,
                    hourlyrate: data.customer_hourlyrate,
                    disablefields: true })
            }
        })
    }

    handleDelete(){
        const id = this.props.match.params.id;
        this.setState({ isLoading: true, disablefields: true });
        deleteCustomer(id).then(data => {
            this.setState({ isLoading: false })
            if(data.request === "failed" || data.length<1){
                if(data.code === "SQLITE_CONSTRAINT"){
                    this.setState({ message: "Fehler: Kunde hat noch zugehörige Aufträge", open: true, snackcolor: "error", disablefields: false });
                }else {
                    this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
                }
            }else{
                this.setState({ message: "Kunde erfolgreich gelöscht. Weiterleitung...", snackcolor: "success", open: true, isLoading: false })
                setTimeout(() => {
                    window.location.replace("/customers")
                }, 2000);
            }
        })
    }

    fetchCustomer() {
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });
        getCustomer(id).then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, snackcolor: "error", open: true })
            }else{
                this.setState({ 
                    customerid: data.customer_id,
                    customername: data.customer_name,
                    company: data.customer_company,
                    mail: data.customer_mail,
                    country: data.customer_country,
                    zip: data.customer_zipcode,
                    town: data.customer_town,
                    street_number: data.customer_street_number,
                    hourlyrate: data.customer_hourlyrate,
                 })
            }
          })
    }

    componentDidMount() {
        this.fetchCustomer();
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, disablefields, customerid, customername, company, mail, country, zip, town, street_number, hourlyrate } = this.state;
        
        var loading = null;
        if (isLoading) {
            loading = <CircularProgress style={{position: "absolute", top: "45%"}} size={100}/>;
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PermContactCalendarOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Kunde bearbeiten
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
                        label="KundenID"
                        name="customerid"
                        value={customerid}
                        disabled={true}
                    />
                    <CustomerFields
                        onChange={this.handleInputChange}
                        disablefields={disablefields}
                        customername={customername}
                        company={company}
                        mail={mail}
                        country={country}
                        zip={zip}
                        town={town}
                        street_number={street_number}
                        hourlyrate={hourlyrate}>
                    </CustomerFields>
                    <EditCustomerButtons
                        customerid={customerid}
                        disablefields={disablefields}
                        isLoading={isLoading}
                        onEditClick={() => this.setState({ disablefields: false })}>
                    </EditCustomerButtons>
                    </form>
                    
                    
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Customerdetail);