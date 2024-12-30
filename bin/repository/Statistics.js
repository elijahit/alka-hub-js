// Code: Statistics - bin/repository/Statistics.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Statistics.js
 * @module Statistics
 * @description Contiene i metodi per richiamare la tabella Statistics
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Statistics} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await Statistics.findAll({where: {config_id: variables.getConfigId()}});
}

/**
 * @params {string} guildId
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId, variables) {
  return await Statistics.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} channelId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndChannelId(guildId, channelId, variables) {
  return await Statistics.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: variables.getConfigId()}});
}


/**
 * 
 * @param {string} guildId 
 * @param {integer} id 
 * @returns 
 */
async function findById(guildId, id, variables) {
  return await Statistics.findOne({where: {guild_id: guildId, id: id, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} channelId
 * @param {string} channelName
 * @param {integer} type
 * @returns {Promise<Model>}
 */
async function create(guildId, channelId, channelName, type, variables) {
  if(await Statistics.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: variables.getConfigId()}})) return null;
  return await Statistics.create({guild_id: guildId, channel_id: channelId, channel_name: channelName, type: type, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {string} guildId 
 * @param {integer} id 
 * @returns 
 */
async function remove(guildId, id, variables) {
  return await Statistics.destroy({where: {guild_id: guildId, id: id, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Statistics.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findAllByGuildId,
  findByGuildIdAndChannelId,
  create,
  update,
  remove,
  findById
}