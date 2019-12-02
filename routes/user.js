const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    res.send('User overview');
});

router.get('/login', function(req, res) {
    res.send('User login');
});

router.get('/register', function(req, res) {
    res.send('User register');
});


module.exports = router;