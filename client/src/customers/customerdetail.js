import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles } from '@material-ui/core';
import { PermContactCalendarOutlined as PermContactCalendarOutlinedIcon } from '@material-ui/icons';
import { useStyles, EditCustomerForm } from '../components/exports'


class Customerdetail extends Component {

    constructor(props){
        super(props);
    }

    render() {
        
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PermContactCalendarOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Kunde bearbeiten
                    </Typography>
                    <EditCustomerForm id={this.props.match.params.id}></EditCustomerForm>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Customerdetail);