export default function putUser(name, mail, password){

    return (
        fetch('https://kaltenstadler.net/api/user/change', {
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
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Kunde: " + error.message) + '}'))
    )
}