const { readDb } = require('../../bin/database');

const checkFeaturesIsEnabled = async (guild, features) => {
  const sqlChecker = await readDb(`SELECT ${features} from guilds_features WHERE guilds_id = ?`, guild.id);
  if(!sqlChecker) return false;
  if(sqlChecker[features] == 1) return true;
  if(sqlChecker[features] == 0) return false;
}

module.exports = checkFeaturesIsEnabled;