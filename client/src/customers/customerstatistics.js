import React from 'react'
import { Redirect } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';
import { Container, CssBaseline, CircularProgress, withStyles, Button, ButtonGroup, Table, TableBody, TableCell, TableRow, TableContainer, Grid } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage, ShowCustomerStatistics } from "../components/exports";
import { getCustomer, postCustomerStatistics} from "../api/exports"


class CustomerStatistics extends React.Component {

  constructor(props) {
    super(props);
  }

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