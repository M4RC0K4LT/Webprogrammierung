/** 
 * Function to request Express Backend and return JSON - Delete UserSessionToken
 * @returns {JSON} Successful request or failed
 */
export default function deleteUserSession(){

    return (
        fetch(window.$apiroute + 'api/user/logout', {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            }
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Logout failed: " + error.message) + '}'))
    )
}