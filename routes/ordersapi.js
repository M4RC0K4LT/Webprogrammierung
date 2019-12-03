const express = require("express");
const router = express.Router();
const PDFDocument = require('pdfkit')

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

router.post('/rechnung/test', async (request, response) => {

    let orders_for_invoice = request.body.list;
    all_order_elements_for_invoice = [];
    try{
        for await (element of orders_for_invoice){
            order_elements_for_invoice = [];
            const order = await orders.findById(element);
            if (order == null){
                continue;
            }
            order_elements_for_invoice.push(order.order_description);
            order_elements_for_invoice.push(order.order_hourlyrate);
            order_elements_for_invoice.push(order.order_traveldistance);
            all_order_elements_for_invoice.push(order_elements_for_invoice);
        }
        response.send(all_order_elements_for_invoice);
    } catch (err){
        response.send(err);
    }

    /*const doc = new PDFDocument()
    filename = 'test.pdf';
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    doc.x = 400;
    const centerwidth = doc.page.width/2;
    const centerheight = doc.page.width/2
    doc.image('./bearing.png', centerwidth-65, 40, {fit: [130, 130], align: 'center', valign: 'center'})
    doc.font("Helvetica-Bold").fontSize(18);
    doc.text("Georg Müller Kugellager GmbH", 50, 200, {align: 'center', font: 'Helvetica-Bold'});
    doc.moveTo(30, 250).lineTo(580, 250).stroke();
    doc.font("Helvetica")
    doc.pipe(res)
    doc.end()*/
  })

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