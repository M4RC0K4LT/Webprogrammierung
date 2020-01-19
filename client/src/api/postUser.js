export default function postUser(mail, password){

    return (
        fetch('http://192.168.2.117:3001/api/user/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "mail": mail,
                "password": password
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftrag: " + error.message) + '}'))
    )
}