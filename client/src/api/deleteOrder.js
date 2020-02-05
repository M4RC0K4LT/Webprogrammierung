/** 
 * Function to request Express Backend and return JSON - Delete Order 
 * @param {string} id - Selected OrderID
 * @returns {JSON} Successful request or failed
 */
export default function deleteOrder(id){

    return (
        fetch(window.$apiroute + 'api/orders/', {
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
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftrag löschen: " + error.message) + '}'))
    )
}