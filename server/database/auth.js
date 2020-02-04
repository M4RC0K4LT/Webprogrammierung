/**
 * A module that checks authorization header on API request.
 * Used as express middleware.
 * Rejects if token does not belong to a user or if none is given.
 * @module database/auth
 */

/** Import Database */
const users = require("./users");

/** Import NPM-Module to decode and check authorization header */
const jwt = require('jsonwebtoken');
var JWT_KEY = process.env.TOKEN;



/** Authenticate a API request */
function auth(request, response, next) {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null){
        return response.status(401).send({"request": "failed", "error": "Bitte einloggen"});
    }
    jwt.verify(token, JWT_KEY, async (err, userid) => {
        if(err){
            return response.status(503).send({"request": "failed", "error": ("UserToken: " + err.message)});
        }

        const user = await users.findById(parseInt(userid));
        if(user.user_tokens == token){
            request.token = token;
            request.userid = userid;
            next();
        } else {
            return response.status(401).send({"request": "failed", "error": "UserToken: Ungültig"})
        }
        
    });
}

/**
 * API request authorization.
 * @param {request} request - API request.
 * @param {response} response - API response.
 * @param {next} next - Middleware parameter
 * @return {next} If request is authorized. Otherwise returns Response.
 */
module.exports = auth