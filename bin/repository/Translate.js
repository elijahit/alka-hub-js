// Code: bin/models/Translate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Translate.js
 * @module Translate
 * @description Contiene il modello Translate
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Translate} = require('../models');

/**
 * @param {Variables} variables
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await Translate.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {Variables} variables
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await Translate.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {integer} mode
 * @param {Variables} variables
 * @returns {Promise<Model>}
 */
async function create(guildId, mode, variables) {
  if(await Translate.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await Translate.create({guild_id: guildId, mode: mode, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await Translate.update(objToUpdate, objToCondition);
}

/**
 * 
 * @param {string} guildId 
 * @param {Variables} variables
 * @returns {Promise<Model>}
 */
async function deleteByGuildId(guildId, variables) {
  return await Translate.destroy({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update,
  deleteByGuildId
}