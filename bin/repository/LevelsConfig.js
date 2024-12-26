// Code: LevelsConfig - bin/repository/LevelsConfig.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LevelsConfig.js
 * @module LevelsConfig
 * @description Contiene i metodi per l'interazione con il modello LevelsConfig
 */
const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {LevelsConfig} = require('../models');

/**
 * 
 * @returns {Promise<Model[]>}
 */
async function findAll() {
  return await LevelsConfig.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId) {
  return await LevelsConfig.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} channelId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndChannelId(guildId, channelId) {
  return await LevelsConfig.findOne({where: {guild_id: guildId, log_channel: channelId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId
 * @param {string} channelId
 * @returns {Promise<LevelsConfig>}
 * @throws {Error}
 */
async function create(guildId, channelId) {
  const existingLevelsConfig = await LevelsConfig.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
  if (!existingLevelsConfig) {
    return await LevelsConfig.create({guild_id: guildId, log_channel: channelId, config_id: Variables.getConfigId()});
  }
  else {
    throw new Error('LevelsConfig already exists');
  }
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, LevelsConfig[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await LevelsConfig.update(objToUpdate, objToCondition);
}

async function remove(objToDelete) {
  return await LevelsConfig.destroy(objToDelete);
}

module.exports = {
  findAll,
  findByGuildId,
  findByGuildIdAndChannelId,
  create,
  update,
  remove
}