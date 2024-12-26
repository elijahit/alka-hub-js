// Code: Guild - bin/repository/Guild.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Guild.js
 * @module Guild
 * @description Contiene i metodi per richiamare la tabella Guild
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Guild} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Guild.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId) {
  return await Guild.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} language 
 * @param {string} time_zone 
 * @returns {Promise<Model>}
 */
async function create(guildId, language = "EN", time_zone = "Europe/London") {
  if(Guild.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}})) return null;
  return await Guild.create({guild_id: guildId, language: language, time_zone: time_zone, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await Guild.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  create,
  update
}