const db = require('./database_new_init.js');
const date = require('date-and-time');
var bcrypt = require('bcryptjs');

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM users`, (err, result) => {
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
      db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findPasswordByMail: mail => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT user_password FROM users WHERE user_mail = $mail`, {$mail: mail}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(result);
          if(result == null){
              resolve(null);
          }else{
            resolve(result.user_password);
          }    
        }
      });
    });
  },

  create: jsonObject => {

    var password = bcrypt.hashSync(jsonObject.password, 8);

    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO users (user_name, user_mail, user_password) VALUES ($name, $mail, $password)`, 
        {
          $name: jsonObject.name,
          $mail: jsonObject.mail,
          $password: password
        },
        function (err) {
          if (err) {
            return reject(err);            
          }        
          db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: this.lastID}, (err, result) => {
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

    var password = bcrypt.hashSync(jsonObject.password, 8);

    return new Promise((resolve, reject) => {
        id = parseInt(id);
        
        db.run(
            
          `UPDATE orders SET user_name = $name, user_mail = $mail, user_password = $password WHERE user_id = $id`, 
          {
            $title: jsonObject.title,
            $customer: jsonObject.customer,
            $description: jsonObject.description,
            $starting: jsonObject.starting,
            $ending: jsonObject.ending,
            $hourlyrate: hourlyrate,
            $traveldistance: jsonObject.traveldistance,
            $id: id
          },
          function (err) {
            if (err) {
              return reject(err);
            }
            db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
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
        db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result != null){
                db.run(          
                    `DELETE FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
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