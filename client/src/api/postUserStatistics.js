/** Function to request Express Backend and return JSON - Get monthly amount of orders by year
 * @param {string} year Selected Year.
 * @param {string} id Selected UserID.
 * @returns {JSON} Statistics about monthly amount of orders.
 */
export default function postUserStatistics(year, id){

    return (
        fetch(window.$apiroute + "api/user/statistics", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },body: JSON.stringify({
                "year": year,
                "id": id
            })})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Userstatistiken: " + error.message) + '}'))
    )
}