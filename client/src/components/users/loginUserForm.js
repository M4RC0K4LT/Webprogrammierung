import React, { Component } from 'react';
import { Button, withStyles} from '@material-ui/core';
import { CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { SnackbarMessage, useStyles, LoginFields} from '../exports'
import { postUser } from "../../api/exports";

class LoginUserForm extends Component {

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
        const { success, disablefields, mail, password } = this.state;
        
        if(success){
            return window.location.replace("/profile");
        }

        if (sessionStorage.getItem("authToken") != null){
            return window.location.replace("/profile");
        }

        return (
            <div>
                <SnackbarMessage
                    open={this.state.open}
                    onClose={this.handleSnackbarClose}
                    message={this.state.message}
                    color={this.state.snackcolor}>
                </SnackbarMessage>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                <LoginFields
                    mail={mail}
                    password={password}
                    disablefields={disablefields}
                    onChange={this.handleInputChange}
                    >
                </LoginFields>
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
        );
    }
}

export default withStyles(useStyles) (LoginUserForm);