const {findFeatureById} = require('../service/DatabaseService');


/**
 * Ritorna {true} se la feature è abilitata da sistema
 * @param {integer} featureId 
 * @return {boolean}
 */
const checkFeatureSystemDisabled = async (featureId) => {
  let featureTable = await findFeatureById(featureId);
	let featureIsDisabled = featureTable?.get({ plain: true }).is_disabled ?? 1;
  if(featureIsDisabled == 1) return false; 
  if(featureIsDisabled == 0) return true;
}

module.exports = {checkFeatureSystemDisabled};