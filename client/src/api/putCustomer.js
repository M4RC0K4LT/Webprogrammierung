export default function putCustomer(id, contentlist){

    return (
        fetch(window.$apiroute + 'api/customers/' + id, {
            method: 'PUT',
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