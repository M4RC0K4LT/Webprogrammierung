/**
 * A module for SQLite database initialisation/creation.
 * @module database/database_new_init
 */


/** Import NPM-Modules to create/interact with SQLite Database */
const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const dbExist = fs.existsSync('./.data/customer_kugellager_database.db');
const db = new sqlite.Database('./.data/customer_kugellager_database.db');

if (!dbExist) {

  //Activate ForeignKeya
  db.run(`PRAGMA foreign_keys = ON`);

  //Create table "customers"
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

  //Create table "orders"
  db.run(`
    CREATE TABLE 'orders' (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      order_title TEXT,
      order_description TEXT, 
      order_starting DATETIME, 
      order_duration REAL,
      order_hourlyrate REAL,
      order_traveldistance REAL,
      order_customer INTEGER,
      order_user INTEGER,
      FOREIGN KEY (order_customer) REFERENCES 'customers'(customer_id),
      FOREIGN KEY (order_user) REFERENCES 'users'(user_id)
    )
  `);

  //Create table "users"
  db.run(`
    CREATE TABLE 'users' (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      user_name TEXT,
      user_mail TEXT, 
      user_password TEXT, 
      user_tokens TEXT
    )
  `);
}

//Activate ForeignKeys on existing database
db.run(`PRAGMA foreign_keys = ON`);

/**
 * SQLite Database interaction.
 */
module.exports = db;