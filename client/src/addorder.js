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
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import { green } from '@material-ui/core/colors';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DateTimePicker } from '@material-ui/pickers';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import moment from "moment";

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
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: green[500],
    },
    message: {
        display: 'flex',
    },
    margin: {
        marginTop: "30px"
    }
});

class AddOrder extends Component {

    constructor(props){
        super(props);
        
        var today = new Date().toISOString().slice(0,10).toString() + " 06:00";

        this.state = {
            orderdata: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            data: null,
            startTime: today,
            duration: 15
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this); 
        this.valuetext = this.valuetext.bind(this)
    } 

    handleStartTime = (time) => {
        this.setState({
            startTime: time
        })
    }

    valuetext(value){
        var hours = value/60;
        return hours;
    }
    
    handleSubmit(event){ 
        var that = this;
        const id = this.props.match.params.id;
        event.preventDefault();
        this.setState({ isLoading: true });

        fetch('http://localhost:3001/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "title": this.order_title.value,
                "description": this.order_description.value,
                "starting": moment(this.state.startTime).format("YYYY-MM-DD HH:mm"),
                "duration": this.state.duration/60,
                "hourlyrate": this.order_hourlyrate.value,
                "traveldistance": this.order_traveldistance.value,
                "customer": this.order_customer.value
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ orderdata: data, isLoading: false}))
        .then(function(){
            if(that.state.orderdata.request === "failed"){
                that.setState({ message: "Something went wrong", open: true, snackcolor: "error" });
            }else{
                that.setState({ message: "Changes saved successfully!", snackcolor: "success", open: true })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
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
                        <GavelOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Add new order
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
                        inputRef={(inputRef) => {this.order_title = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Title"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_description = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Description"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_customer = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        label="Associated Customer"
                        type="mail"
                    />
                    
                    <TextField
                        inputRef={(inputRef) => {this.order_traveldistance = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Traveldistance"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_hourlyrate = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Hourlyrate - order specific"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            disableFuture
                            inputVariant="outlined"
                            fullWidth
                            ampm={false}
                            margin="normal"
                            id="time-picker"
                            label="Time picker"
                            format="yyyy-MM-dd HH:mm"
                            value={this.state.startTime}
                            onChange={this.handleStartTime}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                            <Slider
                                margin="normal"
                                defaultValue={15}
                                AriaValueText={this.valuetext}
                                aria-labelledby="discrete-slider-small-steps"
                                step={15}
                                min={15}
                                max={600}
                                valueLabelDisplay="off"
                                onChange={ (e, value) => this.setState({ duration: value }) }
                                valueLabelFormat={this.valuetext}

                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                value={this.state.duration/60 + " - " + moment(this.state.startTime).add(this.state.duration, "m").format("HH:mm")}
                                disabled="true"
                                variant="outlined"
                                margin="normal"
                                label="Dauer - Ende"
                            />
                        </Grid>                     
                    </Grid>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Add Order
                    </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (AddOrder);

/**
 * <TextField
                        inputRef={(inputRef) => {this.order_starting = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Starting Time"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.order_ending = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Ending Time"
                    />
 */