import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import { Redirect } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import SnackbarMessage from './components/snackbarmessage'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import useStyles from "./components/useStyles";
import getCustomer from "./api/getCustomer";
import deleteCustomer from "./api/deleteCustomer";
import putCustomer from './api/putCustomer'

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
        if (sessionStorage.getItem("authToken") != null){
            this.fetchCustomer();
        }
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, disablefields } = this.state;

        var loading = null;
        if (isLoading && disablefields) {
            loading = <CircularProgress style={{position: "absolute", top: "45%"}} size={100}/>;
        }

        if (isLoading && disablefields === false) {
            return (<div className={classes.paper}><CircularProgress/></div>);
        }

        var buttons = ""
        if(isLoading === false && disablefields){
            buttons = (
                <Grid
                  justify="space-between"
                  container
                  margin="normal" 
                >
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" onClick={() => this.setState({ disablefields: false, updatedcountry: null, updatedtown: null, updatedzipcode: null, updatedstreet_number: null, updatedhourlyrate: null })}>
                    Bearbeiten
                  </Button>
                  </Grid>
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" href={"/customer/statistics/" + this.props.match.params.id}>
                    Kundenstatistik
                  </Button>
                  </Grid>
                </Grid>
                );
        } else {
            buttons = (
                <div>
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Aktualisieren
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
                    </Button>
                </div>
            )  
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
                        value={this.state.customerid}
                        disabled={true}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="customername"
                        label="Kundenname"
                        onChange={this.handleInputChange}
                        value={this.state.customername}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="company"
                        label="Firma"
                        onChange={this.handleInputChange}
                        value={this.state.company}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="mail"
                        label="E-Mail"
                        type="mail"
                        onChange={this.handleInputChange}
                        value={this.state.mail}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="Land"
                        label="Country"
                        onChange={this.handleInputChange}
                        value={this.state.country}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="zip"
                        label="Postleitzahl"
                        onChange={this.handleInputChange}
                        value={this.state.zip}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="town"
                        label="Ort"
                        onChange={this.handleInputChange}
                        value={this.state.town}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="street_number"
                        label="Straße und Hausnummer"
                        onChange={this.handleInputChange}
                        value={this.state.street_number}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="hourlyrate"
                        label="Stundensatz standardmäßig"
                        onChange={this.handleInputChange}
                        value={this.state.hourlyrate}
                        disabled={disablefields}
                    />
                    {buttons}
                    </form>
                    
                    
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Customerdetail);