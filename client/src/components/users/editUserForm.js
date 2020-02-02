import React, { Component } from 'react';
import { withStyles, CircularProgress} from '@material-ui/core';
import { SnackbarMessage, useStyles, UserFields} from '../exports'
import { getUser, putUser } from "../../api/exports";

class EditUserForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            userdata: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",

            userid: "",
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
        const value = target.value;
        const name = target.name;    
        this.setState({ [name]: value });
    }
    
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    handleSubmit(event){ 
        event.preventDefault();
        const { username, mail, password, confirmpassword} = this.state;

        if(password !== confirmpassword){
            this.setState({ message: "Passwörter stimmen nicht überein", open: true, isLoading: false, snackcolor: "error" })
            return;
        }
        this.setState({ disablefields: true });
        putUser(username, mail, password).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false, password: "", confirmpassword: "" })
            } else {
                this.setState({ name: data.user_name, mail: data.user_mail, snackcolor: "success", open: true, message: "User erfolgreich akutalisiert", disablefields: false});
            }
        })
    }

    fetchUser() {
        this.setState({ isLoading: true });
        getUser().then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error })
            }else {
                this.setState({ 
                    userid: data.user_id,
                    username: data.user_name,
                    mail: data.user_mail,
                 })
            }
        })
    }

    componentDidMount() {
        this.fetchUser();
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, userid, username, mail, password, confirmpassword, disablefields } = this.state;

        if (isLoading) {
            return (<div className={classes.paper}><CircularProgress/></div>);
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
                <UserFields
                    disablefields={disablefields}
                    userid={userid}
                    username={username}
                    mail={mail}
                    password={password}
                    confirmpassword={confirmpassword}
                    onChange={this.handleInputChange}>
                </UserFields>
                </form>
            </div>
        );
    }
}

export default withStyles(useStyles) (EditUserForm);