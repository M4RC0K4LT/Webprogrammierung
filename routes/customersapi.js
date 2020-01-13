const express = require("express");
const router = express.Router();

const customers = require("../database/customers");


//Customer Übersicht
router.get('/', async (request, response) => {
    try {
        const allcustomers = await customers.getAll();
        response.status(201).send(allcustomers);
    } catch(err){
        response.status(503).send(err);
    }
    
});

//Detail Seite
router.get('/:id', async (request, response) => {
    try {
        const customer = await customers.findById(request.params.id);
        if (customer == null) {
            response.status(404).send({error: `Customer ${request.params.id} not found`});
            return;
        }
        response.status(201).send(customer);
    } catch (err){
        response.status(503).send(err);
    }
    
});

//Customer hinzufügen
router.post('/', async (request, response) => {
    try {
        const customer = await customers.create(request.body);
        response.status(201).send(customer);
    } catch (err) {
        response.status(503).send(err);
    }
    
});

//Customer ändern/updaten
router.put('/:id', async (request, response) => {
    try {
        const customer = await customers.update(request.params.id, request.body);
        response.status(201).send(customer);
    } catch (err){
        response.status(503).send(err)
    }
    
});

//Customer löschen
router.delete('/', async (request, response) => {
    try {
        const isDeleted = await customers.remove(request.body.id);
        if (isDeleted == null) {
            response.status(404).send({"request": "failed", "error": `Customer ${request.params.id} not found`});
            return;
        }
        response.status(202).send({"request": "succesful"});
    } catch (err){
        response.status(503).send({"request": "failed", "error": err});
    }
    
});

module.exports = router;