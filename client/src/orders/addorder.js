import React, { Component } from 'react';
import { Container, CssBaseline, withStyles, Avatar, Typography } from '@material-ui/core';
import { GavelOutlined as GavelOutlinedIcon } from '@material-ui/icons';
import { useStyles, AddOrderForm } from "../components/exports";

/** Component to add/create a new order */
class AddOrder extends Component {
    render() {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <GavelOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Auftrag hinzufügen
                    </Typography>
                    <AddOrderForm></AddOrderForm>
                </div>
            </Container>
        );
    }
}

/**
 * Defines the Order Creation Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - AddOrder Component
 */
export default withStyles(useStyles) (AddOrder);