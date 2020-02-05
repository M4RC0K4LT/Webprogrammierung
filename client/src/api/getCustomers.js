/**
 * Function to request Express Backend and return JSON - Get all registered Customers.
 * @returns {JSON} Contains Array full of customerdata
 */
export default function getCustomers(){

    return (
        fetch(window.$apiroute + "api/customers/", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Abfrage Kundendaten: " + error.message) + '}'))
    )
}