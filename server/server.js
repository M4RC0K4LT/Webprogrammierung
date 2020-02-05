/** Import and initialize basic modules used for Express Server */
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors())

/** Using environment variables */
require("dotenv").config()
const port = process.env.PORT || 3001

/** Express routes */
const userapi = require("./routes/usersapi");
const orderapi = require("./routes/ordersapi");
const customerapi = require("./routes/customersapi");
const auth = require("./routes/auth");

/** Available routes */
app.use("/api/user", userapi);
app.use("/api/orders", auth, orderapi);
app.use("/api/customers", auth, customerapi);

/** Start webserver */
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
