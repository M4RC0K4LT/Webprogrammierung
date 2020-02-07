/**
 * A module that interacts with SQLite Database on transactions regarding customerdata.
 * @module database/customers
 */


 /** Import Database */
const db = require('./database_new_init.js');

/** Import and configure NodeGeocoder-NPMModule to work with adressinformation and validate them */
const NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  apiKey: 'YourAPIKey'
};
var geocoder = NodeGeocoder(options);


module.exports = {


  /**
   * Return all customers.
   * @return {Array} Full of single "CustomerJSONS".
   */
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


  /**
   * Return customer by ID.
   * @param {string} cusid - Searched CustomerID.
   * @return {JSON} Customerdata.
   */
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


  /**
   * Create new customer.
   * @return {JSON} Customer information.
   */
  create: async jsonObject => {

    //Check address input with GoogleMapsAPI
    const adressstring = jsonObject.street_number.toString() + ", " + jsonObject.zipcode.toString();
    let addressfound = await geocoder.geocode(adressstring, function (err, data) { });
    var notfound = null;
    if (addressfound < 1 || addressfound[0].streetNumber == null) {
      notfound = true;
    }
    
    return new Promise((resolve, reject) => {

      if(notfound){
        return reject({"error": "Keine gültige Adressangabe"});
      }

      //Check hourlyrate format
      var hourlyrate = jsonObject.hourlyrate
      if(typeof hourlyrate == "string"){
        hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
        if(Number.isNaN(hourlyrate)){
          return reject({"error": "Kein gültiger Stundensatz"});
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
            return reject(err);
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


  /**
   * Update existing customer.
   * @param {string} id - Selected customer.
   * @param {JSON} jsonObject - Updated customer data.
   * @return {JSON} Updated customer values.
   */
  update: async (id, jsonObject) => {

    //Check address input with GoogleMapsAPI
    const adressstring = jsonObject.street_number.toString() + ", " + jsonObject.zipcode.toString();
    let addressfound = await geocoder.geocode(adressstring, function (err, data) { });
    var notfound = null;
    if (addressfound < 1 || addressfound[0].streetNumber == null) {
      notfound = true;
    }

    return new Promise((resolve, reject) => {
      
      if(notfound){
        return reject({"error": "Keine gültige Adressangabe"});
      }

      //Check hourlyrate format
      var hourlyrate = jsonObject.hourlyrate
      if(typeof hourlyrate == "string"){
        hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
        if(Number.isNaN(hourlyrate)){
          return reject({"error": " Kein gültiger Stundensatz "});
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
            return reject(err);
          }
          db.get(`SELECT * FROM customers WHERE customer_id = $id`, { $id: id }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if(result == null){
                return reject({"error": "Kunde nicht gefunden"})
              }
              resolve(result);
            }
          });
        }
      )
    });
  },


  /**
   * Remove Customer by CustomerID.
   * @param {string} id - Selected Customer.
   * @return {Boolean} successful - yes or no.
   */
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


  /**
   * Get customer`s average traveldistance.
   * @param {string} id - Selected CustomerID.
   * @return {JSON} Average Traveldistance.
   */
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


  /**
   * Get customer`s average hourlyrate because order specific hourlyrates could be different.
   * @param {string} id - Selected CustomerID.
   * @return {JSON} Average Hourlyrate.
   */
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


  /**
   * Get customer`s average order duration.
   * @param {string} id - Selected CustomerID.
   * @return {JSON} Average Duration.
   */
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


  /**
   * Get customer`s average OrderCosts based on hourlyrate * duration.
   * @param {string} id - Selected CustomerID.
   * @return {JSON} Average OrderCosts.
   */
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


  /**
   * Get customer`s monthly amount of orders.
   * @param {JSON} jsonObject - CustomerID and selected Year.
   * @return {JSON} Monthly Order Amount for selected year.
   */
  getOrderAmountMonth: (jsonObject) => {
    return  new Promise((resolve, reject) => {
      id = parseInt(jsonObject.id);
      db.all(`SELECT strftime('%m', order_starting) as month, COUNT(*) as anzahl FROM orders WHERE order_customer = $id AND strftime('%Y', order_starting) = $year GROUP BY month`, { $id: id, $year: jsonObject.year }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

};