/** 
 * Function to request Express Backend and return JSON - Delete Customer
 * @param {string} id - Selected CustomerID
 * @returns {JSON} Successful request or failed
 */
export default function deleteCustomer(id){

    return (
        fetch(window.$apiroute + 'api/customers/', {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "id": id,
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kunde löschen: " + error.message) + '}'))
    )
}