import React from 'react'
import { Container, CssBaseline, withStyles} from '@material-ui/core';
import { useStyles, ShowCustomerStatistics } from "../components/exports";


class CustomerStatistics extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div  className={classes.paper}>
          <h1>Übersicht Kunde - Statistik</h1><br />
          <ShowCustomerStatistics id={this.props.match.params.id}></ShowCustomerStatistics>
          </div>
        </Container>
        
    )
  }
}

export default withStyles(useStyles) (CustomerStatistics);