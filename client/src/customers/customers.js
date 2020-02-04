import React from 'react'
import { Container, CssBaseline, withStyles, Typography, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useStyles, ListCustomers } from "../components/exports";

/** Customers Component */
class Customers extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div  className={classes.paper}>
          <Typography component="h1" variant="h4">
            Kundenübersicht
          </Typography>
          <br /><br />
          <ListCustomers></ListCustomers>
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="customers/add">
            <AddIcon />
          </Fab>
        </div>
      </Container>
    )
  }
}

/**
 * Defines the Customers Component.
 * Displays all registered customers.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Customers Component
 */
export default withStyles(useStyles) (Customers);