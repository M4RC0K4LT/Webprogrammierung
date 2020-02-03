// NPM-Module
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

require("dotenv").config()

const port = process.env.PORT || 3001

// Router
const userapi = require("./routes/usersapi");
const orderapi = require("./routes/ordersapi");
const customerapi = require("./routes/customersapi");
const auth = require("./database/auth");


app.use(bodyParser.json());
app.use(cors());

app.options('*', cors())

// User Funktionen
app.use("/api/user", userapi);

// Order Funktionen
app.use("/api/orders", auth, orderapi);

// Customer Funktionens
app.use("/api/customers", auth, customerapi);

// listen for requests
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
