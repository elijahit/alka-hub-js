const Variables = require('../classes/GlobalVariables');
const {Guild} = require('../models');


async function findAll() {
  return await Guild.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 */
async function findByGuildId(guildId) {
  return await Guild.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone 
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  return await Guild.create({guild_id: guildId, language: language, time_zone: time_zone, config_id: Variables.getConfigId()});
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