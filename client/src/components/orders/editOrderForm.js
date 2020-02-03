import React, { Component } from 'react';
import { CircularProgress, withStyles, TextField } from '@material-ui/core';
import { useStyles, SnackbarMessage } from "../exports";
import { putOrder, getCustomers, deleteOrder, getOrder } from "../../api/exports";
import EditOrderButtons from "./formComponents/editorderbuttons";
import OrderFields from "./formComponents/orderfields";

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
        this.fetchCustomers = this.fetchCustomers.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }   
    
    handleSnackbarClose(){
        this.setState({ open: false })
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
        const id = this.props.id;
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
        const id = this.props.id;
        this.setState({ isLoading: true });
        deleteOrder(id).then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ message: data.error, open: true, snackcolor: "error", isLoading: false });
            }else{
                window.location.replace("/orders")
            }
        })
    }

    fetchOrder() {
        const id = this.props.id;
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
        const { isLoading, disablefields, order_id, customers, title, description, customer, traveldistance, hourlyrate, startTime, duration } = this.state;

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
                <EditOrderButtons
                    order_id={order_id}
                    disablefields={disablefields}
                    isLoading={isLoading}
                    objectDescription={"Auftrag '" + order_id + " - " + title + "' "}
                    onEditClick={() => this.setState({ disablefields: false })}
                    onDeleteClick={this.handleDelete}>
                </EditOrderButtons>
                </form>                   
            </div>
        );
    }
}

export default withStyles(useStyles) (Orderdetail);