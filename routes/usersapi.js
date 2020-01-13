const express = require("express");
const router = express.Router();

const auth = require("../database/auth");
const users = require("../database/users");

//User Übersicht
router.get('/', async function(request, response) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const userdetail = await users.findByToken(token);
        response.status(201).send(userdetail);
    } catch(err){
        console.log(err);
        response.status(503).send(err);
    }
});


//User Login
router.post('/login', async function(request, response) {
    try {
        const login = await users.login(request.body.mail, request.body.password);
        response.status(201).send(login);       
    } catch (err) {
        response.status(503).send(err);
    }
});

//User Registrierung
router.post('/register', async function(request, response) {
    try {
        const existsname = await users.findByName(request.body.name)
        const existsmail = await users.findByMail(request.body.mail)
        if(existsname != null){
            return response.status(500).send({"request": "failed", "error": "Username already exists!"});
        }        
        if(existsmail != null){
            return response.status(500).send({"request": "failed", "error": "Mail already exists!"});
        }
        else {
            const user = await users.create(request.body);
            return response.status(201).send(user);
        }
    } catch (err) {
        response.status(503).send(err);
    }
});

//User Logout
router.delete('/logout', auth, async function(request, response){
    try {
        const user = await users.logout(request.token);
        response.status(201).send(user);
    } catch (err) {
        response.status(503).send(err);
    }
});

//Userdaten abändern
router.put('/change',  async function(request, response) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const userdetail = await users.findByToken(token);
        const user = await users.update(userdetail.user_id, request.body);
        response.status(201).send(user);
    } catch (err) {
        response.status(503).send(err);
    }
});


module.exports = router;