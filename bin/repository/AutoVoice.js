// Code: AutoVoice - bin/repository/AutoVoice.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file AutoVoice.js
 * @module AutoVoice
 * @description Contiene i metodi per richiamare la tabella AutoVoice
 */

const {AutoVoice, Guild} = require('../models');
const Variables = require('../classes/GlobalVariables');


/**
 * 
 * @returns {Promise<Array<AutoVoice>>}
 */
async function findAll() {
  return await AutoVoice.findAll({where: {config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @returns {Promise<Array<AutoVoice>>}
 */
async function findAllbyGuild(guildId) {
  return await AutoVoice.findAll({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}



/**
 * @param {string} guildId 
 * @param {string} channelId 
 * @returns {Promise<AutoVoice>}
 */
async function findByChannelId(guildId, channelId) {
  return await AutoVoice.findOne({where: {channel_id: channelId, guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {integer} id 
 * @returns {Promise<AutoVoice>}
 */
async function findBylId(guildId, id) {
  return await AutoVoice.findOne({where: {id: id, guild_id: guildId, config_id: Variables.getConfigId()}});
}


/**
 * 
 * @param {string} roleId 
 * @returns {Promise<AutoVoice>}
 */
async function create(guildId, type, categoryId, nickname) {
  return await AutoVoice.create({guild_id: guildId, type: type, channel_id: categoryId, nickname: nickname, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<AutoVoice>}
 */
async function update(objToUpdate, objToCondition) {
  return await AutoVoice.update(objToUpdate, objToCondition);
}

/**
 * @param {object} objToCondition 
 * @returns {Promise<AutoVoice>}
 */
async function remove(objToCondition) {
  return await AutoVoice.destroy({
    where: {
      ...objToCondition,
      config_id: Variables.getConfigId()
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