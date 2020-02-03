import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles } from '@material-ui/core';
import { PermContactCalendarOutlined as PermContactCalendarOutlinedIcon } from '@material-ui/icons';
import { useStyles, AddCustomerForm} from '../components/exports'


class AddCustomer extends Component {
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
                    Kunde hinzufügen
                    </Typography>
                    <AddCustomerForm></AddCustomerForm>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (AddCustomer);