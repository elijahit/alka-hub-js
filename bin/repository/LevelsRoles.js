// Code: LevelsRoles - bin/models/LevelsRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LevelsRoles.js
 * @module LevelsRoles
 * @description Contiene il modello per la tabella levels_roles
 */
const Variables = require('../classes/GlobalVariables');
const {LevelsRoles} = require('../models');

/**
 * 
 * @returns {Promise<LevelsRoles[]>}
 */
async function findAll() {
  return await LevelsRoles.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<LevelsRoles>}
 */
async function findByGuildId(guildId) {
  return await LevelsRoles.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} roleId
 * @returns {Promise<LevelsRoles>}
 */
async function findByGuildIdAndRoleId(guildId, roleId) {
  return await LevelsRoles.findOne({where: {guild_id: guildId, role_id: roleId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId
 * @param {string} roleId
 * @param {number} level
 * @returns {Promise<LevelsRoles>}
 * @throws {Error}
 */
async function create(guildId, roleId, level) {
  const existingLevelsRoles = await LevelsRoles.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
  if (!existingLevelsRoles) {
    return await LevelsRoles.create({guild_id: guildId, role_id: roleId, level: level, config_id: Variables.getConfigId()});
  }
  else {
    throw new Error('LevelsRoles already exists');
  }
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, LevelsRoles[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await LevelsRoles.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  findByGuildIdAndRoleId,
  create,
  update
}