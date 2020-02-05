import React from 'react'
import { Container, CssBaseline, withStyles, Typography} from '@material-ui/core';
import { useStyles, ShowCustomerStatistics } from "../components/exports";

/** Customer`s Statistic Component */
class CustomerStatistics extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div  className={classes.paper}>
          <Typography component="h1" variant="h4">
            Kundenstatistik
          </Typography>
          <br/><br/>
          <ShowCustomerStatistics id={this.props.match.params.id}></ShowCustomerStatistics>
          </div>
        </Container>
        
    )
  }
}

/**
 * Defines the Customer`s statistic Component.
 * Displays a graph with mounthly amount of orders, some calculated average data,...
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - CustomersStatistics Component
 */
export default withStyles(useStyles) (CustomerStatistics);