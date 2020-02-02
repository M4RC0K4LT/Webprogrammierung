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

  findByMail: mail => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE user_mail = $mail`, {$mail: mail}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findByName: username => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE user_name = $username`, {$username: username}, (err, result) => {
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

  findByToken: token => {
    return jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
        return ({"request": "failed", "error": err.message});
      }
      user = await module.exports.findById(parseInt(userid));
      if(user == null || user.user_tokens != token){
        return ({"request": "failed", "error": "Kein gültiger UserToken"})
      }  
      return ({"request": "successful", "user_id": user.user_id, "user_name": user.user_name, "user_mail": user.user_mail, "user_password": user.user_password}); 
    });
    
     
  },

  login: (mail, password) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT user_id, user_password FROM users WHERE user_mail = $mail`, {$mail: mail}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          if(result == null){
              reject({"error": "Ungültige Eingaben"});
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
                  resolve({"token": token, "userid": userid});
                }
              );

            } else {
              reject({"error": "Ungültige Eingaben"});
            }
          }    
        }
      });
    });
  },

  checkSessionToken: token => {
    var tokenverify = true;
    var tokenvalid = true;
    jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
          return false;
      }

      const user = await module.exports.findById(parseInt(userid));
      if(user.user_tokens != token){
          return false;
      }
      else {
        return true;
      }
    });
  },

  logout: token => {
    var tokenverify = true;
    var tokenvalid = true;
    jwt.verify(token, JWT_KEY, async (err, userid) => {
      if(err){
          tokenverify = false;
      }

      const user = await module.exports.findById(parseInt(userid));
      if(user.user_tokens != token){
          tokenvalid = false;
      }
      
    });
    return new Promise((resolve, reject) => {  
      if(tokenverify == false){
        reject({"error": "Fehler bei der Tokenverifizierung"})
      }      
      if(tokenvalid == false){
        reject({"error": "Falscher Token für Benutzer oder nicht angemeldet!"})
      }  
      db.run(         
        `UPDATE users SET user_tokens = null WHERE user_id = $id`, 
        {
          $id: userid
        },
        function (err) {
          if (err) {
            reject(err);

          }
          resolve();
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
            reject(err);            
          }        
          db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: this.lastID}, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if(result == null){
                reject({"error": "Fehler bei der Erstellung"})
              }
              resolve({"user_name": result.user_name, "user_mail": result.user_mail});
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
            
          `UPDATE users SET user_name = $name, user_mail = $mail, user_password = $password WHERE user_id = $id`, 
          {
            $name: jsonObject.name,
            $mail: jsonObject.mail,
            $password: password,
            $token: jsonObject.token,
            $id: id
          },
          function (err) {
            if (err) {
              reject({"error": err.message});
            }
            db.get(`SELECT * FROM users WHERE user_id = $id`, {$id: id}, (err, result) => {
              if (err) {
                reject({"error": err.message});
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
              reject({"error": err.message});
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
                  reject({"error": "Kein gültiger User"});
              }
            }
          });      
    });
  }
};