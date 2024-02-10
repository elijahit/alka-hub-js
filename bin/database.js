const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bin/database.db', error => {
  setTimeout(() => {
    if(error) {
      return console.error(error.message);
    }
    console.log('[SUCCESS] Connessione eseguita in-memory SQlite database.');
  }, 1000);
});

module.exports = {
  db
};