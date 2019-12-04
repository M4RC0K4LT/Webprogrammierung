const express = require("express");
const router = express.Router();
const PDFDocument = require('pdfkit')
var timediff = require('timediff');

//Datenbankoperationen bei Ordern
const orders = require("../database/orders");
const customers = require("../database/customers");


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

router.get('/rechnung/test', async (request, response) => {

    //TODO: ausgliedern-aufräumen

    //Noch Hardcoded
    let orders_for_invoice = '"list": [3,4,6,1,2]'; //8, 9, 10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44
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
            order_elements_for_invoice.push(order.order_description);
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
    const doc = new PDFDocument({
        margin:35
    });
    filename = 'test.pdf';
    response.setHeader('Content-disposition', 'inline; filename="' + filename + '"')
    response.setHeader('Content-type', 'application/pdf')
    const centerwidth = doc.page.width/2;
    const centerheight = doc.page.width/2

    //Logo und Firmenname
    doc.image('./bearing.png', 440, 50, {fit: [100, 100], align: 'right', valign: 'center'})
    doc.font("./fonts/OpenSans-BoldItalic.ttf");
    doc.text("Georg Müller Kugellager GmbH", 0, 165, {align: 'right'});

    //Anschrift Kunde
    doc.font("./fonts/OpenSans-Light.ttf").fontSize(12);
    doc.text(customerdata.customer_name, 60,60);
    if(!(customerdata.customer_company == null)){
        doc.text(customerdata.customer_company);
    }
    doc.text(customerdata.customer_street_number);
    doc.text(customerdata.customer_zipcode + " " + customerdata.customer_town);
    doc.text(customerdata.customer_country);
    doc.moveDown(1);
    doc.text(customerdata.customer_mail);
    doc.font("./fonts/OpenSans-Regular.ttf").fontSize(15);
    doc.text("Rechnung", 30, 200, {align: 'center'});
    doc.moveTo(30, 240).lineTo(580, 240).stroke();
    
    //Strukturunterteilung
    var abstand = 290;  
    var x_position = 30;
    var x_anzahl = 100;
    var x_preis = 200;
    var x_einheit = 155;
    var x_beschreibung = 270;
    var x_netto = 480;

    doc.fontSize(9)
    doc.text("Position", x_position,250);
    doc.text("Anzahl", x_anzahl,250);
    doc.text("Preis", x_preis,250);
    doc.text("Einheit", x_einheit,250);
    doc.text("Beschreibung", x_beschreibung,250);
    doc.text("Netto", x_netto,250);
    doc.moveTo(30, 272).lineTo(580, 272).stroke();

    //Aufträge Abrechnung
    var position = 0;
    var gesamtpreis = 0;
    all_order_elements_for_invoice.forEach(element => {
        doc.text(position+1, x_position+20, abstand);
        doc.text(element[0], x_anzahl, abstand);
        doc.text("h", x_einheit, abstand);
        doc.text(element[1] + "€", x_preis, abstand);
        doc.text(element[2], x_beschreibung, abstand);
        doc.text(element[3], x_netto, abstand);
        doc.text("€", x_netto+45, abstand);

        //Optionale Fahrtkosten
        if(!(element[4] == null)){
            position += 1;
            abstand += 20;
            doc.text(position+1, x_position+20, abstand);
            doc.font("./fonts/OpenSans-LightItalic.ttf");
            doc.text(element[4], x_anzahl, abstand);
            doc.text(eur_per_km + "€", x_preis, abstand);
            doc.font("./fonts/OpenSans-Regular.ttf").text("km", x_einheit, abstand);
            doc.font("./fonts/OpenSans-LightItalic.ttf");
            doc.text("Anfahrtskosten (km-Pauschale)", x_beschreibung, abstand);
            doc.text(element[5], x_netto, abstand);
            doc.text("€", x_netto+45, abstand);
            doc.font("./fonts/OpenSans-Regular.ttf");
        }
        gesamtpreis = gesamtpreis + element[6];
        position += 1;
        abstand += 40;
        if(abstand > 630){
            doc.font("./fonts/OpenSans-ExtraBold.ttf").text("Fortsetzung auf der nächsten Seite", 40, abstand+15, {align: "center"});
            doc.addPage();
            doc.font("./fonts/OpenSans-Regular.ttf");
            abstand = 50;
        }
    });

    //Gesamtbetrag
    doc.moveTo(30, abstand).lineTo(580, abstand).stroke();
    abstand += 10;
    doc.text("Gesamt exkl. MwSt.", x_beschreibung, abstand);
    doc.text(gesamtpreis.toFixed(2), x_netto, abstand);
    doc.text("€", x_netto+45, abstand);
    abstand += 20;
    doc.text("Mehrwertsteuer 19%", x_beschreibung, abstand);
    doc.text((gesamtpreis*0.19).toFixed(2), x_netto, abstand);
    doc.text("€", x_netto+45, abstand);
    abstand += 20;
    doc.font("./fonts/OpenSans-ExtraBold.ttf");
    doc.text("Gesamtpreis", x_beschreibung, abstand);
    doc.text((gesamtpreis*1.19).toFixed(2), x_netto, abstand);
    doc.text("€", x_netto+45, abstand);

    //Fußzeile
    doc.moveTo(80, 700).lineTo(530, 700).opacity(0.5).stroke();
    doc.fontSize(5);
    doc.opacity(0.5).text("Georg Müller Kugellager GmbH", 45, 701, {align: 'center'});
    doc.opacity(0.5).text("Vielen Dank für Ihr Vertrauen in uns! Gerne würden wir Sie ein weiteres Mal bei uns begrüßen!", 45, 706, {align: 'center'});
    doc.opacity(0.5).text("Der oben stehende Betrag ist mit einer Zahlungsfrist von 14 Tagen auf folgendes Konto zu überweisen:", 45, 712, {align: 'center'});
    doc.opacity(0.5).text("Verwendungszweck: XXXXXXXXXXXXX", 45, 724, {align: 'center'});
    doc.opacity(0.5).text("Bank: Musterbank Frankfurt", 45, 730, {align: 'center'});
    doc.opacity(0.5).text("IBAN: DE02120300000000202051", 45, 736, {align: 'center'});
    doc.opacity(0.5).text("BIC: ABCDEFGHIJ", 45, 742, {align: 'center'});
    doc.opacity(0.5).text("USt.-IdNr.: DE123456789", 45, 748, {align: 'center'});
    doc.pipe(response);
    doc.end();
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