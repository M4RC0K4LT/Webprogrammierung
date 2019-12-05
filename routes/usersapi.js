const express = require("express");
const router = express.Router();
const auth = require("../database/auth");

const users = require("../database/users");

//User Übersicht
router.get('/', async function(request, response) {
    try {
        response.send(await users.getAll());
    } catch(err){
        response.send(err);
    }
});

//User Login
router.post('/login', async function(request, response) {
    try {
        const login = await users.login(request.body.mail, request.body.password);
        response.send(login);       
    } catch (err) {
        response.send(err);
    }
});

//User Registrierung
router.post('/register', async function(request, response) {
    try {
        const user = await users.create(request.body);
        response.status(201).send(user);
    } catch (err) {
        response.send(err);
    }
});

//User Logout
router.delete('/logout', auth, async function(request, response){
    try {
        const user = await users.logout(request.token);
        response.status(201).send(user);
    } catch (err) {
        response.send(err);
    }
});

//Userdaten abändern
router.put('/change', auth, async function(request, response) {
    try {
        const user = await users.update(request.body);
        response.status(201).send(user);
    } catch (err) {
        response.send(err);
    }
});


module.exports = router;