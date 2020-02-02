import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import useStyles from "../../others/useStyles";

class CustomerFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    handleChange(e) {
        this.props.onChange(e);
    }

    render(){
        const { disablefields, customername, company, mail, country, zip, town, street_number, hourlyrate } = this.props;

        return (
            <div>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="customername"
                    label="Kundenname"
                    onChange={this.handleChange}
                    value={customername}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="company"
                    label="Firma"
                    onChange={this.handleChange}
                    value={company}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    name="mail"
                    label="E-Mail"
                    type="Email"
                    onChange={this.handleChange}
                    value={mail}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="country"
                    label="Country"
                    onChange={this.handleChange}
                    value={country}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="zip"
                    label="Postleitzahl"
                    onChange={this.handleChange}
                    value={zip}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="town"
                    label="Ort"
                    onChange={this.handleChange}
                    value={town}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="street_number"
                    label="Straße und Hausnummer"
                    onChange={this.handleChange}
                    value={street_number}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="hourlyrate"
                    label="Stundensatz standardmäßig"
                    onChange={this.handleChange}
                    value={hourlyrate}
                    disabled={disablefields}
                />
            </div>
        )
    }
}

export default withStyles(useStyles) (CustomerFields);