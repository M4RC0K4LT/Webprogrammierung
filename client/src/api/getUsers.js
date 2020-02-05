/**
 * Function to request Express Backend and return JSON - Get all registered Users.
 * @returns {JSON} Contains Array full of userdata
 */
export default function getUsers(){

    return (
        fetch(window.$apiroute + "api/user/all", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        }})
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Userdaten: " + error.message) + '}'))
    )
}