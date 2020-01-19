import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import useStyles from "./useStyles";


function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

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
                autoHideDuration={4000}
                onClose={() => this.handleClose()}
                TransitionComponent={SlideTransition}>
                <SnackbarContent 
                    className={color}
                    message={<center>{message}</center>}
                    >
                </SnackbarContent>
            </Snackbar>
        )
    }
}

export default withStyles(useStyles) (SnackbarMessage);
