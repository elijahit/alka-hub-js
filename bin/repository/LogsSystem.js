// Code: LogsSystem - bin/repository/LogsSystem.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LogsSystem.js
 * @module LogsSystem
 * @description Contiene i metodi per richiamare la tabella LogsSystem
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {LogsSystem} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await LogsSystem.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await LogsSystem.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId  
 * @param {string} customTable
 * @param {string} customValue
 * @returns {Promise<Model>}
 */
async function create(guildId, customTable, customValue, variables) {
  if(await LogsSystem.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await LogsSystem.create({guild_id: guildId, config_id: variables.getConfigId(), [customTable]: customValue});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
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