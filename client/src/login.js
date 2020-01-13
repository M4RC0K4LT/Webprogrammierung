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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Redirect } from 'react-router-dom'

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
    message: {
        display: 'flex',
      },
});

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            response: [],
            isLoading: false,
            error: null,
            message: "",
            open: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }    
    
    handleSubmit(event){ 
        var that = this;
        event.preventDefault();
        this.setState({ isLoading: true });
        fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "mail": this.mail.value,
                "password": this.password.value
            })
        })
        .then(response => response.json())
        .then(data => this.setState({ response: data, isLoading: false, message: data.login}))
        .then(function(){
            if(that.state.message === "failed"){
                that.setState({ open: true, message: "Wrong credentials! Try again." })
            }
        })
        .catch(error => this.setState({ error, isLoading: false, open: true, message: error.message }));
    };

    handleClick(){
        sessionStorage.removeItem("authToken");
        window.location.reload();
    }

    render() {
        
        const { classes } = this.props;
        const { response, isLoading, error, open, message } = this.state;

        if (isLoading) {

            return (<div className={classes.paper}><CircularProgress/></div>);
        }
        
        if(response.login === "successful"){
            sessionStorage.setItem('authToken', response.token);
            return window.location.replace("/profile");
        }

        if (sessionStorage.getItem("authToken") != null){
            return <div className={classes.paper}><CheckCircleIcon /><br/><h1>Already loged in!</h1><br/><Button variant="contained" color="primary" href="/profile">Profile</Button><br/><Button variant="contained" color="primary" onClick={this.handleClick}>Logout</Button></div>;
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign in
                    </Typography>
                    <Snackbar
                        open={open}
                        autoHideDuration={2000}
                        onClose={() => this.setState({open: false})}>
                        <SnackbarContent 
                            className={classes.error}
                            message={<span id="client-snackbar" className={classes.message}>{message}</span>}>
                        </SnackbarContent>
                    </Snackbar>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        inputRef={(inputRef) => {this.mail = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        inputRef={(inputRef) => {this.password = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Button
                        href="/register"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Register
                    </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Login);