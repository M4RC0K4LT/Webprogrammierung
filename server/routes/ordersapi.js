/**
 * A router module that receives api requests regarding orders
 * @module routes/ordersapi
 */


/** Use Express and basic Router module */
const express = require("express");
const router = express.Router();

/** Use invoice creation module */
const invoice = require("./invoice");

/** Database interaction */
const orders = require("../database/orders");
const customers = require("../database/customers");


/** GET: Show all orders */
router.get('/', async (request, response) => {
    try{
        const allorders = await orders.getAll();
        response.status(200).send(allorders);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        responseawait.status(500).send(data);
    }
});
  
/** GET: Specific order information */
router.get('/:id', async (request, response) => {
    try{
        const order = await orders.findById(request.params.id);
        let data = Object.assign({"request": "successful"}, order)
        response.status(200).send(data);
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }  
});

/** GET: All orders created/done by this user */
router.post('/get/own', async (request, response) => {
    try{
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const id = request.body.id
        const myorders = await orders.findOrdersByUser(token, id);
        response.status(200).send(myorders.reverse());
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }  
});

/** POST: Create invoice for posted OrderIDs */
router.post('/get/invoice', async (request, response) => {

    let orders_for_invoice = request.body.idlist
    if(orders_for_invoice.length<1){
        return response.status(400).send("Wrong InvoiceIDs sent!")
    }
    const eur_per_km = 1.2; 
    all_order_elements_for_invoice = [];
    try{
        for await (element of orders_for_invoice){
            order_elements_for_invoice = [];
            const order = await orders.findById(element);
            if (order == null){
                continue;
            }
            var workingtime = order.order_duration;
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


/** GET: Return orders belonging to specific customer */
router.get('/customer/:id', async (request, response) => {
    try {
        const relatedorders = await orders.findByCustomer(request.params.id);
        response.status(200).send(relatedorders);
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
    
});

/** POST: Create new order */
router.post('/', async (request, response) => {
    try{
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const order = await orders.create(request.body, token);
        let data = Object.assign({"request": "successful"}, order)
        response.status(201).send(data);
    } catch(err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }  
});

/** PUT: Update existing order values */
router.put('/:id', async (request, response) => {
    try{
        const order = await orders.update(request.params.id, request.body);
        let data = Object.assign({"request": "successful"}, order)
        response.status(201).send(data);
    } catch (err){
        console.log(err)
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
    
});

/** DELETE: Delete existing order */
router.delete('/', async (request, response) => {
    try {
        const isDeleted = await orders.remove(request.body.id);
        if (isDeleted == null) {
            response.status(404).send({"request": "failed", "error": `Order ${request.params.id} not found`});
            return;
        }
        response.status(200).send({"request": "successful"});
    } catch (err){
        let data = Object.assign({"request": "failed"}, err)
        response.status(500).send(data);
    }
    
});

module.exports = router;