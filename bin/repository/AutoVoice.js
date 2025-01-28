// Code: AutoVoice - bin/repository/AutoVoice.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file AutoVoice.js
 * @module AutoVoice
 * @description Contiene i metodi per richiamare la tabella AutoVoice
 */

const {AutoVoice, Guild} = require('../models');
const Variables = require('../classes/GlobalVariables');
const { Model } = require('sequelize');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll(variables) {
  return await AutoVoice.findAll({where: {config_id: variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @returns {Promise<Array<Model>>}
 */
async function findAllbyGuild(guildId, variables) {
  return await AutoVoice.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}



/**
 * @param {string} guildId 
 * @param {string} channelId 
 * @returns {Promise<Model>}
 */
async function findByChannelId(guildId, channelId, variables) {
  return await AutoVoice.findOne({where: {channel_id: channelId, guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {integer} id 
 * @returns {Promise<Model>}
 */
async function findBylId(guildId, id, variables) {
  return await AutoVoice.findOne({where: {id: id, guild_id: guildId, config_id: variables.getConfigId()}});
}


/**
 * 
 * @param {string} roleId 
 * @returns {Promise<Model>}
 */
async function create(guildId, type, categoryId, nickname, variables) {
  if(await AutoVoice.findOne({where: {guild_id: guildId, channel_id: categoryId, config_id: variables.getConfigId()}})) return null;
  return await AutoVoice.create({guild_id: guildId, type: type, channel_id: categoryId, nickname: nickname, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await AutoVoice.update(objToUpdate, objToCondition);
}

/**
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function remove(objToCondition, variables) {
  return await AutoVoice.destroy({
    where: {
      ...objToCondition,
      config_id: variables.getConfigId()
    }
});
}

module.exports = {
  findAll,
  findByChannelId,
  findBylId,
  create,
  update,
  remove,
  findAllbyGuild
}