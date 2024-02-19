const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bin/database.db', error => {
  setTimeout(() => {
    if(error) {
      return console.error(error.message);
    }
    console.log('[SUCCESS] Connessione eseguita in-memory SQlite database.');
  }, 1000);
});

function getValueDatabase (sqlquery, guildId, fn) {
  db.get(sqlquery, [guildId], (_, result_Db) => {
    fn(result_Db);
  });
};

function addValueDatabase (sqlquery, ...value) {
  db.run(sqlquery, value, function(err) {
    // get the last insert id

  });
}

module.exports = {
  db,
  getValueDatabase,
  addValueDatabase,
};