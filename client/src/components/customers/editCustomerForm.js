import React, { Component } from 'react';
import { TextField, withStyles, CircularProgress } from '@material-ui/core';
import { SnackbarMessage, useStyles } from '../exports'
import { getCustomer, deleteCustomer, putCustomer } from "../../api/exports";
import CustomerFields from "./formComponents/customerfields";
import EditCustomerButtons from "./formComponents/editcustomerbuttons";

/** EditCustomerFrom Component to provide a form for editing customer data */
class EditCustomerForm extends Component {

    //Initializes TextField values and error handling
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
            hourlyrate: "",
            openDeleteDialog: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
        this.fetchCustomer = this.fetchCustomer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);        
    }  
   
    //EventHandler: changing Value of controlled TextField
    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    //Submit FormData (Updated Values)
    handleSubmit(event){ 
        event.preventDefault();
        const id = this.props.id;
        this.setState({ isLoading: true, disablefields: true });
        const { customername, company, mail, country, zip, street_number, hourlyrate } = this.state;
        putCustomer(id, [customername, company, mail, country, zip, street_number, hourlyrate]).then(data => {
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
                    zip: data.customer_zipcode + " " + data.customer_town,
                    street_number: data.customer_street_number,
                    hourlyrate: data.customer_hourlyrate,
                    disablefields: true })
            }
        })
    }

    //Handle Customer delete
    handleDelete(){
        const id = this.props.id;
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
                window.location.replace("/customers")
            }
        })
    }

    //Get current Customerdata
    fetchCustomer() {
        const id = this.props.id;
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
                    zip: data.customer_zipcode + " " + data.customer_town,
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
        const { isLoading, disablefields, customerid, customername, company, mail, country, zip, street_number, hourlyrate } = this.state;
        
        //LoadingIcon
        var loading = null;
        if (isLoading) {
            loading = <CircularProgress className={classes.loading} size={100}/>;
        }

        return (
                <div>
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
                        street_number={street_number}
                        hourlyrate={hourlyrate}>
                    </CustomerFields>
                    <EditCustomerButtons
                        customerid={customerid}
                        disablefields={disablefields}
                        isLoading={isLoading}
                        objectDescription={"Kunde '" + customerid + " - " + customername + "' "}
                        onEditClick={() => this.setState({ disablefields: false })}
                        onDeleteClick={this.handleDelete}>
                    </EditCustomerButtons>
                    </form>               
                </div>
        );
    }
}

/**
 * Defines the EditCustomerForm Component.
 * Displays form for editing customer information
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - EditCustomerForm Component
 */
export default withStyles(useStyles) (EditCustomerForm);