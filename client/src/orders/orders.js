import React from 'react'
import { Container, CssBaseline, withStyles, Fab } from '@material-ui/core';
import { Add as AddIcon} from '@material-ui/icons';
import { useStyles, ListOrders } from "../components/exports";

class Orders extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props

    return (
      <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div  className={classes.paper}>
            <h1>Auftragsübersicht</h1>
            <Fab className={classes.addbutton} size="large" color="primary" aria-label="add" href="/addorder">
              <AddIcon/>
            </Fab>
            <ListOrders></ListOrders>
          </div>
        </Container>
    )
  }
}

export default withStyles(useStyles) (Orders);