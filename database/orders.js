const db = require('./database_new_init.js');
const date = require('date-and-time');

module.exports = {
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

  findById: id => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM orders WHERE order_id = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findByCustomer: id => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM orders WHERE order_customer = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  create: async jsonObject => {
    
    //Überprüfung des Datumformats
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        return({error: `Use correct date and time format!`});
    }

    var traveldistance = jsonObject.traveldistance;
    if(traveldistance.length==0){
      traveldistance = null;
    }

    //Überprüfung ob Standardstundensatz abgeändert
    var hourlyrate = jsonObject.hourlyrate;
    console.log(hourlyrate)
    if(hourlyrate.length==0){
      console.log("hier1")
      await new Promise((resolve, reject) => {
        db.get(`SELECT customer_hourlyrate FROM customers WHERE customer_id = $id`, { $id: jsonObject.customer }, (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            console.log("hier2")
            hourlyrate = result.customer_hourlyrate;
            resolve(result);
          }
        });
      })
      
    }

    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO orders (order_title, order_customer, order_description, order_starting, order_duration, order_hourlyrate, order_traveldistance) VALUES ($title, $customer, $description, $starting, $duration, $hourlyrate, $traveldistance)`, 
        {
          $title: jsonObject.title,
          $customer: jsonObject.customer,
          $description: jsonObject.description,
          $starting: jsonObject.starting,
          $duration: jsonObject.duration,
          $hourlyrate: hourlyrate,
          $traveldistance: traveldistance
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

  update: async (id, jsonObject) => {  

    //Überprüfung des Datumformats
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        console.log("fdsg")
        return({"request": "failed", "error": `Use correct date and time format!`});
    }

    //Überprüfung ob Standardstundensatz abgeändert
    hourlyrate = jsonObject.hourlyrate;
    if(hourlyrate == null){
      const gethour = await new Promise((resolve, reject) => {
        db.get(`SELECT customer_hourlyrate FROM customers WHERE customer_id = $id`, { $id: jsonObject.customer }, (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(hourlyrate = result.customer_hourlyrate);
          }
        });
      })
    }

    return new Promise((resolve, reject) => {
        id = parseInt(id);
        
        db.run(
            
          `UPDATE orders SET order_title = $title, order_customer = $customer, order_description = $description, order_starting = $starting, order_duration = $duration, order_hourlyrate = $hourlyrate, order_traveldistance = $traveldistance WHERE order_id = $id`, 
          {
            $title: jsonObject.title,
            $customer: jsonObject.customer,
            $description: jsonObject.description,
            $starting: jsonObject.starting,
            $duration: jsonObject.duration,
            $hourlyrate: hourlyrate,
            $traveldistance: jsonObject.traveldistance,
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
                  resolve(result);
              }
            }
          });
        
    });
  }
};