import React, { Component } from 'react';
import { withStyles, TextField, Button } from '@material-ui/core';
import useStyles from "../../others/useStyles";

class UserFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    handleChange(e) {
        this.props.onChange(e);
    }

    render(){
        const { disablefields, userid, username, mail, password, confirmpassword, classes } = this.props;

        return (
            <div>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    disabled={true}
                    label="UserID"
                    name="userid"
                    value={userid}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Benutzername"
                    name="username"
                    onChange={this.handleChange}
                    value={username}
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
                    value={mail}
                    onChange={this.handleChange}
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
                    onChange={this.handleChange}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmpassword"
                    label="Passwort bestätigen "
                    type="password"
                    value={confirmpassword}
                    onChange={this.handleChange}
                    disabled={disablefields}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Benutzerprofil aktualisieren
                </Button>
            </div>
        )
    }
}

export default withStyles(useStyles) (UserFields);
