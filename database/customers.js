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
          reject(err);
        } else {
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
          reject(err);
        } else {
          if(result == null){
            reject({"error": "Kunde nicht gefunden"})
          }
          resolve(result);
        }
      });
    });
  },

  create: async jsonObject => {

    const adressstring = jsonObject.street_number.toString() + ", " + jsonObject.zipcode.toString() + jsonObject.town.toString;
    let addressfound = await geocoder.geocode(adressstring, function (err, data) { });

    var notfound = null;
    if (addressfound < 1 || addressfound[0].streetNumber == null) {
      notfound = true;
    }
    
    return new Promise((resolve, reject) => {

      if(notfound){
        reject({"error": "Keine gültige Adressangabe"});
      }

      var hourlyrate = jsonObject.hourlyrate
      if(typeof hourlyrate == "string"){
        hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
        if(Number.isNaN(hourlyrate)){
          reject({"error": "Kein gültiger Stundensatz"});
        }
      }

      db.run(

        `INSERT INTO customers (customer_name, customer_company, customer_mail, customer_country, customer_zipcode, customer_town, customer_street_number, customer_hourlyrate) VALUES($name, $company, $mail, $country, $zipcode, $town, $street_number, $hourlyrate)`,
        {
          $name: jsonObject.name,
          $company: jsonObject.company,
          $mail: jsonObject.mail,
          $country: addressfound[0].country,
          $zipcode: addressfound[0].zipcode,
          $town: addressfound[0].city,
          $street_number: addressfound[0].streetName + " " + addressfound[0].streetNumber,
          $hourlyrate: hourlyrate.toFixed(2)
        },
        function (err) {
          if (err) {
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

    var notfound = null;
    if (addressfound < 1 || addressfound[0].streetNumber == null) {
      notfound = true;
    }

    return new Promise((resolve, reject) => {
      
      if(notfound){
        reject({"error": "Keine gültige Adressangabe"});
      }

      var hourlyrate = jsonObject.hourlyrate
      if(typeof hourlyrate == "string"){
        hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
        if(Number.isNaN(hourlyrate)){
          reject({"error": " Kein gültiger Stundensatz "});
        }
      }

      id = parseInt(id);
      db.run(

        `UPDATE customers SET customer_name = $name, customer_company = $company, customer_mail = $mail, customer_country = $country, customer_zipcode = $zipcode, customer_town = $town, customer_street_number = $street_number, customer_hourlyrate = $hourlyrate WHERE customer_id = $id`,
        {
          $name: jsonObject.name,
          $company: jsonObject.company,
          $mail: jsonObject.mail,
          $country: addressfound[0].country,
          $zipcode: addressfound[0].zipcode,
          $town: addressfound[0].city,
          $street_number: addressfound[0].streetName + " " + addressfound[0].streetNumber,
          $hourlyrate: hourlyrate.toFixed(2),
          $id: id
        },
        function (err) {
          if (err) {
            reject(err);
          }
          db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if(result == null){
                reject({"error": "Kunde nicht gefunden"})
              }
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
                  reject(err
                    );
                } else {
                  resolve();
                }
              });
          } else {
            reject({"error": "Kunde nicht gefunden"});
          }
        }
      });

    });
  },

  getAvgTraveldistance: id => {
    return  new Promise((resolve, reject) => {
      id = parseInt(id);
      db.get(`SELECT AVG(order_traveldistance) AS avg_traveldistance FROM orders WHERE order_customer = $id GROUP BY order_customer`, { $id: id }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAvgHourlyrate: id => {
    return  new Promise((resolve, reject) => {
      id = parseInt(id);
      db.get(`SELECT AVG(order_hourlyrate) AS avg_hourlyrate FROM orders WHERE order_customer = $id GROUP BY order_customer`, { $id: id }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAvgDuration: id => {
    return  new Promise((resolve, reject) => {
      id = parseInt(id);
      db.get(`SELECT AVG(order_duration) AS avg_duration FROM orders WHERE order_customer = $id GROUP BY order_customer`, { $id: id }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAvgOrderCost: id => {
    return  new Promise((resolve, reject) => {
      id = parseInt(id);
      db.get(`SELECT AVG(order_hourlyrate*order_duration) AS avg_ordercost FROM orders WHERE order_customer = $id GROUP BY order_customer`, { $id: id }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getOrderAmountMonth: (jsonObject) => {
    return  new Promise((resolve, reject) => {
      id = parseInt(jsonObject.id);
      db.all(`SELECT strftime('%m', order_starting) as month, strftime('%Y', order_starting) as year, COUNT(*) as anzahl FROM orders WHERE order_customer = $id AND Year = $year GROUP BY month`, { $id: id, $year: jsonObject.year }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

};