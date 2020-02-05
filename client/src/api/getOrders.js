/** 
 * Function to request Express Backend and return JSON - Get all registered Orders 
 * @returns {JSON} Filled with Array of Orders
 */
export default function getOrders(){

    return (
        fetch(window.$apiroute + "api/orders/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Aufträge: " + error.message) + '}'))
    )
}