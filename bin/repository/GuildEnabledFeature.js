// Code: GuildEnabledFeature - bin/repository/GuildEnabledFeature.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildEnabledFeature.js
 * @module GuildEnabledFeature
 * @description Contiene i metodi per richiamare la tabella GuildEnabledFeature
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {GuildEnabledFeature} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await GuildEnabledFeature.findAll();
}

/**
 * 
 * @param {string} guildId 
 * @param {integer} featureId 
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndFeatureId(guildId, featureId, variables) {
  return await GuildEnabledFeature.findOne({where: {guild_id: guildId, feature_id: featureId, config_id: variables.getConfigId()}});
}


/**
 * @param {int} id 
 * @returns {Promise<Model>}
 */
async function findById(id) {
  return await GuildEnabledFeature.findByPk(id);
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await GuildEnabledFeature.update(objToUpdate, objToCondition);
}

/**
 * 
 * @param {string} guildId 
 * @param {int} featureId 
 * @param {tinyint} isEnabled 
 * @returns {Promise<Model>}
 */
async function create(guildId, featureId, isEnabled, variables) {
  if(await GuildEnabledFeature.findOne({where: {guild_id: guildId, feature_id: featureId, config_id: variables.getConfigId()}})) return null;
  return await GuildEnabledFeature.create({guild_id: guildId, feature_id: featureId, is_enabled: isEnabled, config_id: variables.getConfigId()});
}


module.exports = {
  findAll,
  findById,
  update,
  create,
  findByGuildIdAndFeatureId
}