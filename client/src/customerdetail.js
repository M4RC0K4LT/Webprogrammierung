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
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

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
    delete: {
      color: theme.palette.error.dark,
      margin: theme.spacing(0, 0, 3),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: green[500],
    },
    message: {
        display: 'flex',
      },
});

class Customerdetail extends Component {

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
        this.handleDelete = this.handleDelete.bind(this);
        
    }    
    
    handleSubmit(event){ 
        var that = this;
        const id = this.props.match.params.id;
        event.preventDefault();
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/customers/' + id, {
            method: 'PUT',
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
                that.setState({ message: "Something went wrong", open: true, snackcolor: "error" });
                setTimeout(() => {
                    that.fetchCustomer();
                  }, 1000);
            }else{
                that.setState({ message: "Changes saved successfully!", snackcolor: "success", open: true })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    handleDelete(){
        var that = this;
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/customers/', {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "id": id,
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.request === "failed"){
                that.setState({ message: "Something went wrong", open: true, snackcolor: "error", isLoading: false });
            }else{
                that.setState({ message: "Customer deleted successfully! You get redirected", snackcolor: "success", open: true, isLoading: false, customerdata: [] })
                setTimeout(() => {
                    window.location.replace("/customers")
                }, 2000);

            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    fetchCustomer() {
        var that = this;
        const id = this.props.match.params.id;
        this.setState({ isLoading: true });
        fetch("http://localhost:3001/api/customers/" + id, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
          }})
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Something went wrong ...');
            }
          })
          .then(data => this.setState({ customerdata: data, isLoading: false, message: data.request }))
          .then(function(){
            if(that.state.message == "failed"){
                that.setState({ open: true, message: that.state.customerdata.error.message, snackcolor: "error"})
            }else{
                that.setState({ open: false })
            }
        })
          .catch(error => this.setState({ error, isLoading: false, message: error.message, open: true, snackcolor: "error" }));
    }

    componentDidMount() {
        if (sessionStorage.getItem("authToken") != null){
            this.fetchCustomer();
        }
        

    }

    render() {
        
        const { classes } = this.props;
        const { response, isLoading, error, open, message } = this.state;

        if (isLoading) {
            return (<div className={classes.paper}><CircularProgress/></div>);
        }

        if (sessionStorage.getItem("authToken") == null){
            return <Redirect to='/login' />
        }
        if (this.state.snackcolor == "success"){
            var color = classes.success;
        }else{
            var color = classes.error;
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
                    Customer Overview
                    </Typography>
                    <br/>
                    <Snackbar
                        open={open}
                        autoHideDuration={2000}
                        onClose={() => this.setState({open: false})}>
                        <SnackbarContent 
                            className={color}
                            message={<span id="client-snackbar" className={classes.message}>{message}</span>}>
                        </SnackbarContent>
                    </Snackbar>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        inputRef={(inputRef) => {this.customer_id = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="customerid"
                        disabled="true"
                        label="CustomerID"
                        name="customerid"
                        value={this.state.customerdata.customer_id}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_name = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="customername"
                        label="Name"
                        name="customername"
                        defaultValue={this.state.customerdata.customer_name}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_company = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customercompany"
                        label="Company Name"
                        id="customercompany"
                        defaultValue={this.state.customerdata.customer_company}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_mail = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="mail"
                        label="Mail"
                        type="mail"
                        id="mail"
                        defaultValue={this.state.customerdata.customer_mail}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_country = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customercountry"
                        label="Country"
                        id="customercountry"
                        defaultValue={this.state.customerdata.customer_country}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_zipcode = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerzipcode"
                        label="Zipcode"
                        id="customerzipcode"
                        defaultValue={this.state.customerdata.customer_zipcode}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_town = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customertown"
                        label="Town"
                        id="customertown"
                        defaultValue={this.state.customerdata.customer_town}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_street_number = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerstreetnumber"
                        label="Street + Number"
                        id="customerstreetnumber"
                        defaultValue={this.state.customerdata.customer_street_number}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.customer_hourlyrate = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customerhourlyrate"
                        label="Hourlyrate"
                        id="customerhourlyrate"
                        defaultValue={this.state.customerdata.customer_hourlyrate}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Change Values
                    </Button>
                    </form>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="large"
                        className={classes.delete}
                        onClick={() => {this.handleDelete()}}
                    >
                            <DeleteOutlineOutlinedIcon edge="end" />
                    </Button>
                    
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Customerdetail);