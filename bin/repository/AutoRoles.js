// Code: AutoRoles - bin/repository/AutoRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file AutoRoles.js
 * @module AutoRoles
 * @description Contiene i metodi per richiamare la tabella AutoRoles
 */

const { Model } = require('sequelize');
const {AutoRoles, Role} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await AutoRoles.findAll();
}

/**
 * @param {string} guildId
 * @param {object} variables
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId, variables) {
  return await AutoRoles.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} roleId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function finByRoleId(roleId, variables) {
  return await AutoRoles.findOne({where: {role_id: roleId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} roleId 
 * @param {string} guildId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function create(roleId, guildId, variables) {
  if(await AutoRoles.findOne({where: {role_id: roleId, guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await AutoRoles.create({role_id: roleId , guild_id: guildId, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await AutoRoles.update(objToUpdate, objToCondition);
}

/**
 * @param {string} id
 * @param {object} variables
 * @returns {Promise<number>}
 */
async function remove(id, variables) {
  return await AutoRoles.destroy({where: {role_id: id, config_id: variables.getConfigId()}});
}


module.exports = {
  findAll,
  finByRoleId,
  create,
  update,
  findAllByGuildId,
  remove
}