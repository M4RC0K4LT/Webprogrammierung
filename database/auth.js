const jwt = require('jsonwebtoken');
const users = require("./users");

var JWT_KEY = process.env.TOKEN;

function auth(request, response, next) {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null){
        return response.send("Bitte einloggen");
    }
    jwt.verify(token, JWT_KEY, async (err, userid) => {
        if(err){
            return response.send(err);
        }

        const user = await users.findById(parseInt(userid));
        if(user.user_tokens == token){
            request.token = token;
            request.userid = userid;
            next();
        } else {
            return response.send("Falscher Token für deinen Benutzer! Token verwendet, User aber nicht angemeldet!")
        }
        
    });
}

module.exports = auth