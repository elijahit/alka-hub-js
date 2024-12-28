// Code: checkFeatureSystemDisabled - bin/functions/checkFeatureSystemDisabled.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file checkFeatureSystemDisabled.js
 * @module checkFeatureSystemDisabled
 * @description Contiene il metodo {checkFeatureSystemDisabled}
 */

const {findFeatureById} = require('../service/DatabaseService');


/**
 * Ritorna {true} se la feature è abilitata da sistema
 * @param {integer} featureId 
 * @return {boolean}
 */
const checkFeatureSystemDisabled = async (featureId) => {
  let featureTable = await findFeatureById(featureId);
	let featureIsDisabled = featureTable?.get({ plain: true }).is_disabled ?? 0;
  if(featureIsDisabled == 1) return false; 
  if(featureIsDisabled == 0) return true;
}

module.exports = {checkFeatureSystemDisabled};