export default function postCustomer(contentlist){

    return (
        fetch('http://localhost:3001/api/customers/', {
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
                "town": contentlist[5],
                "street_number": contentlist[6],
                "hourlyrate": contentlist[7]
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kunde: " + error.message) + '}'))
    )
}