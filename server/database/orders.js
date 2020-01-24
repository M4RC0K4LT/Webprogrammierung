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
          if(result == null){
            reject({"error": "Auftrag nicht gefunden"})
          }
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
          if(result.length<1){
            reject({"error": "Zum ausgewählten Kunden sind keine Aufträge vorhanden"})
          }
          resolve(result);
        }
      });
    });
  },

  create: async jsonObject => {
    
    //Überprüfung des Datumformats
    var datevalid = null;
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        datevalid = false;
    }

    //Überprüfung Kilometer
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

    //Überprüfung der Dauer
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
    
    //Überprüfung ob Standardstundensatz abgeändert
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
        reject({"error": "Verwende ein gültiges Zeitformat"});
      }
      if(travelvalid == false){
        reject({"error": "Keine gültige Fahrtstrecke"});
      }
      if(durationvalid == false){
        reject({"error": "Keine gültige Auftragsdauer"});
      }

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
    var datevalid = null;
    if(!(date.isValid(jsonObject.starting.toString(), "YYYY-MM-DD HH:mm"))){
        datevalid = false;
    }

    //Überprüfung Kilometer
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

    //Überprüfung der Dauer
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
    
    //Überprüfung ob Standardstundensatz abgeändert
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
          reject({"error": "Verwende ein gültiges Zeitformat"});
        }
        if(travelvalid == false){
          reject({"error": "Keine gültige Fahrtsrecke"});
        }
        if(durationvalid == false){
          reject({"error": "Keine gültige Auftragsdauer"});
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
  }
};