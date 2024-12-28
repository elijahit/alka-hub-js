// Code: checkFeaturesIsEnabled - bin/functions/checkFeaturesIsEnabled.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file checkFeaturesIsEnabled.js
 * @module checkFeaturesIsEnabled
 * @description Contiene il metodo {checkFeaturesIsEnabled}
 */

const {getFeatureIsEnabled, findByGuildIdAndFeatureIdFeature} = require('../service/DatabaseService');


/**
 * Ritorna {true} se la feature è abilitata
 * @param {string} guildId 
 * @param {integer} featureId 
 * @return {boolean}
 */
const checkFeaturesIsEnabled = async (guildId, featureId) => {
  let featureIsEnabled = await findByGuildIdAndFeatureIdFeature(guildId, featureId);
  if(!featureIsEnabled) return false; 
  featureIsEnabled = featureIsEnabled?.get({plain: true});
  if(featureIsEnabled?.is_enabled == 1) return true;
  if(featureIsEnabled?.is_enabled == 0 || featureIsEnabled?.is_enabled == undefined) return false;
}

module.exports = checkFeaturesIsEnabled;