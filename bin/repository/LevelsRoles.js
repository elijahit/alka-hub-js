// Code: LevelsRoles - bin/models/LevelsRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LevelsRoles.js
 * @module LevelsRoles
 * @description Contiene il modello per la tabella levels_roles
 */
const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {LevelsRoles} = require('../models');

/**
 * 
 * @returns {Promise<Model[]>}
 */
async function findAll(variables) {
  return await LevelsRoles.findAll({where: {config_id: variables.getConfigId()}});
}

/**
 * @param {string} guildId
 * @returns {Promise<Model[]>}
 */
async function findAllByGuildId(guildId, variables) {
  return await LevelsRoles.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await LevelsRoles.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} roleId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndRoleId(guildId, roleId, variables) {
  return await LevelsRoles.findOne({where: {guild_id: guildId, role_id: roleId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId
 * @param {string} roleId
 * @param {number} level
 * @returns {Promise<Model>}
 * @throws {Error}
 */
async function create(guildId, roleId, level, variables) {
  if(await LevelsRoles.findOne({where: {guild_id: guildId, role_id: roleId, config_id: variables.getConfigId()}})) return null;
  return await LevelsRoles.create({guild_id: guildId, role_id: roleId, level: level, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await LevelsRoles.update(objToUpdate, objToCondition);
}

async function remove(objToCondition) {
  return await LevelsRoles.destroy(objToCondition);
}

module.exports = {
  findAll,
  findAllByGuildId,
  findByGuildId,
  findByGuildIdAndRoleId,
  create,
  update,
  remove
}