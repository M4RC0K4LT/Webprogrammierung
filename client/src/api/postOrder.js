import moment from "moment";

export default function postOrder(contentlist){

    return (
        fetch('http://localhost:3001/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
            },
            body: JSON.stringify({
                "title": contentlist[0],
                "description": contentlist[1],
                "starting": moment(contentlist[2]).format("YYYY-MM-DD HH:mm"),
                "duration": contentlist[3]/60,
                "hourlyrate": contentlist[4],
                "traveldistance": contentlist[5],
                "customer": contentlist[6]
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Auftrag: " + error.message) + '}'))
    )
}