// Code: Level - bin/repository/Level.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Level.js
 * @module Level
 * @description Contiene i metodi per richiamare la tabella Level
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Level} = require('../models');

/**
 * 
 * @returns {Promise<Model[]>}
 */
async function findAll(variables) {
  return await Level.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await Level.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} userId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndUserId(guildId, userId, variables) {
  return await Level.findOne({where: {guild_id: guildId, user_id: userId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} guildId
 * @param {number} messageCount
 * @param {number} exp
 * @param {timestamp} joinedTime
 * @returns {Promise<Model>}
 * @throws {Error}
 */
async function create(userId, guildId, messageCount, exp, joinedTime, variables) {
  if(await Level.findOne({where: {guild_id: guildId, user_id: userId, config_id: variables.getConfigId()}})) return null;
  return await Level.create({guild_id: guildId, user_id: userId, exp: exp, minute_vocal: 0, message_count: messageCount, joined_time: joinedTime, level: 1, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Level.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  findByGuildIdAndUserId,
  create,
  update
}