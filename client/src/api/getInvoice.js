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