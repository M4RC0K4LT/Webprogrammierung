import React from 'react'
import { Container, CssBaseline, withStyles, Typography } from '@material-ui/core';
import { useStyles, ListMyOrders } from "../components/exports";

/** MyOrders Component */
class MyOrders extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div  className={classes.paper}>
          <Typography component="h1" variant="h4">
            Aufträge nach Technikern
          </Typography>
          <br /><br />
          <ListMyOrders></ListMyOrders>
        </div>
      </Container>
    )
  }
}

/**
 * Defines the MyOrders Component.
 * Shows all registered orders created by current user.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - MyOrders Component
 */
export default withStyles(useStyles) (MyOrders);