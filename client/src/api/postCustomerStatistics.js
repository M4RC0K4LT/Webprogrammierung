export default function postCustomerStatistics(id, year){

    return (
        fetch(window.$apiroute + "api/customers/statistics", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },body: JSON.stringify({
                "id": id,
                "year": year
            })})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kundendaten: " + error.message) + '}'))
    )
}