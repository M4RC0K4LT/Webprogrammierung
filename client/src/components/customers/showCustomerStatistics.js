import React from 'react'
import {Link} from 'react-router-dom';
import { CircularProgress, withStyles, Button, Grid } from '@material-ui/core';
import { useStyles, SnackbarMessage } from "../exports";
import { getCustomer } from "../../api/exports"
import CustomerStatsTable from './formComponents/customerStatsTable';
import CustomerOrdersChart from './formComponents/customerOrdersChart';

/** ListCustomerStatistics Component to display some customer stats */
class ShowCustomerStatistics extends React.Component {

    //Initializes error handling
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: "",
            snackcolor: "error",

            customer: [],
            isLoading: false,
        };
        this.fetchCustomer = this.fetchCustomer.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false });
    }
    
    //Get Customerdata with some stats
    fetchCustomer() {
        const id = this.props.id;
        this.setState({ isLoading: true });
        getCustomer(id).then(data => {
        this.setState({ isLoading: false });
        if(data.length<1 || data.request === "failed"){
            this.setState({ message: data.error, snackcolor: "error", open: true })
        }else{
            this.setState({ customer: data })
        }
        })
    }

    componentDidMount() {
        this.fetchCustomer();
    }

    render() {
        const { isLoading, customer, open, message, snackcolor } = this.state;
        const { classes } = this.props;

        if (isLoading) {
        return (<div className={classes.paper}><CircularProgress/></div>);
        }

        return (
            <div>
                <SnackbarMessage
                    open={open}
                    onClose={this.handleSnackbarClose}
                    message={message}
                    color={snackcolor}>
                </SnackbarMessage>
                <CustomerOrdersChart id={this.props.id}></CustomerOrdersChart>
                <br /><br />
                <CustomerStatsTable customer={customer}></CustomerStatsTable><br /><br />
                <Grid
                    justify="space-between"
                    container
                    margin="normal" 
                >
                    <Grid item>
                        <Button variant="contained" color="primary" component={Link} to={"/customers/" + this.props.id}>
                        Bearbeiten
                    </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" component={Link} to={"/customer/orders/" + this.props.id}>
                        Aufträge
                    </Button>
                    </Grid>
                </Grid>
            </div>
            
        )
    }
}

/**
 * Defines the ShowCustomerStatistics Component.
 * Displays stats belonging to one customer (graph and table).
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ShowCustomerStatistics Component
 */
export default withStyles(useStyles) (ShowCustomerStatistics);