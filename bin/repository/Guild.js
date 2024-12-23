const Variables = require('../classes/GlobalVariables');
const {Guild} = require('../models');

/**
 * 
 * @returns {Promise<Array<Guild>>}
 */
async function findAll() {
  return await Guild.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Guild>}
 */
async function findByGuildId(guildId) {
  return await Guild.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone 
 * @returns {Promise<Guild>}
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  return await Guild.create({guild_id: guildId, language: language, time_zone: time_zone, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Guild>}
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