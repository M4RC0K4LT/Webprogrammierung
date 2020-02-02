import React from 'react'
import { Container, CssBaseline, withStyles } from '@material-ui/core';
import { useStyles, ListCustomerOrders } from "../components/exports";

class CustomerOrders extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div  className={classes.paper}>
            <h1>Übersicht Kundenaufträge</h1><br />
            <ListCustomerOrders id={this.props.match.params.id}></ListCustomerOrders>
          </div>
        </Container>
        
    )
  }
}

export default withStyles(useStyles) (CustomerOrders);