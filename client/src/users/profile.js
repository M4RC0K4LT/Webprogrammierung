import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles } from '@material-ui/core';
import { AccountCircleOutlined as AccountCircleOutlinedIcon } from '@material-ui/icons';
import { useStyles, EditUserForm} from '../components/exports'

class Profile extends Component {
    render() {        
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <AccountCircleOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Profilübersicht
                    </Typography>
                    <EditUserForm></EditUserForm>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Profile);