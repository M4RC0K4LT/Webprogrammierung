/** 
 * Function to request Express Backend and return JSON - Add new customer
 * @param {Array} contentlist Array with attribute values.
 * @returns {JSON} Customerdata.
 */
export default function postCustomer(contentlist){

    return (
        fetch(window.$apiroute + 'api/customers/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "name": contentlist[0],
                "company": contentlist[1],
                "mail": contentlist[2],
                "country": contentlist[3],
                "zipcode": contentlist[4],
                "street_number": contentlist[5],
                "hourlyrate": contentlist[6]
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kunde: " + error.message) + '}'))
    )
}