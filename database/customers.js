const db = require('./database_new_init.js');
const NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  apiKey: 'AIzaSyBSxN4qq-CR-HeNyxVlvQ06oTxscljozCI'
};

var geocoder = NodeGeocoder(options);


module.exports = {

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM customers`, (err, result) => {
        if (err) {
          result["request"] = "failed";
          reject(err);
        } else {
          result["request"] = "successful";
          resolve(result);
        }
      });
    });
  },

  findById: cusid => {
    const id = parseInt(cusid)
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
        if (err) {
          err["request"] = "failed";
          reject(err);
        } else {
          result["request"] = "successful";
          resolve(result);
        }
      });
    });
  },

  create: async jsonObject => {

    const adressstring = jsonObject.street_number.toString() + ", " + jsonObject.zipcode.toString() + jsonObject.town.toString;
    let addressfound = await geocoder.geocode(adressstring, function (err, data) { });

    if (addressfound < 1) {
      return ({ "request": "failed", "error": "Use a correct adress!" })
    }

    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO customers (customer_name, customer_company, customer_mail, customer_country, customer_zipcode, customer_town, customer_street_number, customer_hourlyrate) VALUES($name, $company, $mail, $country, $zipcode, $town, $street_number, $hourlyrate)`,
        {
          $name: jsonObject.name,
          $company: jsonObject.company,
          $mail: jsonObject.mail,
          $country: jsonObject.country,
          $zipcode: jsonObject.zipcode,
          $town: jsonObject.town,
          $street_number: jsonObject.street_number,
          $hourlyrate: jsonObject.hourlyrate
        },
        function (err) {
          if (err) {
            err["request"] = "failed";
            reject(err);
          }
          db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: this.lastID }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      )
    });

  },

  update: async (id, jsonObject) => {

    const adressstring = jsonObject.street_number.toString() + ", " + jsonObject.zipcode.toString() + jsonObject.town.toString();
    let addressfound = await geocoder.geocode(adressstring, function (err, data) { });

    if (addressfound < 1) {
      return ({ "request": "failed", "error": "Use a correct adress!" });
    }

    return new Promise((resolve, reject) => {
      id = parseInt(id);
      db.run(

        `UPDATE customers SET customer_name = $name, customer_company = $company, customer_mail = $mail, customer_country = $country, customer_zipcode = $zipcode, customer_town = $town, customer_street_number = $street_number, customer_hourlyrate = $hourlyrate WHERE customer_id = $id`,
        {
          $name: jsonObject.name,
          $company: jsonObject.company,
          $mail: jsonObject.mail,
          $country: jsonObject.country,
          $zipcode: jsonObject.zipcode,
          $town: jsonObject.town,
          $street_number: jsonObject.street_number,
          $hourlyrate: jsonObject.hourlyrate,
          $id: id
        },
        function (err) {
          if (err) {
            err["request"] = "failed";
            reject(err);
          }
          db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
            if (err) {
              err["request"] = "failed";
              reject(err);
            } else {
              result["request"] = "successful";
              resolve(result);
            }
          });
        }
      )
    });
  },

  remove: id => {
    return new Promise((resolve, reject) => {
      id = parseInt(id);
      db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result != null) {
            db.run(
              `DELETE FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
                if (err) {
                  reject(false);
                } else {
                  resolve(true);
                }
              });
          } else {
            resolve(result);
          }
        }
      });

    });
  }
};