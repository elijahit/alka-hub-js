const Variables = require('../classes/GlobalVariables');
const {GuildEnabledFeature} = require('../models');



async function findAll() {
  return await GuildEnabledFeature.findAll();
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return await GuildEnabledFeature.findByPk(id);
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await GuildEnabledFeature.update(objToUpdate, objToCondition);
}

async function create(guildId, featureId, isEnabled) {
  return await GuildEnabledFeature.create({guild_id: guildId, feature_id: featureId, is_enabled: isEnabled, config_id: Variables.getConfigId()});
}


module.exports = {
  findAll,
  findById,
  update,
  create
}