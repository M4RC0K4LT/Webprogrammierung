import moment from "moment";

/** 
 * Function to request Express Backend and return JSON - Change Order data
 * @param {string} id Selected OrderID
 * @param {Array} contentlist Array with updated attribute values.
 * @returns {JSON} Updated Orderdata.
 */
export default function putOrder(id, contentlist){

    return (
        fetch(window.$apiroute + 'api/orders/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "title": contentlist[0],
                "description": contentlist[1],
                "starting": moment(contentlist[2]).format("YYYY-MM-DD HH:mm"),
                "duration": contentlist[3]/60,
                "hourlyrate": contentlist[4],
                "traveldistance": contentlist[5],
                "customer": contentlist[6]
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftrag: " + error.message) + '}'))
    )
}