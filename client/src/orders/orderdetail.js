import React, { Component } from 'react';
import { Container, CssBaseline, withStyles, Avatar, Typography } from '@material-ui/core';
import { GavelOutlined as GavelOutlinedIcon } from '@material-ui/icons';
import { useStyles, EditOrderForm } from "../components/exports";

class Orderdetail extends Component {

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
                        <GavelOutlinedIcon fontSize="large"/>
                    </Avatar>
                    <br/>
                    <Typography component="h1" variant="h5">
                    Auftragsdetails
                    </Typography>
                    <EditOrderForm id={this.props.match.params.id}></EditOrderForm>               
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Orderdetail);