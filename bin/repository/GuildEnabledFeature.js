const Variables = require('../classes/GlobalVariables');
const {GuildEnabledFeature} = require('../models');


/**
 * 
 * @returns {Promise<Array<GuildEnabledFeature>>}
 */
async function findAll() {
  return await GuildEnabledFeature.findAll();
}

/**
 * @param {int} id 
 * @returns {Promise<GuildEnabledFeature>}
 */
async function findById(id) {
  return await GuildEnabledFeature.findByPk(id);
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<GuildEnabledFeature>}
 */
async function update(objToUpdate, objToCondition) {
  return await GuildEnabledFeature.update(objToUpdate, objToCondition);
}

/**
 * 
 * @param {string} guildId 
 * @param {int} featureId 
 * @param {tinyint} isEnabled 
 * @returns {Promise<GuildEnabledFeature>}
 */
async function create(guildId, featureId, isEnabled) {
  return await GuildEnabledFeature.create({guild_id: guildId, feature_id: featureId, is_enabled: isEnabled, config_id: Variables.getConfigId()});
}


module.exports = {
  findAll,
  findById,
  update,
  create
}