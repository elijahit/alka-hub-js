const { readDb } = require('../../bin/database');

const checkFeaturesIsEnabled = async (guild, features) => {
  const sqlChecker = await readDb(`SELECT is_enabled from guild_enabled_features WHERE guilds_id = ? AND feature_id = ?`, guild.id, features);
  if(!sqlChecker) return false;
  if(sqlChecker.is_enabled == 1) return true;
  if(sqlChecker.is_enabled == 0) return false;
}

module.exports = checkFeaturesIsEnabled;