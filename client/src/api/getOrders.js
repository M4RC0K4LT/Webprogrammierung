export default function getOrders(){

    return (
        fetch("https://kaltenstadler.net/api/orders/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Aufträge: " + error.message) + '}'))
    )
}