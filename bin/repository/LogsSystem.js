const Variables = require('../classes/GlobalVariables');
const {LogsSystem} = require('../models');


async function findAll() {
  return await LogsSystem.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 */
async function findByGuildId(guildId) {
  return await LogsSystem.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId  
 */
async function create(guildId, customTable, customValue) {
  return await LogsSystem.create({guild_id: guildId, config_id: Variables.getConfigId(), [customTable]: customValue});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await LogsSystem.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}