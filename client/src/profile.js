import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Redirect } from 'react-router-dom'
import { green } from '@material-ui/core/colors';

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
});

class Profile extends Component {

    constructor(props){
        super(props);
        this.state = {
            userdata: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }    
    
    handleSubmit(event){ 
        var that = this;
        event.preventDefault();
        this.setState({ isLoading: true });

        if(that.user_password.value != that.passwordconfirm.value){
            that.setState({ message: "Passwords do not match!", open: true, isLoading: false, snackcolor: "error" })
            return;
        }
        fetch('http://localhost:3001/api/user/change', {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "mail": this.usermail.value,
                "name": this.username.value,
                "password": this.user_password.value
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ userdata: data, isLoading: false, message: "Changes saved successfully!", snackcolor: "success", open: true}))
        .then(function(){
            if(that.state.message === "failed"){
                that.setState({ message: "Failed", open: true, snackcolor: "error" })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message, snackcolor: "error" }));
    }

    fetchUser() {
        var that = this;
        this.setState({ isLoading: true });
        fetch("http://localhost:3001/api/user/", {
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
          .then(data => this.setState({ userdata: data, isLoading: false, message: data.request }))
          .then(function(){
            if(that.state.message === "failed"){
                that.setState({ open: true, message: that.state.userdata.message.message })
            }
        })
          .catch(error => this.setState({ error, isLoading: false, message: error.message, open: true, snackcolor: "error" }));
    }

    componentDidMount() {
        if (sessionStorage.getItem("authToken") != null){
            this.fetchUser();
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
                    <AccountCircleOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Profile Overview
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
                        inputRef={(inputRef) => {this.user_id = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="userid"
                        disabled="true"
                        label="UserID"
                        name="userid"
                        value={this.state.userdata.user_id}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.username = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        defaultValue={this.state.userdata.user_name}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.usermail = inputRef}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="mail"
                        label="Mail"
                        type="mail"
                        id="mail"
                        defaultValue={this.state.userdata.user_mail}
                    />
                    <TextField
                        inputRef={(inputRef) => {this.user_password = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="12"
                    />
                    <TextField
                        inputRef={(inputRef) => {this.passwordconfirm = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="passwordconfirm"
                        label="Confirm Password"
                        type="password"
                        id="passwordconfirm"
                        autoComplete="current-password"
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
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Profile);