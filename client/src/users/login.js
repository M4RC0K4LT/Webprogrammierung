import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Button, Container, withStyles,TextField} from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon, CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { SnackbarMessage, useStyles} from '../components/exports'
import { postUser } from "../api/exports";

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            disablefields: false,
            response: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            success: false,
            mail: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        
    }   
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }
    
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        this.setState({ disablefields: true });
        const { mail, password, } = this.state;
        postUser(mail, password).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
            }else {
                sessionStorage.setItem('authToken', data.token);
                this.setState({ success: true })
            }
        })
    };

    handleClick(){
        sessionStorage.removeItem("authToken");
        window.location.reload();
    }

    render() {
        
        const { classes } = this.props;
        const { success, disablefields } = this.state;
        
        if(success){
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
                    Anmelden
                    </Typography>
                    <SnackbarMessage
                        open={this.state.open}
                        onClose={this.handleSnackbarClose}
                        message={this.state.message}
                        color={this.state.snackcolor}>
                    </SnackbarMessage>

                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        inputRef={(inputRef) => {this.mail = inputRef}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="E-Mail"
                        name="mail"
                        value={this.state.mail}
                        onChange={this.handleInputChange}
                        disabled={disablefields}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Passwort"
                        type="password"
                        name="password"
                        value={this.state.password}
                        disabled={disablefields}
                        onChange={this.handleInputChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Login
                    </Button>
                    <Button
                        href="/register"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Registrieren
                    </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Login);