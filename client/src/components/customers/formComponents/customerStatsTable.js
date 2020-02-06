import React from 'react'
import { withStyles, Table, TableBody, TableCell, TableRow, TableContainer } from '@material-ui/core';
import { useStyles } from "../../exports";

/** CustomerStatsTable Component to show some customer related stats */
class CustomerStatsTable extends React.Component {   
    render() {
        const { customer } = this.props;

        return (
            <TableContainer>
                <Table aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">Kundenname:</TableCell>
                            <TableCell align="right">{customer.customer_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Firma:</TableCell>
                            <TableCell align="right">{customer.customer_company}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Stundensatz:</TableCell>
                            <TableCell align="right">{customer.customer_hourlyrate}</TableCell>
                            <TableCell align="left" style={{ padding: 0 }}>€/h</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">&empty; Stundensatz:</TableCell>
                            <TableCell align="right">{parseFloat(customer.avg_hourlyrate).toFixed(2)}</TableCell>
                            <TableCell align="left" style={{ padding: 0 }}>€/h</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">&empty; Fahrtstrecke:</TableCell>
                            <TableCell align="right">{parseFloat(customer.avg_traveldistance).toFixed(2)}</TableCell>
                            <TableCell align="left" style={{ padding: 0 }}>km</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">&empty; Auftragsdauer:</TableCell>
                            <TableCell align="right">{parseFloat(customer.avg_duration).toFixed(2)}</TableCell>
                            <TableCell align="left" style={{ padding: 0 }}>h</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">&empty; Auftragskosten:</TableCell>
                            <TableCell align="right">{parseFloat(customer.avg_ordercost).toFixed(2)}</TableCell>
                            <TableCell align="left" style={{ padding: 0 }}>€</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>    
            </TableContainer>
            
        )
    }
}

/**
 * Defines the CustomerStatsTable Component.
 * Shows some customer stats such as average values,...
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - CustomerStatsTable Component
 */
export default withStyles(useStyles) (CustomerStatsTable);