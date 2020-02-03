import React, { Component } from 'react';
import { withStyles, Grid, Button } from '@material-ui/core';
import useStyles from "../../others/useStyles";

class AddOrderButtons extends Component {
    render(){
        const { order_id, disablefields, isLoading, classes } = this.props;
        var buttons = ""
        if(disablefields && isLoading === false){
            buttons = (
            <Grid
              justify="space-between"
              container
              margin="normal" 
            >
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/orders/" + order_id}>
                Bearbeiten
              </Button>
              </Grid>
              <Grid item>
                <Button className={classes.submit} variant="outlined" color="primary" href={"/orders"}>
                Zur Übersicht
              </Button>
              </Grid>
            </Grid>
            );
        }else{
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

export default withStyles(useStyles) (AddOrderButtons);
