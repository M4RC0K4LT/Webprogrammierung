const express = require("express");
const router = express.Router();

//Datenbankoperationen bei Ordern
const orders = require("../database/orders");

//Übersicht
router.get('/', async (request, response) => {
    try{
        response.send(await orders.getAll());
    } catch (err){
        response.send(err);
    }
    
});
  
//Detail Seite
router.get('/:id', async (request, response) => {
    try{
        const order = await orders.findById(request.params.id);
        if (order == null) {
            response.status(404).send({error: `Order ${request.params.id} not found`});
            return;
        }
        response.send(order);
    } catch(err){
        response.send(err);
    }
    
});

//Kunden zugehörige Projekte
router.get('/customer/:id', async (request, response) => {
    try {
        const relatedorders = await orders.findByCustomer(request.params.id);
        if (relatedorders.toString().length == 0) {
            response.status(404).send({error: `Customer ${request.params.id} not found / Customer has no associated orders`});
            return;
        }
        response.send(relatedorders);
    } catch (err){
        response.send(err);
    }
    
});

//Order hinzufügen
router.post('/', async (request, response) => {
    try{
        const order = await orders.create(request.body);
        response.send(order);
    } catch(err){
        response.send(err);
    }  
});

//Order ändern/updaten
router.put('/:id', async (request, response) => {
    try{
        const order = await orders.update(request.params.id, request.body);
        response.status(201).send(order);
    } catch (err){
        response.send(err);
    }
    
});

//Order löschen
router.delete('/:id', async (request, response) => {
    try {
        const isDeleted = await orders.remove(request.params.id);
        if (isDeleted == null) {
            response.status(404).send({error: `Order ${request.params.id} not found`});
            return;
        }
        response.status(202).send("Erfolgreich gelöscht!");
    } catch (err){
        response.send(err);
    }
    
});

module.exports = router;