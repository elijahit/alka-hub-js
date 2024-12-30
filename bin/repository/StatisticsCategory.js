// Code: Statistics - bin/repository/Statistics.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file StatisticsCategory.js
 * @module StatisticsCategory
 * @description Contiene i metodi per richiamare la tabella StatisticsCategory
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {StatisticsCategory} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await StatisticsCategory.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId, variables) {
  return await StatisticsCategory.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} categoryId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndcategoryId(guildId, categoryId, variables) {
  return await StatisticsCategory.findOne({where: {guild_id: guildId, category_id: categoryId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} categoryId
 * @returns {Promise<Model>}
 */
async function create(guildId, categoryId, variables) {
  if(await StatisticsCategory.findOne({where: {guild_id: guildId, category_id: categoryId, config_id: variables.getConfigId()}})) return null;
  return await StatisticsCategory.create({guild_id: guildId, category_id: categoryId, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await StatisticsCategory.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildIdAndcategoryId,
  findAllByGuildId,
  create,
  update
}