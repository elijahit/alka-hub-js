// Code: checkPremiumFeature - bin/functions/checkPremiumFeature.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file checkPremiumFeature.js
 * @module checkPremiumFeature
 * @description Contiene il metodo {checkPremiumFeature} e {checkPremiumLimitation}
 */

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
  let featurePremium = featureTable?.get({plain: true}).is_premium == 0 ?? false ? false : true
  if(featurePremium) {
    if(Variables.getPremium() == 1) return true;

    let guildTable = await findByGuildId(guildId);
    guildTable = guildTable?.get({plain: true}).premium == 1 ?? false ? true : false;
    return guildTable;

  } else {
    return true;
  }

}

/**
 * Ritorna Il numero di limite della presenza che può avere per funzionalità non premium torna -1 se è premium o se non ha limiti.
 * @param {string} guildId 
 * @param {integer} featureId 
 * @return {integer}
 */
async function checkPremiumLimitation(guildId, featureId) {
  let featureTable = await findFeatureById(featureId);
  let featurePremium = featureTable?.get({plain: true}).is_premium == 0 ?? true ? false : true
  if(!featurePremium){
    let guildTable = await findByGuildId(guildId);
    guildTable = guildTable?.get({plain: true}).premium == 1 ?? false ? true : false;
    if(guildTable) return -1;
    let featurePremiumLimitation = featureTable?.get({plain: true}).premium_limitation ?? -1;
    return featurePremiumLimitation;
  }
  return -1;
}

module.exports = {checkPremiumFeature, checkPremiumLimitation};