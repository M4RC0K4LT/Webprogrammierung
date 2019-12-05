const db = require('./database_new_init.js');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
var JWT_KEY = process.env.TOKEN;

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

  login: (mail, password) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT user_id, user_password FROM users WHERE user_mail = $mail`, {$mail: mail}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if(result == null){
              resolve(null);
          }else{
            var correct = bcrypt.compareSync(password, result.user_password);
            if (correct == true) {
              userid = result.user_id;
              const token = jwt.sign(userid, JWT_KEY);

              db.run(
          
                `UPDATE users SET user_tokens = $token WHERE user_id = $id`, 
                {
                  $token: token,
                  $id: userid
                },
                function (err) {
                  if (err) {
                    return reject(err);
                  }
                  resolve({"login": "successfull", "token": token, "userid": userid});
                }
              );

            } else {
              resolve("password wrong");
            }
          }    
        }
      });
    });
  },

  logout: token => {
    jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
          return (err);
      }

      const user = await module.exports.findById(parseInt(userid));
      if(user.user_tokens != token){
          return response.send("Falscher Token für deinen Benutzer!")
      }
      
    });
    return new Promise((resolve, reject) => {          
      db.run(         
        `UPDATE users SET user_tokens = null WHERE user_id = $id`, 
        {
          $id: userid
        },
        function (err) {
          if (err) {
            return reject(err);

          }
          return resolve("Erfolgreich ausgelogt!");
        }
      )
    });
  },

  create: jsonObject => {
    var password = bcrypt.hashSync(jsonObject.password, 8);
    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO users (user_name, user_mail, user_password, user_tokens) VALUES ($name, $mail, $password, $token)`, 
        {
          $name: jsonObject.name,
          $mail: jsonObject.mail,
          $token: jsonObject.token,
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
            
          `UPDATE users SET user_name = $name, user_mail = $mail, user_password = $password, user_tokens = $token WHERE user_id = $id`, 
          {
            $name: jsonObject.name,
            $mail: jsonObject.mail,
            $password: jsonObject.password,
            $token: jsonObject.token,
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