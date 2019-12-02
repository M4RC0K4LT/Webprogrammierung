const db = require('./database_init');

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM books`, (err, result) => {
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
      db.get(`SELECT * FROM books WHERE id = $id`, {$id: id}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  create: jsonObject => {
    return new Promise((resolve, reject) => {
      db.run(

        `INSERT INTO books (author, title, year, pageCount) VALUES($author, $title, $year, $pageCount)`, 
        {
          $author: jsonObject.author,
          $title: jsonObject.title,
          $year: jsonObject.year,
          $pageCount: jsonObject.pageCount
        },
        function (err) {
          if (err) {
            return reject(err);
          }
          db.get(`SELECT * FROM books WHERE id = $id`, {$id: this.lastID}, (err2, result) => {
            if (err2) {
              reject(err2);
            } else {
              resolve(result);
            }
          });
        }
      )
    });

  },

  update: (id, jsonObject) => {  
    return new Promise((resolve, reject) => {
        id = parseInt(id);
        db.run(
            
          `UPDATE books SET author = $author, title = $title, year = $year, pageCount = $pageCount WHERE id = $id`, 
          {
            $author: jsonObject.author,
            $title: jsonObject.title,
            $year: jsonObject.year,
            $pageCount: jsonObject.pageCount,
            $id: id
          },
          function (err) {
            if (err) {
              return reject(err);
            }
            db.get(`SELECT * FROM books WHERE id = $id`, {$id: id}, (err, result) => {
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
        db.get(`SELECT * FROM books WHERE id = $id`, {$id: id}, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result != null){
                db.run(          
                    `DELETE FROM books WHERE id = $id`, {$id: id}, (err, result) => {
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