/** 
 * Function to request Express Backend and return JSON - Get Customer by ID.
 * @param {string} id - Selected CustomerID.
 * @returns {JSON} With customerdata.
 */
export default function getCustomer(id){

    return (
        fetch(window.$apiroute + "api/customers/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kundendaten: " + error.message) + '}'))
    )
}