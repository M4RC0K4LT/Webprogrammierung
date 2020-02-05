/** 
 * Function to request Express Backend and return JSON - Change User Data
 * @param {string} mail Updated mail attribute.
 * @param {string} name Updated username attribute.
 * @param {string} password Updated password attribute.
 * @returns {JSON} Updated Userdata.
 */

export default function putUser(name, mail, password){

    return (
        fetch(window.$apiroute + 'api/user/change', {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "mail": mail,
                "name": name,
                "password": password
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "User: " + error.message) + '}'))
    )
}