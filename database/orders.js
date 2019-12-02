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

  create: jsonObject => {
    
    //Überprüfung des Datumformats
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm:ss") && date.isValid(jsonObject.ending.toString(), "YYYY-MM-DD HH:mm:ss"))){
        return({error: `Use correct date and time format!`});
    }

    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO orders (order_title, order_customer, order_description, order_starting, order_ending) VALUES ($title, $customer, $description, $starting, $ending)`, 
        {
          $title: jsonObject.title,
          $customer: jsonObject.customer,
          $description: jsonObject.description,
          $starting: jsonObject.starting,
          $ending: jsonObject.ending
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

  update: (id, jsonObject) => {  

    //Überprüfung des Datumformats
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm:ss") && date.isValid(jsonObject.ending.toString(), "YYYY-MM-DD HH:mm:ss"))){
        return({error: `Use correct date and time format!`});
    }

    return new Promise((resolve, reject) => {
        id = parseInt(id);
        db.run(
            
          `UPDATE orders SET order_title = $title, order_customer = $customer, order_description = $description, order_starting = $starting, order_ending = $ending WHERE order_id = $id`, 
          {
            $title: jsonObject.title,
            $customer: jsonObject.customer,
            $description: jsonObject.description,
            $starting: jsonObject.starting,
            $ending: jsonObject.ending,
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