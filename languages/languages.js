const {readDb} = require('../bin/database');

let sqlConfigGuilds = `SELECT * FROM guilds_config WHERE guildId = ?`;

async function databaseCheck (guilds) {
  const result = await readDb(sqlConfigGuilds, guilds);
  return result.languages;
}

module.exports = {
  databaseCheck
}