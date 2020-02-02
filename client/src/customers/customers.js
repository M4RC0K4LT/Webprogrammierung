import React from 'react'
import { Container, CssBaseline, withStyles, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useStyles, ListCustomers } from "../components/exports";

class Customers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div  className={classes.paper}>
          <h1>Kundenübersicht</h1>
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="addcustomer">
            <AddIcon />
          </Fab>
          <ListCustomers></ListCustomers>
        </div>
      </Container>
    )
  }
}

export default withStyles(useStyles) (Customers);