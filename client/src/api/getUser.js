export default function getUser(){

    return (
        fetch("https://kaltenstadler.net/api/user/", {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Aufträge: " + error.message) + '}'))
    )
}