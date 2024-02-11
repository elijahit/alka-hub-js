const database = require('../bin/database');

let sqlConfigGuilds = `SELECT * FROM guilds_config WHERE guildId = ?`;

function databaseCheck (guilds) {
  return new Promise((resolve, reject) => {
    database.db.get(sqlConfigGuilds, [guilds], (err, result) => {
      if (err) reject(err);
      resolve(result.languages);
    });
  })
}

module.exports = {
  databaseCheck
}