import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles } from '@material-ui/core';
import { PermContactCalendarOutlined as PermContactCalendarOutlinedIcon } from '@material-ui/icons';
import { useStyles, EditCustomerForm } from '../components/exports'

/** Customerdetail Component to edit/show customerdata */
class Customerdetail extends Component {
    render() {
        
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PermContactCalendarOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Kunde bearbeiten
                    </Typography>
                    <EditCustomerForm id={this.props.match.params.id}></EditCustomerForm>
                </div>
            </Container>
        );
    }
}

/**
 * Defines the Component to show customer details and to edit them.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Customerdetail Component
 */
export default withStyles(useStyles) (Customerdetail);