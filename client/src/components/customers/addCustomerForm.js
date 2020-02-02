import React, { Component } from 'react';
import { withStyles, CircularProgress } from '@material-ui/core';
import { SnackbarMessage, useStyles} from '../exports'
import { postCustomer } from "../../api/exports";
import CustomerFields from "./formComponents/customerfields";
import AddCustomerButtons from "./formComponents/addcustomerbuttons";


class AddCustomerForm extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            isLoading: false,
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
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
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
        this.setState({ isLoading: true, disablefields: true });
        const { customername, company, mail, country, zip, town, street_number, hourlyrate } = this.state;
        postCustomer([customername, company, mail, country, zip, town, street_number, hourlyrate]).then(data => {
            this.setState({ isLoading: false })
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
            }else{
                this.setState({ 
                    message: "Kunde erfolgreich hinzugefügt", 
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

    render() {

        const { classes } = this.props;
        const { isLoading, disablefields, customerid, customername, company, mail, country, zip, town, street_number, hourlyrate } = this.state;

        var loading = null;
        if (isLoading) {
            loading = <CircularProgress style={{position: "absolute", top: "45%", left: "47%"}} size={100}/>;
        }

        return (
                <div>
                    {loading}
                    <SnackbarMessage
                        open={this.state.open}
                        onClose={this.handleSnackbarClose}
                        message={this.state.message}
                        color={this.state.snackcolor}>
                    </SnackbarMessage>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
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
                    <AddCustomerButtons
                        customerid={customerid}
                        disablefields={disablefields}
                        isLoading={isLoading}>
                    </AddCustomerButtons>
                    </form>
                </div>
        );
    }
}

export default withStyles(useStyles) (AddCustomerForm);