export default function postNewUser(username, mail, password){

    return (
        fetch('http://192.168.2.117:3001/api/user/register', {
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