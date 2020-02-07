/**
 * A module that interacts with SQLite Database on transactions regarding orderdata.
 * @module database/orders
 */


/** Import Database */
const db = require('./database_new_init.js');

/** Import NPM Modules to work correctly with date and time formats as well as User Tokens */
const date = require('date-and-time');
const jwt = require('jsonwebtoken')
var JWT_KEY = process.env.TOKEN;

module.exports = {


  /**
   * Return all orders.
   * @return {Array} Full of single "OrderJSONs".
   */
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM orders`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },


  /**
   * Return order by ID.
   * @param {string} id - Searched OrderID.
   * @return {JSON} Orderdata.
   */
  findById: id => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM orders WHERE order_id = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if(result == null){
            reject({"error": "Auftrag nicht gefunden"})
          }
          resolve(result);
        }
      });
    });
  },


  /**
   * Return all orders related to CustomerID.
   * @param {string} id - Selected Customer.
   * @return {Array} Full of single OrderJSONs.
   */
  findByCustomer: id => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM orders WHERE order_customer = $id`, {$id: id}, (err, result) => {
        if (err) {         
          reject(err);
        } else {
          if(result.length<1){
            reject({"error": "Zum ausgewählten Kunden sind keine Aufträge vorhanden"})
          }
          resolve(result);
        }
      });
    });
  },


  /**
   * Create new order.
   * @return {JSON} Order information.
   */
  create: async (jsonObject, token) => {  

    //Check date format
    var datevalid = null;
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        datevalid = false;
    }

    //Add current UserToken
    let user_id = null;
    let userinvalid = false;
    jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
          userinvalid = true;
      }
      else {
        user_id = userid
      }
    })

    //check distance format
    var travelvalid = null;
    var traveldistance = jsonObject.traveldistance;
    if(traveldistance == null || traveldistance.length==0){
      traveldistance = null;
    }else {
      if(typeof traveldistance == "string"){
        traveldistance = parseFloat(jsonObject.traveldistance.replace(",", "."));
        if(Number.isNaN(traveldistance)){
          travelvalid = false;
        }else {
          traveldistance = traveldistance.toFixed(2)
        }
      }else {
        traveldistance = traveldistance.toFixed(2)
      }
      
    }

    //Check duration
    var durationvalid = null;
    var duration = jsonObject.duration;
    if(typeof duration == "string"){
      duration = parseFloat(jsonObject.duration.replace(",", "."));
      if(Number.isNaN(duration)){
        durationvalid = false;
      }else {
        duration = duration.toFixed(2)
      }
    }else {
      duration = duration.toFixed(2);
    }
    
    //Check if order-specific hourlyrate was given
    var hourlyrate = jsonObject.hourlyrate;
    await new Promise((resolve, reject) => {
      db.get(`SELECT customer_hourlyrate FROM customers WHERE customer_id = $id`, { $id: jsonObject.customer }, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          if(result == null){
            reject({"error": "Kunde nicht vorhanden"})
          }else {
            if(hourlyrate == null || hourlyrate.length<1){
              hourlyrate = result.customer_hourlyrate
            } else {
              if(typeof hourlyrate == "string"){
                hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
                if(Number.isNaN(hourlyrate)){
                  reject({"error": "Kein gültiger Stundensatz"});
                }
              }
              hourlyrate = hourlyrate.toFixed(2)
            }
          }
          resolve(result);
        }
      });
    })

    return new Promise((resolve, reject) => {
      if(datevalid == false){
        return reject({"error": "Verwende ein gültiges Zeitformat"});
      }
      if(travelvalid == false){
        return reject({"error": "Keine gültige Fahrtstrecke"});
      }
      if(durationvalid == false){
        return reject({"error": "Keine gültige Auftragsdauer"});
      }
      if(userinvalid == true){
        return reject({"error": "Fehler beim UserToken"});
      }

      db.run(

        `INSERT INTO orders (order_title, order_customer, order_description, order_starting, order_duration, order_hourlyrate, order_traveldistance, order_user) VALUES ($title, $customer, $description, $starting, $duration, $hourlyrate, $traveldistance, $user)`, 
        {
          $title: jsonObject.title,
          $customer: jsonObject.customer,
          $description: jsonObject.description,
          $starting: jsonObject.starting,
          $duration: jsonObject.duration,
          $hourlyrate: hourlyrate,
          $traveldistance: traveldistance,
          $user: user_id
        },
        function (err) {
          if (err) {
            return reject(err);            
          }        
          db.get(`SELECT * FROM orders WHERE order_id = $id`, {$id: this.lastID}, (err, result) => {
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
   * Update existing order.
   * @param {string} id - Selected order.
   * @param {JSON} jsonObject - Updated order data.
   * @return {JSON} Updated order values.
   */
  update: async (id, jsonObject) => {  

    //Check date format
    var datevalid = null;
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        datevalid = false;
    }

    //Check distance format
    var travelvalid = null;
    var traveldistance = jsonObject.traveldistance;
    if(traveldistance == null || traveldistance.length==0){
      traveldistance = null;
    }else {
      if(typeof traveldistance == "string"){
        traveldistance = parseFloat(jsonObject.traveldistance.replace(",", "."));
        if(Number.isNaN(traveldistance)){
          travelvalid = false;
        }else {
          traveldistance = traveldistance.toFixed(2)
        }
      }else {
        traveldistance = traveldistance.toFixed(2)
      }
      
    }

    //Check duration
    var durationvalid = null;
    var duration = jsonObject.duration;
    if(typeof duration == "string"){
      duration = parseFloat(jsonObject.duration.replace(",", "."));
      if(Number.isNaN(duration)){
        durationvalid = false;
      }else {
        duration = duration.toFixed(2)
      }
    }else {
      duration = duration.toFixed(2);
    }
    
    //Check if order-specific hourlyrate was given
    var hourlyrate = jsonObject.hourlyrate;
    await new Promise((resolve, reject) => {
      db.get(`SELECT customer_hourlyrate FROM customers WHERE customer_id = $id`, { $id: jsonObject.customer }, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          if(result == null){
            reject({"error": "Kunde nicht vorhanden"})
          }else {
            if(hourlyrate.length<1){
              hourlyrate = result.customer_hourlyrate
            } else {
              if(typeof hourlyrate == "string"){
                hourlyrate = parseFloat(jsonObject.hourlyrate.replace(",", "."));
                if(Number.isNaN(hourlyrate)){
                  reject({"error": "Kein gültiger Stundensatz"});
                }
              }
              hourlyrate = hourlyrate.toFixed(2)
            }
          }
          resolve(result);
        }
      });
    })

    return new Promise((resolve, reject) => {
        id = parseInt(id);
        if(datevalid == false){
          return reject({"error": "Verwende ein gültiges Zeitformat"});
        }
        if(travelvalid == false){
          return reject({"error": "Keine gültige Fahrtsrecke"});
        }
        if(durationvalid == false){
          return reject({"error": "Keine gültige Auftragsdauer"});
        }
        
        db.run(
            
          `UPDATE orders SET order_title = $title, order_customer = $customer, order_description = $description, order_starting = $starting, order_duration = $duration, order_hourlyrate = $hourlyrate, order_traveldistance = $traveldistance WHERE order_id = $id`, 
          {
            $title: jsonObject.title,
            $customer: jsonObject.customer,
            $description: jsonObject.description,
            $starting: jsonObject.starting,
            $duration: jsonObject.duration,
            $hourlyrate: hourlyrate,
            $traveldistance: traveldistance,
            $id: id
          },
          function (err) {
            if (err) {
              return reject(err);
            }
            db.get(`SELECT * FROM orders WHERE order_id = $id`, {$id: id}, (err, result) => {
              if (err) {
                reject(err);
              } else {
                if(result == null){
                  reject({"error": "Auftrag konnte nicht gefunden werden"})
                }
                resolve(result);
              }
            });
          }
        )
    });
  },


  /**
   * Remove order by OrderID.
   * @param {string} id - Selected Order.
   * @return {Boolean} successful - yes or no.
   */
  remove: id => {
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        db.get(`SELECT * FROM orders WHERE order_id = $id`, {$id: id}, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result != null){
                db.run(          
                    `DELETE FROM orders WHERE order_id = $id`, {$id: id}, (err, result) => {
                      if (err) {
                        reject(false);
                      } else {
                        resolve(true);
                      }
                });
              } else{
                  reject({"error": "Auftrag nicht vorhanden"});
              }
            }
          });
        
    });
  },


  /**
   * Return all orders created/done by selected user.
   * @return {Array} Full of single "OrderJSONs".
   */
  findOrdersByUser: (token, id) => {

    //Add current UserToken
    let user_id = null;
    let userinvalid = false;
    jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
          userinvalid = true;
      }
      else {
        user_id = userid
      }
    })

    if(id != null){
      user_id = id
    }

    return new Promise((resolve, reject) => {
      if(userinvalid){
        reject({"error": "Fehler beim UserToken"})
      }
      db.all(`SELECT * FROM orders WHERE order_user = $userid ORDER BY order_starting`, {$userid: user_id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },


  /**
   * Get monthly amount of orders by year.
   * @param {string} year - Selected Year.
   * @return {JSON} Monthly Order Amount for selected year.
   */
  getMonthlyAmountOfOrders: (year) => {
    return  new Promise((resolve, reject) => {
      db.all(`SELECT strftime('%m', order_starting) as month, COUNT(*) as anzahl FROM orders WHERE strftime('%Y', order_starting) = $year GROUP BY month`, { $year: year }, (err, result) =>{
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};