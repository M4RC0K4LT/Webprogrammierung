import React, { Component } from 'react';
import { withStyles, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';  
import useStyles from "./useStyles";

/** Shows warning dialog "onDeleteClick" */
class DeleteDialog extends Component {

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
                <Button onClick={this.props.onClose} color="primary" autoFocus>
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

/**
 * AlertMessage on trying to delete.
 * @param {props} props - Properties given for element: open, onClose, onAgree, delMessage
 * @return {Dialog} Suitable AlertDialog.
 */
export default withStyles(useStyles) (DeleteDialog);
