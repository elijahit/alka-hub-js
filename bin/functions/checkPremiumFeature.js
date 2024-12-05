const Variables = require("../classes/GlobalVariables");
const { findByGuildId } = require("../repository/Guild");
const { findFeatureById } = require("../service/DatabaseService");

/**
 * Ritorna {true} se la feature può essere utilizzata
 * @param {string} guildId 
 * @param {integer} featureId 
 * @return {boolean}
 */
async function checkPremiumFeature(guildId, featureId) {
  let featureTable = await findFeatureById(featureId);
  let featurePremium = featureTable?.get({plain: true}).is_premium == 0 ?? true ? false : true
  if(featurePremium) {
    if(Variables.getPremium() == 1) return true;

    let guildTable = await findByGuildId(guildId);
    guildTable = guildTable?.get({plain: true}).premium == 1 ?? true ? true : false;
    return guildTable;

  } else {
    return true;
  }

}

module.exports = {checkPremiumFeature};