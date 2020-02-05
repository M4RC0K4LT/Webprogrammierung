/**
 * Function to request Express Backend and return Blob - Get invoice for selected orders.
 * @param {Array} idlist Array with selected OrderIDs.
 * @returns {Blob} Created invoice PDF.
 */
export default function getInvoice(idlist){

    return (
        fetch(window.$apiroute + "api/orders/get/invoice", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },body: JSON.stringify({
                "idlist": idlist,
        })})
        .then(response => response.blob())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftragsdaten: " + error.message) + '}'))
    )
}