/** 
 * Function to request Express Backend and return JSON - Get Orders that belong to one customer (by ID) 
 * @param {string} id - Selected CustomerID
 * @returns {JSON} Array/JSON of Orders
 */
export default function getCustomerOrders(id){

    return (
        fetch(window.$apiroute + "api/orders/customer/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kundendaten: " + error.message) + '}'))
    )
}