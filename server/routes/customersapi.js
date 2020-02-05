/**
 * A router module that receives api requests regarding customers
 * @module routes/customersapi
 */

/** Use Express and basic Router module */
const express = require("express");
const router = express.Router();

/** Database interaction */
const customers = require("../database/customers");


/** GET: Show all customers */
router.get('/', async (request, response) => {
    try {
        const allcustomers = await customers.getAll();
        response.status(200).send(allcustomers);
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
    
});

/** GET: Specific customer information */
router.get('/:id', async (request, response) => {
    try {
        const customer = await customers.findById(request.params.id);
        const avgtraveldistance = await customers.getAvgTraveldistance(request.params.id);
        const avghourlyrate = await customers.getAvgHourlyrate(request.params.id);
        const avgduration = await customers.getAvgDuration(request.params.id);
        const avgordercost = await customers.getAvgOrderCost(request.params.id);
        let data = Object.assign({"request": "succesful"}, customer, avghourlyrate, avgtraveldistance, avgduration, avgordercost);
        response.status(200).send(data);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }   
});

/** POST: Returns amount of monthly orders */
router.post('/statistics/', async (request, response) => {  
    try {
        const month = await customers.getOrderAmountMonth(request.body);
        response.status(200).send(month);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }  
});

/** POST: Create new customer */
router.post('/', async (request, response) => {
    try {
        const customer = await customers.create(request.body);
        let data = Object.assign({"request": "successful"}, customer)
        response.status(200).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
});

/** PUT: Update existing customer values */
router.put('/:id', async (request, response) => {
    try {
        const customer = await customers.update(request.params.id, request.body);
        let data = Object.assign({"request": "successful"}, customer)
        response.status(201).send(data);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data)
    }   
});

/** DELETE: Delete existing customer */
router.delete('/', async (request, response) => {
    try {
        await customers.remove(request.body.id);
        response.status(200).send({"request": "succesful"});
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }  
});

module.exports = router;