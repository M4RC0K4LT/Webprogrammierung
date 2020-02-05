import React, { Component } from 'react';
import { CircularProgress, withStyles } from '@material-ui/core';
import { useStyles, SnackbarMessage } from "../exports";
import { postOrder, getCustomers } from "../../api/exports";
import AddOrderButtons from "./formComponents/addorderbuttons";
import OrderFields from "./formComponents/orderfields";

/** AddOrderForm Component to provide form for order creation */
class AddOrderForm extends Component {

    //Initializes TextField values and error handling
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
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    } 

    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false });
    }

    //Get all customers (for customer selection in TextField)
    fetchCustomers() {   
        this.setState({ isLoading: true });
        getCustomers().then(data => {
            this.setState({isLoading: false, customers: data});
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, message: data.error});
            }
        })
    }
    
    //Submit FormData
    handleSubmit(event){ 
        event.preventDefault();
        if(!(this.state.customers.includes(this.state.customer))){
            this.setState({ open: true, message: "Bitte wähle einen gültigen Kunden"});
            return;
        }
        if(this.state.duration === 0){
            this.setState({ open: true, message: "Bitte wähle eine gültige Dauer"});
            return;
        }

        this.setState({ isLoading: true, disablefields: true });
        const { title, description, startTime, duration, hourlyrate, traveldistance, customer } = this.state;
        postOrder([title, description, startTime, duration, hourlyrate, traveldistance, customer.customer_id]).then(data => {
            this.setState({ isLoading: false })
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", disablefields: false });
            }else{
                this.state.customers.map((cust) => {
                    if(cust.customer_id === data.order_customer){
                        return (this.setState({ customer: cust}));              
                    }
                    return cust;
                });
                this.setState({ 
                    message: "Auftrag erfolgreich hinzugefügt", 
                    snackcolor: "success", 
                    open: true, 
                    order_id: data.order_id,
                    title: data.order_title,
                    description: data.order_description,
                    startTime: data.order_starting,
                    duration: data.order_duration*60,
                    hourlyrate: data.order_hourlyrate,
                    traveldistance: data.order_traveldistance,
                    disablefields: true })
            }
        })
    }

    //EventHandler: changing Value of controlled TextField
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
        const { isLoading, disablefields, order_id, customers, title, description, customer, traveldistance, hourlyrate, startTime, duration } = this.state;

        //LoadingIcon
        var loading = null;
        if (isLoading) {
            loading = <CircularProgress className={classes.loading} size={100}/>;
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
                <AddOrderButtons
                    order_id={order_id}
                    disablefields={disablefields}
                    isLoading={isLoading}>
                </AddOrderButtons>
                </form>
            </div>
        );
    }
}

/**
 * Defines the AddOrderForm Component.
 * Displays form for creating a new order
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - AddOrderForm Component
 */
export default withStyles(useStyles) (AddOrderForm);