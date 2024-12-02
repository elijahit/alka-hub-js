const { readDb } = require('../../bin/database');
const {checkFeatureEnabled} = require('../service/DatabaseService');

const checkFeaturesIsEnabled = async (guild, features) => {
  let featureIsEnabled = await checkFeatureEnabled(guild, features);
  featureIsEnabled = featureIsEnabled.get({plain: true}).guilds[0].GuildEnabledFeatures.is_enabled;
  if(featureIsEnabled == 1) return true;
  if(featureIsEnabled == 0) return false;
}

console.log(checkFeaturesIsEnabled("312", 1).then(v => console.log(v)));

module.exports = checkFeaturesIsEnabled;