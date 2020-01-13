const express = require("express");
const router = express.Router();
const invoice = require("./invoice");
var timediff = require('timediff');

const orders = require("../database/orders");
const customers = require("../database/customers");


//Order Übersicht
router.get('/', async (request, response) => {
    try{
        const allorders = await orders.getAll();
        response.status(201).send(allorders);
    } catch (err){
        responseawait.status(503).send(err);
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
        response.status(201).send(order);
    } catch(err){
        response.status(503).send(err);
    }  
});

//Rechnungserstellung
router.post('/get/invoice', async (request, response) => {

    let orders_for_invoice = request.body.idlist
    const eur_per_km = 1.2; 
    all_order_elements_for_invoice = [];
    try{
        for await (element of orders_for_invoice){
            order_elements_for_invoice = [];
            const order = await orders.findById(element);
            if (order == null){
                continue;
            }
            var timedifference = timediff(order.order_starting, order.order_ending, 'm');
            var workingtime = (parseInt(timedifference.minutes)/60).toFixed(2);
            order_elements_for_invoice.push(workingtime);
            order_elements_for_invoice.push(order.order_hourlyrate);
            order_elements_for_invoice.push(order.order_title);
            var workingcost = parseFloat((workingtime*order.order_hourlyrate).toFixed(2));
            order_elements_for_invoice.push(workingcost);
            order_elements_for_invoice.push(order.order_traveldistance);
            var travelcost = parseFloat((order.order_traveldistance*eur_per_km).toFixed(2));
            order_elements_for_invoice.push(travelcost);
            order_elements_for_invoice.push(travelcost+workingcost);
            order_elements_for_invoice.push(order.order_customer);           
            all_order_elements_for_invoice.push(order_elements_for_invoice);
        }
    } catch (err){
        response.send(err);
    }

    customerid = all_order_elements_for_invoice[0][7];
    const customerdata = await customers.findById(customerid);
    response = invoice(customerdata, all_order_elements_for_invoice, response);


  })


//Kunden zugehörige Projekte
router.get('/customer/:id', async (request, response) => {
    try {
        const relatedorders = await orders.findByCustomer(request.params.id);
        if (relatedorders.toString().length == 0) {
            response.status(404).send({error: `Customer ${request.params.id} not found / Customer has no associated orders`});
            return;
        }
        response.status(201).send(relatedorders);
    } catch (err){
        response.status(503).send(err);
    }
    
});

//Auftrag hinzufügen
router.post('/', async (request, response) => {
    try{
        const order = await orders.create(request.body);
        response.status(201).send(order);
    } catch(err){
        response.status(503).send(err);
    }  
});

//Auftrag ändern/updaten
router.put('/:id', async (request, response) => {
    try{
        const order = await orders.update(request.params.id, request.body);
        response.status(201).send(order);
    } catch (err){
        response.status(503).send(err);
    }
    
});

//Auftrag löschen
router.delete('/', async (request, response) => {
    try {
        const isDeleted = await orders.remove(request.body.id);
        if (isDeleted == null) {
            response.status(404).send({"request": "failed", "error": `Order ${request.params.id} not found`});
            return;
        }
        response.status(202).send({"request": "successful"});
    } catch (err){
        response.status(503).send({"request": "failed", "error": err});
    }
    
});

module.exports = router;