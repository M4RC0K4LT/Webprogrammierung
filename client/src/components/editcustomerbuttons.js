import React, { Component } from 'react';
import { withStyles, Grid, Button } from '@material-ui/core';
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@material-ui/icons';
import useStyles from "./useStyles";

class EditCustomerButtons extends Component {
    constructor(props){
        super(props); 
        this.onEditClick = this.onEditClick.bind(this);      
    }
    
    onEditClick(e){
        this.props.onEditClick();
    }

    render(){
        const { disablefields, isLoading, classes, customerid } = this.props;
        
        var buttons = ""
        if(isLoading === false && disablefields){
            buttons = (
                <Grid
                  justify="space-between"
                  container
                  margin="normal" 
                >
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" onClick={this.onEditClick}>
                    Bearbeiten
                  </Button>
                  </Grid>
                  <Grid item>
                    <Button className={classes.submit} variant="outlined" color="primary" href={"/customer/statistics/" + customerid}>
                    Kundenstatistik
                  </Button>
                  </Grid>
                </Grid>
                );
        } else {
            buttons = (
                <div>
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Aktualisieren
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            size="large"
                            className={classes.delete}
                            onClick={() => {this.handleDelete()}}
                        >
                                <DeleteOutlineOutlinedIcon edge="end" />
                    </Button>
                </div>
            )  
        }

        return buttons;
    }
}

export default withStyles(useStyles) (EditCustomerButtons);
