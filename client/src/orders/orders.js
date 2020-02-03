import React from 'react'
import { Container, CssBaseline, withStyles, Fab, Typography } from '@material-ui/core';
import { Add as AddIcon} from '@material-ui/icons';
import { useStyles, ListOrders } from "../components/exports";

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
          <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="/orders/add">
            <AddIcon/>
          </Fab>
        </div>
      </Container>
    )
  }
}

export default withStyles(useStyles) (Orders);