const {readDb} = require('../bin/database');

let sqlConfigGuilds = `SELECT * FROM guilds WHERE guilds_id = ?`;

async function databaseCheck (guilds) {
  try {
    const result = await readDb(sqlConfigGuilds, guilds);
    return result.language;
  } catch {
    return "EN"
  }
}

module.exports = {
  databaseCheck
}