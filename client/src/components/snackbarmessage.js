import React, { Component } from 'react';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const useStyles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: green[500],
    },
});

class SnackbarMessage extends Component {
    constructor(props){
        super(props);   
        this.handleClose = this.handleClose.bind(this)     
    }

    handleClose(e) {
        this.props.onClose();
    }

    render(){
        var { classes, open, message, color } = this.props

        if(color === "success"){
            color = classes.success
        } else{
            color = classes.error
        }

        return (
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => this.handleClose()}>
                <SnackbarContent 
                    className={color}
                    message={message}>
                </SnackbarContent>
            </Snackbar>
        )
    }
}

export default withStyles(useStyles) (SnackbarMessage);
