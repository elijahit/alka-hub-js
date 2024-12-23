// Code: Statistics - bin/repository/Statistics.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Statistics.js
 * @module Statistics
 * @description Contiene i metodi per richiamare la tabella Statistics
 */

const Variables = require('../classes/GlobalVariables');
const {Statistics} = require('../models');

/**
 * 
 * @returns {Promise<Array<Statistics>>}
 */
async function findAll() {
  return await Statistics.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @param {string} channelId
 * @returns {Promise<Statistics>}
 */
async function findByGuildIdAndChannelId(guildId, channelId) {
  return await Statistics.findOne({where: {guild_id: guildId, channel_id: channelId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone
 * @returns {Promise<Statistics>}
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  return await Statistics.create({guild_id: guildId, language: language, time_zone: time_zone, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Statistics[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Statistics.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildIdAndChannelId,
  create,
  update
}