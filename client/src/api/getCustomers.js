export default function getCustomers(){

    return (
        fetch("http://localhost:3001/api/customers/", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Abfrage Kundendaten: " + error.message) + '}'))
    )
}