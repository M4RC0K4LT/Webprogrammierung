// NPM-Module
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

require("dotenv").config()

// Router
const userapi = require("./routes/usersapi");
const orderapi = require("./routes/ordersapi");
const customerapi = require("./routes/customersapi");
const auth = require("./database/auth");

app.use(bodyParser.json());

// User Funktionen
app.use("/api/user", cors(), userapi);

// Order Funktionen
app.use("/api/orders", cors(), auth, orderapi);

// Customer Funktionens
app.use("/api/customers", cors(), auth, customerapi);

// listen for requests
app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + process.env.PORT);
});
