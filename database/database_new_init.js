const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const dbExist = fs.existsSync('./.data/customer_kugellager_database.db');
const db = new sqlite.Database('./.data/customer_kugellager_database.db');

if (!dbExist) {

  // Aktiviere ForeignKeys
  db.run(`PRAGMA foreign_keys = ON`);

  // Kundentabelle
  db.run(`
    CREATE TABLE 'customers' (
      customer_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      customer_name TEXT,
      customer_company TEXT,
      customer_mail TEXT, 
      customer_country TEXT,
      customer_zipcode TEXT,
      customer_town TEXT,
      customer_street_number TEXT,
      customer_hourlyrate REAL
    )
  `);

  // Auftragstabelle
  db.run(`
    CREATE TABLE 'orders' (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      order_title TEXT,
      order_description TEXT, 
      order_starting DATETIME, 
      order_ending DATETIME,
      order_hourlyrate REAL,
      order_traveldistance REAL,
      order_customer INTEGER,
      FOREIGN KEY(order_customer) REFERENCES 'customers'(customer_id)
    )
  `);
}

// Aktiviere ForeignKeys
db.run(`PRAGMA foreign_keys = ON`);

module.exports = db;