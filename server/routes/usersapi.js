const express = require("express");
const router = express.Router();

const auth = require("../database/auth");
const users = require("../database/users");

//User Übersicht
router.get('/', auth, async function(request, response) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const userdetail = await users.findByToken(token);
        if(userdetail.request === "successful"){
            return response.status(201).send(userdetail);
        }else {
            return response.status(503).send(userdetail);
        }       
    } catch(err){
        response.status(503).send(err);
    }
});


//User Login
router.post('/login', async function(request, response) {
    try {
        const login = await users.login(request.body.mail, request.body.password);
        let data = Object.assign({"request": "successful"}, login)
        response.status(201).send(data);       
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
});

//User Registrierung
router.post('/register', async function(request, response) {
    try {
        const existsname = await users.findByName(request.body.name)
        const existsmail = await users.findByMail(request.body.mail)
        if(existsname != null){
            return response.status(500).send({"request": "failed", "error": "Username schon vergeben"});
        }        
        if(existsmail != null){
            return response.status(500).send({"request": "failed", "error": "Mailadresse schon registriert"});
        }
        else {
            const user = await users.create(request.body);
            let data = Object.assign({"request": "successful"}, user)
            return response.status(201).send(data);
        }
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
});

//User Logout
router.delete('/logout', auth, async function(request, response){
    try {
        const user = await users.logout(request.token);
        let data = Object.assign({"request": "successful"}, user)
        response.status(201).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
});

//Userdaten abändern
router.put('/change', auth, async function(request, response) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        const userdetail = await users.findByToken(token);
        if(userdetail.request === "failed"){
            return response.status(503).send(userdetail);
        }

        const existsname = await users.findByName(request.body.name)
        const existsmail = await users.findByMail(request.body.mail)

        if(existsname != null && existsname.user_id != userdetail.user_id){
            return response.status(500).send({"request": "failed", "error": "Username schon vergeben"});
        }        
        if(existsmail != null && existsmail.user_id != userdetail.user_id){
            return response.status(500).send({"request": "failed", "error": "Mailadresse schon registriert"});
        }

        const user = await users.update(userdetail.user_id, request.body);
        let data = Object.assign({"request": "successful"}, user)
        response.status(201).send(data);
    } catch (err) {
        let data = Object.assign({"request": "failed"}, err)
        response.status(503).send(data);
    }
});




module.exports = router;