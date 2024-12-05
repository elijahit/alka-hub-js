const {getFeatureIsEnabled} = require('../service/DatabaseService');


/**
 * Ritorna {true} se la feature è abilitata
 * @param {string} guildId 
 * @param {integer} featureId 
 * @return {boolean}
 */
const checkFeaturesIsEnabled = async (guildId, featureId) => {
  let featureIsEnabled = await getFeatureIsEnabled(guildId, featureId);
  if(!featureIsEnabled) return false; 
  featureIsEnabled = featureIsEnabled?.get({plain: true}).guilds[0].GuildEnabledFeatures.is_enabled ?? false;
  if(featureIsEnabled == 1) return true;
  if(featureIsEnabled == 0) return false;
}

module.exports = checkFeaturesIsEnabled;