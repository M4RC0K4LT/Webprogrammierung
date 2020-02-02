import React, { Component } from 'react';
import { withStyles, Grid, Button } from '@material-ui/core';
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@material-ui/icons';
import { useStyles, DeleteDialog } from "../../exports";

class EditCustomerButtons extends Component {
    constructor(props){
        super(props); 
        this.state = {
            openDeleteDialog: false,
        };
        this.onEditClick = this.onEditClick.bind(this);    
        this.onDeleteClick = this.onDeleteClick.bind(this);  
    }
    
    onEditClick(e){
        this.props.onEditClick();
    }

    onDeleteClick(e){
        this.props.onDeleteClick();
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
                            onClick={() => this.setState({ openDeleteDialog: true })}
                        >
                                <DeleteOutlineOutlinedIcon edge="end" />
                    </Button>
                    <DeleteDialog
                        open={this.state.openDeleteDialog}
                        onClose={() => this.setState({openDeleteDialog: false})}
                        onAgree={() => (
                            this.onDeleteClick(),
                            this.setState({ openDeleteDialog: false })
                        )}
                        delMessage={this.props.objectDescription}>
                    </DeleteDialog>
                </div>
            )  
        }

        return buttons;
    }
}

export default withStyles(useStyles) (EditCustomerButtons);
