/** 
 * Function to request Express Backend and return JSON - Get Userdata by AuthorizationToken.
 * @returns {JSON} Userdata.
 */
export default function getUser(){

    return (
        fetch(window.$apiroute + "api/user/", {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "User: " + error.message) + '}'))
    )
}