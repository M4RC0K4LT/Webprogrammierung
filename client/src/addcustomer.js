import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import { Redirect } from 'react-router-dom'
import SnackbarMessage from './components/snackbarmessage'
import Grid from '@material-ui/core/Grid';
import useStyles from "./components/useStyles";
import postCustomer from './api/postCustomer'

class AddCustomer extends Component {

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
        const { isLoading, disablefields } = this.state;

        var loading = null;
        if (isLoading && disablefields) {
            loading = <CircularProgress style={{position: "absolute", top: "45%"}} size={100}/>;
        }

        if (isLoading && disablefields === false) {
            return (<div className={classes.paper}><CircularProgress/></div>);
        }
        if (sessionStorage.getItem("authToken") == null){
            return <Redirect to='/login' />
        }

        var buttons = "";
        if(disablefields && isLoading === false){
            buttons = (
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/customer/" + this.state.customerid}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/customers"}>
                Zur Kundenübersicht
              </Button>
              </Grid>
            </Grid>
            );
        }
        else {
            buttons = (
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Kunde hinzufügen
                    </Button>
            )  
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
                    Kunde hinzufügen
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
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        value={this.state.customername}
                        onChange={this.handleInputChange}
                        name="customername"
                        label="Kundenname"
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Firma"
                        name="company"
                        onChange={this.handleInputChange}
                        value={this.state.company}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        label="E-Mail"
                        type="email"
                        name="mail"
                        onChange={this.handleInputChange}
                        value={this.state.mail}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Land"
                        name="country"
                        onChange={this.handleInputChange}
                        value={this.state.country}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Postleitzahl"
                        name="zip"
                        onChange={this.handleInputChange}
                        value={this.state.zipcode}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Ort"
                        name="town"
                        onChange={this.handleInputChange}
                        value={this.state.town}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Straße und Hausnummer"
                        name="street_number"
                        onChange={this.handleInputChange}
                        value={this.state.street_number}
                        disabled={this.state.disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Stundensatz standardmäßig"
                        name="hourlyrate"
                        onChange={this.handleInputChange}
                        value={this.state.hourlyrate}
                        disabled={this.state.disablefields}
                    />
                    {buttons}
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (AddCustomer);