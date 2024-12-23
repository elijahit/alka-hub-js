// Code: Level - bin/repository/Level.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Level.js
 * @module Level
 * @description Contiene i metodi per richiamare la tabella Level
 */

const Variables = require('../classes/GlobalVariables');
const {Level} = require('../models');

/**
 * 
 * @returns {Promise<Level[]>}
 */
async function findAll() {
  return await Level.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Level>}
 */
async function findByGuildId(guildId) {
  return await Level.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} userId
 * @returns {Promise<Level>}
 */
async function findByGuildIdAndUserId(guildId, userId) {
  return await Level.findOne({where: {guild_id: guildId, user_id: userId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} guildId
 * @returns {Promise<Level>}
 * @throws {Error}
 */
async function create(userId, guildId) {
  const existingLevel = await Level.findOne({where: {guild_id: guildId, user_id: userId, config_id: Variables.getConfigId()}});
  if (!existingLevel) {
    return await Level.create({guild_id: guildId, user_id: userId, exp: 1, minute_vocal: 0, message_count: 1, config_id: Variables.getConfigId()});
  }
  else {
    throw new Error('Level already exists');
  }
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Level[]]>}
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