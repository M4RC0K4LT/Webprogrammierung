import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import useStyles from "../../others/useStyles";

class RegisterFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    handleChange(e, name, value) {
        this.props.onChange(e, name, value);
    }

    render(){
        const { disablefields, username, mail, password, confirmpassword} = this.props;

        return (
            <div>
                <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Benutzername"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
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
                        label="Bestätige Passwort"
                        type="password"
                        value={confirmpassword}
                        onChange={this.handleChange}
                        disabled={disablefields}
                    />
            </div>
        )
    }
}

export default withStyles(useStyles) (RegisterFields);
