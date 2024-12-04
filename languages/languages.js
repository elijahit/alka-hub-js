const {readDb} = require('../bin/database');
const { findGuildById } = require('../bin/service/DatabaseService');

async function databaseCheck (guildId) {
  try {
    let result = await findGuildById(guildId);
    if(!result) return "EN";
    
    return result.get({plain: true}).language;
  } catch {
    return "EN"
  }
}

module.exports = {
  databaseCheck
}