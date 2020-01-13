import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(15),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: "100%",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    message: {
        display: 'flex',
      },
});

class Home extends Component {

    render() {
        
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <div className={classes.paper}>
                    <h1>Auftragserfassung Georg Müller Kugellager GmbH</h1>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles) (Home);