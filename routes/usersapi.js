const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

const users = require("../database/users");

router.get('/', async function(request, response) {
    try {
        response.send(await users.getAll());
    } catch(err){
        response.send(err);
    }
});

router.post('/login', async function(request, response) {
    try {
        const passwordhash = await users.findPasswordByMail(request.body.mail);
        if(passwordhash == null){
            return response.send("No user found!");
        }
        var correct = bcrypt.compareSync(request.body.password.toString(), passwordhash);
        if (correct == true) {
            var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
            response.status(201).send("Password correct!" + token);
        } else {
            response.status(201).send("Password wrong!");
        }
        
    } catch (err) {
        response.send(err);
    }
});

router.post('/register', async function(request, response) {
    try {
        const user = await users.create(request.body);
        response.status(201).send(user);
    } catch (err) {
        response.send(err);
    }
});

router.put('/change', async function(request, response) {
    try {
        const user = await users.update(request.body);
        response.status(201).send(user);
    } catch (err) {
        response.send(err);
    }
});


module.exports = router;