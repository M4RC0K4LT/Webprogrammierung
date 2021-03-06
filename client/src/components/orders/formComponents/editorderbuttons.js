import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Grid, Button } from '@material-ui/core';
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@material-ui/icons';
import { useStyles, DeleteDialog } from "../../exports";

/** 
 * EditOrderButtons Component
 * Displays buttons on order editing - below input fields
 */
class EditOrderButtons extends Component {
    constructor(props){
        super(props);  
        this.state = {
            openDeleteDialog: false,
        };     
        this.onEditClick = this.onEditClick.bind(this);    
        this.onDeleteClick = this.onDeleteClick.bind(this);  
    }
    
    //Handle click on "Edit"-Button
    onEditClick(e){
        this.props.onEditClick();
    }

    //Handle click on "Delete"-Button
    onDeleteClick(e){
        this.props.onDeleteClick();
    }

    render(){
        const { disablefields, isLoading, classes } = this.props;
        var buttons = ""
        
        //If edit was successfully sent to database
        if(disablefields && isLoading === false){
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
                    <Button className={classes.submit} variant="outlined" color="primary" component={Link} to={"/orders"}>
                    Zur Übersicht
                  </Button>
                  </Grid>
                </Grid>
                );
        }
        
        //Before editing is submitted
        else {
            buttons = (
                <div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Auftrag abändern
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
                        onAgree={() => {
                            this.onDeleteClick();
                            this.setState({ openDeleteDialog: false });
                        }}
                        delMessage={this.props.objectDescription}>
                    </DeleteDialog>
                </div>
        )
        }

        return buttons;
    }
}

/**
 * Defines the EditOrderButtons Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Buttons on order editing
 */
export default withStyles(useStyles) (EditOrderButtons);
