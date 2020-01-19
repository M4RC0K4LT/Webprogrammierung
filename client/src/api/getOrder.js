export default function getOrder(id){

    return (
        fetch("https://kaltenstadler.net/api/orders/" + id, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftragsdaten: " + error.message) + '}'))
    )
}