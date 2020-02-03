import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import useStyles from "../../others/useStyles";
import 'date-fns';

class LoginFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    handleChange(e, name, value) {
        this.props.onChange(e, name, value);
    }

    render(){
        const { disablefields, mail, password} = this.props;

        return (
            <div>
                <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="E-Mail"
                        name="mail"
                        value={mail}
                        onChange={this.handleChange}
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
                        value={password}
                        disabled={disablefields}
                        onChange={this.handleChange}
                    />
            </div>
        )
    }
}

export default withStyles(useStyles) (LoginFields);
