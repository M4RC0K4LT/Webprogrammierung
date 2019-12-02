const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const dbExist = fs.existsSync('./.data/sqlite.db');
const db = new sqlite.Database('./.data/sqlite.db');

if (!dbExist) {
  db.run(`
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      author TEXT, 
      title TEXT, 
      year INTEGER,
      pageCount INTEGER
    )
  `);
}

module.exports = db;