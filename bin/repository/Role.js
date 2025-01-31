// Code: Role - bin/repository/Role.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Role.js
 * @module Role
 * @description Contiene i metodi per richiamare la tabella Role
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Role} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await Role.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await Role.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} roleId 
 * @param {string} guildId  
 * @returns {Promise<Model> | null}
 */
async function create(roleId, guildId, variables) {
  if(await Role.findOne({where: {guild_id: guildId, role_id: roleId, config_id: variables.getConfigId()}})) return null;
  return await Role.create({guild_id: guildId, role_id: roleId, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await Role.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}