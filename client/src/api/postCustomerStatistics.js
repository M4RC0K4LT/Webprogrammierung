/** Function to request Express Backend and return JSON - Get monthly amount of orders by CustomerID
 * @param {string} id Selected CustomerID.
 * @param {string} year Selected Year.
 * @returns {JSON} Statistics about monthly amount of orders.
 */
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