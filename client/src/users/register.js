import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Button, Container, withStyles,TextField} from '@material-ui/core';
import { PersonOutlined as PersonAddOutlinedIcon, CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { SnackbarMessage, useStyles} from '../components/exports'
import { postNewUser } from "../api/exports";

class Register extends Component {

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
            return <div className={classes.paper}><CheckCircleIcon /><br/><h1>Bereits angemeldet!</h1><br/><Button variant="contained" color="primary" href="/profile">Profile</Button><br/><Button variant="contained" color="primary" onClick={this.handleClick}>Logout</Button></div>;
        }

        if(success === true){
        return <div className={classes.paper}><p>User {username} mit E-Mail {mail} wurde erfolgreich erstellt! Bitte anmelden.</p><br/><br/><Button variant="contained" color="primary" href="/login">Login</Button></div>
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PersonAddOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Registrierung
                    </Typography>
                    <SnackbarMessage
                        open={this.state.open}
                        onClose={this.handleSnackbarClose}
                        message={this.state.message}
                        color={this.state.snackcolor}>
                    </SnackbarMessage>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Benutzername"
                        name="username"
                        value={username}
                        onChange={this.handleInputChange}
                        disabled={disablefields}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="email"
                        required
                        fullWidth
                        label="E-Mail"
                        name="mail"
                        value={mail}
                        onChange={this.handleInputChange}
                        disabled={disablefields}

                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passwort"
                        type="password"
                        value={password}
                        onChange={this.handleInputChange}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmpassword"
                        label="Bestätige Passwort"
                        type="password"
                        value={confirmpassword}
                        onChange={this.handleInputChange}
                        disabled={disablefields}
                    />
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
            </Container>
        );
    }
}

export default withStyles(useStyles) (Register);