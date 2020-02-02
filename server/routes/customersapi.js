const express = require("express");
const router = express.Router();

const customers = require("../database/customers");


//Customer Übersicht
router.get('/', async (request, response) => {
    try {
        const allcustomers = await customers.getAll();
        response.status(201).send(allcustomers);
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
    
});

//Detail Seite
router.get('/:id', async (request, response) => {
    try {
        const customer = await customers.findById(request.params.id);
        const avgtraveldistance = await customers.getAvgTraveldistance(request.params.id);
        const avghourlyrate = await customers.getAvgHourlyrate(request.params.id);
        const avgduration = await customers.getAvgDuration(request.params.id);
        const avgordercost = await customers.getAvgOrderCost(request.params.id);
        let data = Object.assign({"request": "succesful"}, customer, avghourlyrate, avgtraveldistance, avgduration, avgordercost);
        response.status(201).send(data);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
    
});

//Kundenstatistiken - Aufträge pro Monat
router.post('/statistics/', async (request, response) => {   
    const month = await customers.getOrderAmountMonth(request.body);
    response.send(month);
});

//Customer hinzufügen
router.post('/', async (request, response) => {
    try {
        const customer = await customers.create(request.body);
        let data = Object.assign({"request": "successful"}, customer)
        response.status(201).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
    
});

//Customer ändern/updaten
router.put('/:id', async (request, response) => {
    try {
        const customer = await customers.update(request.params.id, request.body);
        let data = Object.assign({"request": "successful"}, customer)
        response.status(201).send(data);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data)
    }
    
});

//Customer löschen
router.delete('/', async (request, response) => {
    try {
        await customers.remove(request.body.id);
        response.status(202).send({"request": "succesful"});
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
    
});

module.exports = router;