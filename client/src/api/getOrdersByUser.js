/** 
 * Function to request Express Backend and return JSON - Get all registered Orders created by UserID 
 * @param {string} id with Array of Orders
 * @returns {JSON} Filled with Array of Orders
 */
export default function getOrdersByUser(userid){

    return (
        fetch(window.$apiroute + "api/orders/get/own", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "id": parseInt(userid),
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Meine Aufträge: " + error.message) + '}'))
    )
}