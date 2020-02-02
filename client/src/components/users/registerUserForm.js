import React, { Component } from 'react';
import { Button, withStyles} from '@material-ui/core';
import { CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { SnackbarMessage, useStyles, RegisterFields } from '../exports'
import { postNewUser } from "../../api/exports";

class RegisterUserForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            response: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            disablefields: false,
            success: false,

            username: "",
            mail: "",
            password: "",
            confirmpassword: ""

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
        const { username, mail, password, confirmpassword} = this.state;
        
        if(password !== confirmpassword){
            this.setState({ message: "Passwörter stimmen nicht überein", open: true, snackcolor: "error" })
            return;
        }
        this.setState({ disablefields: true });
        postNewUser(username, mail, password).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
            } else {
                this.setState({ name: data.user_name, mail: data.user_mail, success: true});
            }
        })
    }

    handleClick(){
        sessionStorage.removeItem("authToken");
        window.location.reload();
    }

    render() {
        
        const { classes } = this.props;
        const { username, mail, password, confirmpassword, disablefields, success } = this.state;

        if (sessionStorage.getItem("authToken") != null){
            return <div className={classes.paper}><CheckCircleIcon /><br/><h1>Bereits angemeldet!</h1><br/><Button variant="contained" color="primary" href="/profile">Profil</Button><br/><Button variant="contained" color="primary" onClick={this.handleClick}>Logout</Button></div>;
        }

        if(success === true){
        return <div className={classes.paper}><p>User {username} mit E-Mail {mail} wurde erfolgreich erstellt! Bitte anmelden.</p><br/><br/><Button variant="contained" color="primary" href="/login">Login</Button></div>
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
                <RegisterFields
                    disablefields={disablefields}
                    username={username}
                    mail={mail}
                    password={password}
                    confirmpassword={confirmpassword}
                    onChange={this.handleInputChange}>
                </RegisterFields>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Registrieren
                </Button>
                </form>
            </div>
        );
    }
}

export default withStyles(useStyles) (RegisterUserForm);