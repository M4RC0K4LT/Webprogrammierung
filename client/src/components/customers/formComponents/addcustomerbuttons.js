import React, { Component } from 'react';
import { withStyles, Grid, Button } from '@material-ui/core';
import useStyles from "../../others/useStyles";

class AddCustomerButtons extends Component {
    render(){
        const { customerid, disablefields, isLoading, classes } = this.props;
        var buttons = "";
        if(disablefields && isLoading === false){
            buttons = (
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/customers/" +  customerid}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/customers"}>
                Zur Kundenübersicht
              </Button>
              </Grid>
            </Grid>
            );
        }
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

export default withStyles(useStyles) (AddCustomerButtons);
