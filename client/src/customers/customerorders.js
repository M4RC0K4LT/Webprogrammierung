import React from 'react'
import { Container, CssBaseline, withStyles, Typography } from '@material-ui/core';
import { useStyles, ListCustomerOrders } from "../components/exports";

/** Component to display just customer related orders  */
class CustomerOrders extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div  className={classes.paper}>
            <Typography component="h1" variant="h4">
              Kundenaufträge
            </Typography>
            <br/>
            <Typography component="h1" variant="h6">
              für
            </Typography>
            <ListCustomerOrders id={this.props.match.params.id}></ListCustomerOrders>
          </div>
        </Container>
        
    )
  }
}

/**
 * Defines the Customer-related-orders Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - CustomerOrders Component
 */
export default withStyles(useStyles) (CustomerOrders);