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
async function create(guildId) {
  return await LogsSystem.create({guild_id: guildId, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await Guild.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}