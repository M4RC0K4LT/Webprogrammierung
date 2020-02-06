import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Grid, Button, Fab } from '@material-ui/core';
import { Add as AddIcon} from '@material-ui/icons';
import useStyles from "../../others/useStyles";

/** 
 * AddOrderButtons Component
 * Displays buttons on order creation - below input fields
 */
class AddOrderButtons extends Component {
    render(){
        const { order_id, disablefields, isLoading, classes } = this.props;
        var buttons = ""

        //If Creation in Database was successful
        if(disablefields && isLoading === false){
            buttons = (
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" component={Link} to={"/orders/" + order_id}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" component={Link} to={"/orders"}>
                Zur Übersicht
              </Button>
              </Grid>
              <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="/orders/add">
                <AddIcon/>
              </Fab>
            </Grid>
            );
        }
        
        //Before new Orderdata was sent
        else{
            buttons = (
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={disablefields}
                        className={classes.submit}
                    >
                        Auftrag hinzufügen
                    </Button>
            )  
        }

        return buttons;
    }
}

/**
 * Defines the AddOrderButtons Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Buttons on order creation
 */
export default withStyles(useStyles) (AddOrderButtons);
