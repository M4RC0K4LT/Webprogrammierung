import React, { Component } from 'react';
import { withStyles, TextField, Grid, Slider } from '@material-ui/core';
import useStyles from "../../others/useStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import 'date-fns';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';

/** OrderFields Component */
class OrderFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    /** Change values (onKeyboardInput) of controlled TextField components */
    handleChange(e, name, value) {
        this.props.onChange(e, name, value);
    }

    render(){
        const { disablefields, customers, title, description, customer, traveldistance, hourlyrate, startTime, duration } = this.props;

        return (
            <div>
                <TextField
                    variant="outlined"
                    value={title}
                    margin="normal"
                    required
                    fullWidth
                    label="Titel"
                    name="title"
                    onChange={this.handleChange}
                    disabled={disablefields}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Beschreibung"
                    multiline={true}
                    name="description"
                    value={description}
                    onChange={this.handleChange}
                    disabled={disablefields}
                />
                <Autocomplete
                    options={customers}
                    getOptionLabel={option => option.customer_id + " - " + option.customer_name}
                    autoSelect={true}
                    autoHighlight={true}
                    autoComplete={true}
                    clearOnEscape={true}
                    disabled={disablefields}
                    name="customer"
                    value={customer}
                    onChange={(e, value) => this.handleChange(null, "customer", value)}
                    renderInput={params => (
                        <TextField {...params} margin="normal" fullWidth label="Zugehöriger Kunde" variant="outlined" required />
                    )}
                />                    
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Fahrtstrecke - optional"
                    name="traveldistance"
                    value={traveldistance}
                    onChange={this.handleChange}
                    disabled={disablefields}
                />
                <TextField
                    name="hourlyrate"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Stundensatz - nur wenn auftragsspezifisch"
                    onChange={this.handleChange}
                    value={hourlyrate}
                    disabled={disablefields}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        disableFuture
                        inputVariant="outlined"
                        fullWidth
                        ampm={false}
                        margin="normal"
                        label="Auftragsbeginn"
                        format="yyyy-MM-dd HH:mm"
                        name="startTime"
                        value={startTime}
                        onChange={(time) => this.handleChange(null, "startTime", time)}
                        disabled={disablefields}
                    />
                </MuiPickersUtilsProvider>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={7}>
                        <Slider
                            margin="normal"
                            value={duration}
                            aria-labelledby="discrete-slider-small-steps"
                            step={15}
                            min={0}
                            max={600}
                            valueLabelDisplay="off"
                            name="duration"
                            onChange={(e, value) => this.handleChange(null, "duration", value)}
                            disabled={disablefields}

                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            value={duration/60 + "h - " + moment(startTime).add(duration, "m").format("HH:mm")}
                            disabled={true}
                            variant="outlined"
                            margin="normal"
                            label="Dauer - Ende"
                        />
                    </Grid>                     
                </Grid>
            </div>
        )
    }
}

/**
 * Defines the OrderFields Component.
 * Shows all Fields needed for order creations, edits, etc..
 * @param {props} props - Given properties of mother component (styling, TextField props,...)
 * @return {Component} - OrderFields Component
 */
export default withStyles(useStyles) (OrderFields);
