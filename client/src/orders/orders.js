import React from 'react';
import { Link } from 'react-router-dom';
import { Container, CssBaseline, withStyles, Fab, Typography } from '@material-ui/core';
import { Add as AddIcon} from '@material-ui/icons';
import { useStyles, ListOrders } from "../components/exports";

/** Orders Component */
class Orders extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div  className={classes.paper}>
          <Typography component="h1" variant="h4">
            Auftragsübersicht
          </Typography>
          <br /><br />
          <ListOrders></ListOrders>
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" component={Link} to="/orders/add">
            <AddIcon/>
          </Fab>
        </div>
      </Container>
    )
  }
}

/**
 * Defines the Orders Component.
 * Shows all registered orders.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Orders Component
 */
export default withStyles(useStyles) (Orders);