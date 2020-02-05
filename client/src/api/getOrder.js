/**
 * Function to request Express Backend and return Blob - Get Order data by ID.
 * @param {string} id Selected OrderID.
 * @returns {JSON} Orderdata.
 */
export default function getOrder(id){

    return (
        fetch(window.$apiroute + "api/orders/" + id, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftragsdaten: " + error.message) + '}'))
    )
}