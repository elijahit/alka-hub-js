const Variables = require('../classes/GlobalVariables');
const {Feature} = require('../models');
const {Guild} = require('../models');
const {GuildEnabledFeatures} = require('../models');



async function findAll() {
  return await Feature.findAll();
}


/**
 * @param {string} guildId 
 * @param {string} featureId 
 */
async function checkFeatureEnabled(guildId, featureId) {
  return await Feature.findOne({
    where: {id: featureId},
    include: [{
      model: Guild,
      required: true,
      where: {guild_id: guildId, config_id: Variables.getConfigId()},
      through: {attributes: ['guild_id', 'feature_id', 'is_enabled', 'config_id']},
    }]
  });
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return await Feature.findByPk(id);
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await Feature.update(objToUpdate, {where: objToCondition});
}


module.exports = {
  findAll,
  findById,
  update,
  checkFeatureEnabled
}