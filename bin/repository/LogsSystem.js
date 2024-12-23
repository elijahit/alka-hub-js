// Code: LogsSystem - bin/repository/LogsSystem.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LogsSystem.js
 * @module LogsSystem
 * @description Contiene i metodi per richiamare la tabella LogsSystem
 */

const Variables = require('../classes/GlobalVariables');
const {LogsSystem} = require('../models');


/**
 * 
 * @returns {Promise<Array<LogsSystem>>}
 */
async function findAll() {
  return await LogsSystem.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<LogsSystem>}
 */
async function findByGuildId(guildId) {
  return await LogsSystem.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId  
 * @param {string} customTable
 * @param {string} customValue
 * @returns {Promise<LogsSystem>}
 */
async function create(guildId, customTable, customValue) {
  return await LogsSystem.create({guild_id: guildId, config_id: Variables.getConfigId(), [customTable]: customValue});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, LogsSystem[]]>}
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