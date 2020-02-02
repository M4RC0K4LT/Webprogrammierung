import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import useStyles from "./useStyles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class DeleteDialog extends Component {
    constructor(props){
        super(props);   
        this.handleClose = this.handleClose.bind(this)     
    }

    handleClose(e) {
        this.props.onClose();
    }

    render(){
        var { classes, open } = this.props

        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                className={classes.deleteDialog}
            >
                <DialogTitle>{this.props.delMessage + " wirklich löschen?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Dieser Vorgang kann nicht rückgängig gemacht werden. Aufträge bzw. Kunden sollten nur unter bestimmten Umständen gelöscht werden. Auch alte Datenbestände dienen der Dokumentation.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                    Abbrechen
                </Button>
                <Button onClick={this.props.onAgree} color="primary">
                    Bestätigen
                </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles) (DeleteDialog);
