export default function postUser(mail, password){

    return (
        fetch(window.$apiroute + 'api/user/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "mail": mail,
                "password": password
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Logindata: " + error.message) + '}'))
    )
}