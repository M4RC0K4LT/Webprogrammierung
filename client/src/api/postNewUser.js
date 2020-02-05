/** Function to request Express Backend and return JSON - Register new User
 * @param {string} username Preferred username.
 * @param {string} mail Preferred mail.
 * @param {string} password Preferred unhashed password.
 * @returns {JSON} Userdata.
 */
export default function postNewUser(username, mail, password){

    return (
        fetch(window.$apiroute + 'api/user/register', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "name": username,
                "mail": mail,
                "password": password
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "User: " + error.message) + '}'))
    )
}