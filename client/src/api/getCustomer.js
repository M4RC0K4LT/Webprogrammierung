export default function getCustomer(id){

    return (
        fetch("http://localhost:3001/api/customers/" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kundendaten: " + error.message) + '}'))
    )
}