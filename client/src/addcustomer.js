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
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import { Redirect } from 'react-router-dom'
import { green } from '@material-ui/core/colors';
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
    message: {
        display: 'flex',
      },
});

class AddCustomer extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            customerdata: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
        
    }    

    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    handleSubmit(event){ 
        var that = this;
        event.preventDefault();
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/customers/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "mail": this.customer_mail.value,
                "name": this.customer_name.value,
                "company": this.customer_company.value,
                "country": this.customer_country.value,
                "zipcode": this.customer_zipcode.value,
                "town": this.customer_town.value,
                "street_number": this.customer_street_number.value,
                "hourlyrate": this.customer_hourlyrate.value
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ customerdata: data, isLoading: false}))
        .then(function(){
            if(that.state.customerdata.request === "failed"){
                that.setState({ message: that.state.error, open: true, snackcolor: "error" });
            }else{
                that.setState({ message: "Changes saved successfully!", snackcolor: "success", open: true })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
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

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PermContactCalendarOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Add a new Customer
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
                        inputRef={(inputRef) => {this.customer_name = inputRef}}
                        defaultValue={this.customer_name}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="customername"
                        label="Name"
                        name="customername"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_company = inputRef}}
                        defaultValue={this.customer_company}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customercompany"
                        label="Company Name"
                        id="customercompany"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_mail = inputRef}}
                        defaultValue={this.customer_mail}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="mail"
                        label="Mail"
                        type="mail"
                        id="mail"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_country = inputRef}}
                        defaultValue={this.customer_country}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customercountry"
                        label="Country"
                        id="customercountry"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_zipcode = inputRef}}
                        defaultValue={this.customer_zipcode}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerzipcode"
                        label="Zipcode"
                        id="customerzipcode"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_town = inputRef}}
                        defaultValue={this.customer_town}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customertown"
                        label="Town"
                        id="customertown"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_street_number = inputRef}}
                        defaultValue={this.customer_street_number}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerstreetnumber"
                        label="Street + Number"
                        id="customerstreetnumber"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_hourlyrate = inputRef}}
                        defaultValue={this.customer_hourlyrate}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerhourlyrate"
                        label="Hourlyrate"
                        id="customerhourlyrate"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Add Customer
                    </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (AddCustomer);