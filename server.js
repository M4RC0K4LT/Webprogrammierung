// NPM-Module
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const serverport = 3001;

// Router
const user = require("./routes/user");
const orderapi = require("./routes/ordersapi");
const customerapi = require("./routes/customersapi");

app.use(bodyParser.json());

// User Funktionen
app.use("/user", user);

// Order Funktionen
app.use("/api/orders", orderapi);

// Customer Funktionen
app.use("/api/customers", customerapi);

// listen for requests
app.listen(serverport, function() {
  console.log("Your app is listening on port " + serverport);
});
