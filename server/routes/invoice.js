/**
 * A module that creates an invoice based on given params
 * @module routes/invoice
 */


/** Use PDFKit npm module */
const PDFDocument = require('pdfkit')

/** Invoice PDF creation */
function createInvoice(customerdata, all_order_elements_for_invoice, response){

    const doc = new PDFDocument({
        margin:35
    });

    /** Set response headers */
    filename = 'invoice.pdf';
    response.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    response.setHeader('Content-type', 'application/pdf');

    /** Pre-defined value */
    const eur_per_km = 1.2;

    /** Set company logo, slogan and preferred font */
    doc.image('./.data/bearing.png', 440, 50, {fit: [100, 100], align: 'right', valign: 'center'})
    doc.font("./fonts/OpenSans-BoldItalic.ttf");
    doc.text("Georg Müller Kugellager GmbH", 0, 165, {align: 'right'});

    /** Set PDF header with customer name, adress, ... */
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
    
    /** Set element specific cursor positions */
    var abstand = 290;  
    var x_position = 30;
    var x_anzahl = 100;
    var x_preis = 200;
    var x_einheit = 155;
    var x_beschreibung = 270;
    var x_netto = 480;

    /** Set table header */
    doc.fontSize(9)
    doc.text("Position", x_position,250);
    doc.text("Anzahl", x_anzahl,250);
    doc.text("Preis", x_preis,250);
    doc.text("Einheit", x_einheit,250);
    doc.text("Beschreibung", x_beschreibung,250);
    doc.text("Netto", x_netto,250);
    doc.moveTo(30, 272).lineTo(580, 272).stroke();

    /** Create invoice positions */
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

        /** Optional travel costs */
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

        /** Set updated cursor positions */
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

    /** Total amount with taxes */
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

    /** Footer including bank data */
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

    return response;
}


/**
 * Invoice PDF creation.
 * @param {JSON} customerdata - Customerdata for invoice header.
 * @param {Array} all_order_elements_for_invoice - Array (with several subArrays) filled with selected OrderData.
 * @param {Response} response - http Response for returning invoice PDF.
 * @return {Response} http PDF-filled response.
 */
module.exports = createInvoice