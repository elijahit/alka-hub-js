// Code: Welcome - bin/models/Welcome.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Welcome.js
 * @module Welcome
 * @description Contiene i metodi per richiamare la tabella Welcome
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Welcome} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await Welcome.findAll({where: {config_id: variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} channelId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndChannelId(guildId, channelId, variables) {
  return await Welcome.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId, variables) {
  return await Welcome.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} channelId
 * @param {string} channelName
 * @param {integer} type
 * @returns {Promise<Model>}
 */
async function create(guildId, channelId, color, backgroundUrl, text, variables) {
  if(await Welcome.findOne({where: {guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await Welcome.create({guild_id: guildId, channel_id: channelId, color: color, background_url: backgroundUrl, text: text, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Welcome.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildIdAndChannelId,
  findByGuildId,
  create,
  update
}