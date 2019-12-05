// NPM-Module
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config()

// Router
const user = require("./routes/usersapi");
const orderapi = require("./routes/ordersapi");
const customerapi = require("./routes/customersapi");
const auth = require("./database/auth");

app.use(bodyParser.json());

// User Funktionen
app.use("/api/user", auth, user);

// Order Funktionen
app.use("/api/orders", orderapi);

// Customer Funktionens
app.use("/api/customers", auth, customerapi);

// listen for requests
app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + process.env.PORT);
});
