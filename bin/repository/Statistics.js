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
async function findAll() {
  return await Statistics.findAll({where: {config_id: Variables.getConfigId()}});
}

/**
 * @params {string} guildId
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId) {
  return await Statistics.findAll({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} channelId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndChannelId(guildId, channelId) {
  return await Statistics.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} channelId
 * @param {string} channelName
 * @param {integer} type
 * @returns {Promise<Model>}
 */
async function create(guildId, channelId, channelName, type) {
  if(await Statistics.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: Variables.getConfigId()}})) return null;
  return await Statistics.create({guild_id: guildId, channel_id: channelId, channel_name: channelName, type: type, config_id: Variables.getConfigId()});
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
  update
}