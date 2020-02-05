import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Grid, Button } from '@material-ui/core';
import useStyles from "../../others/useStyles";

/** 
 * AddCustomerButtons Component
 * Displays buttons on customer creation - below input fields
 */
class AddCustomerButtons extends Component {
    render(){
        const { customerid, disablefields, isLoading, classes } = this.props;
        var buttons = "";

        //If Creation in Database was successful
        if(disablefields && isLoading === false){
            buttons = (
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" component={Link} to={"/customers/" +  customerid}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" component={Link} to={"/customers"}>
                Zur Kundenübersicht
              </Button>
              </Grid>
            </Grid>
            );
        }

        //Before new Customerdata was sent
        else {
            buttons = (
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Kunde hinzufügen
                    </Button>
            )  
        }

        return buttons;
    }
}

/**
 * Defines the AddCustomerButtons Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Buttons on customer creation
 */
export default withStyles(useStyles) (AddCustomerButtons);
