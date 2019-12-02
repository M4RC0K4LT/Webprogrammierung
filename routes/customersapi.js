const express = require("express");
const router = express.Router();

//Datenbankoperationen bei Customern
const customers = require("../database/customers");

//Übersicht
router.get('/', async (request, response) => {
    try {
        response.send(await customers.getAll());
    } catch(err){
        response.send(err);
    }
    
});

//Detail Seite
router.get('/:id', async (request, response) => {
    try {
        const customers = await customers.findById(request.params.id);
        if (customer == null) {
            response.status(404).send({error: `Customer ${request.params.id} not found`});
            return;
        }
        response.send(customer);
    } catch (err){
        response.send(err);
    }
    
});

//Customer hinzufügen
router.post('/', async (request, response) => {
    const customer = await customers.create(request.body);
    response.status(201).send(customer);
});

//Customer ändern/updaten
router.put('/:id', async (request, response) => {
    try {
        const customer = await customers.update(request.params.id, request.body);
        response.status(201).send(customer);
    } catch (err){
        response.send(err)
    }
    
});

//Customer löschen
router.delete('/:id', async (request, response) => {
    try {
        const isDeleted = await customers.remove(request.params.id);
        if (isDeleted == null) {
            response.status(404).send({error: `Customer ${request.params.id} not found`});
            return;
        }
        response.status(202).send("Erfolgreich gelöscht!");
    } catch (err){
        response.send(err);
    }
    
});

module.exports = router;