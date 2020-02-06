import React from 'react'
import { Bar } from 'react-chartjs-2';
import { CircularProgress, withStyles, Button, ButtonGroup, Divider } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { useStyles, SnackbarMessage } from "../../exports";
import { postOrderStatistics } from "../../../api/exports"

/** MonthlyOrdersChart Component to show amount of monthly orders */
class MonthlyOrdersChart extends React.Component {

    /** Defines Chart labels, datasets, options,... */
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: "",
            snackcolor: "error",
            isLoading: false,
            year: 2020,
            diagram: {
                labels: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                datasets: [
                {
                    label: 'Anzahl Aufträge',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    data: [null, null, null, null, null, null, null, null, null, null, null, null]
                }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 30,
                            precision: 0
                        }
                    }]
                }
            }
        };
        this.fetchStatistics = this.fetchStatistics.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    /** Close Snackbar with error/success messages */
    handleSnackbarClose(){
        this.setState({ open: false });
    }

    /** Get dataset (amount of monthly orders) for chosen year */
    fetchStatistics(year){
        this.setState({ year: year });
        if(year==null){
            return;
        }
        year = year.toString();
        postOrderStatistics(year).then(data => {
        if(data.request === "failed"){
            this.setState({ message: data.error, snackcolor: "error", open: true })
        }else{
            var datasetsCopy = this.state.diagram.datasets.slice(0);
            var dataCopy = [null, null, null, null, null, null, null, null, null, null, null, null];
            data.map((stats) => {
                var monthint = parseInt(stats.month)-1;
                return (dataCopy[monthint] = stats.anzahl);
            });
            datasetsCopy[0].data = dataCopy;
            this.setState({ diagram: Object.assign({}, this.state.diagram, {datasets: datasetsCopy}) });

        }
        })
    }

    /** Initially load statistics for current year */
    componentDidMount() {
        this.fetchStatistics(this.state.year);
    }

    render() {
        const { isLoading, open, message, snackcolor, diagram, options } = this.state;
        const { classes } = this.props;

        if (isLoading) {
        return (<div className={classes.paper}><CircularProgress/></div>);
        }

        return (
            <div className={classes.ListItems} >
                <SnackbarMessage
                    open={open}
                    onClose={this.handleSnackbarClose}
                    message={message}
                    color={snackcolor}>
                </SnackbarMessage>
                <Bar data={diagram} options={options} />
                <ButtonGroup variant="text" size="small" margin="normal" color="primary">
                    <Button onClick={() => this.fetchStatistics(this.state.year-1)}><ArrowBackIcon /></Button>
                    <Button>{this.state.year}</Button>
                    <Button onClick={() => this.fetchStatistics(this.state.year+1)}><ArrowForwardIcon /></Button>
                </ButtonGroup>
                <Divider style={{ margin: "30px" }}></Divider>
            </div>
            
        )
    }
}

/**
 * Defines the MonthlyOrdersChart Component.
 * Creates a ChartJS based graphic with amount of monthly orders in chosen year.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - MonthlyOrders
 */
export default withStyles(useStyles) (MonthlyOrdersChart);