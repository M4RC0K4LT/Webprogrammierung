/** Function to request Express Backend and return JSON - Get monthly amount of orders by year
 * @param {string} year Selected Year.
 * @returns {JSON} Statistics about monthly amount of orders.
 */
export default function postOrderStatistics(year){

    return (
        fetch(window.$apiroute + "api/orders/statistics", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },body: JSON.stringify({
                "year": year
            })})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftragsstatistiken: " + error.message) + '}'))
    )
}