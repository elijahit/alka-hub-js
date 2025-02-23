// Code: OldTicketMessages - bin/repository/OldTicketMessages.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file OldTicketMessages.js
 * @module OldTicketMessages
 * @description Contiene i metodi per richiamare la tabella OldTicketMessages
 */

const { Model } = require('sequelize');
const { OldTicketMessages } = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await OldTicketMessages.findAll();
}

/**
 * @param {string} guildId
 * @param {object} variables
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId, variables) {
  return await OldTicketMessages.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} messageId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function findByMessageId(messageId, variables) {
  return await OldTicketMessages.findOne({where: {message_id: messageId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} messageId 
 * @param {string} guildId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function create(messageId, guildId, variables) {
  if(await OldTicketMessages.findOne({where: {message_id: messageId, guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await OldTicketMessages.create({message_id: messageId , guild_id: guildId, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await OldTicketMessages.update(objToUpdate, objToCondition);
}

/**
 * @param {string} id
 * @param {object} variables
 * @returns {Promise<number>}
 */
async function remove(id, variables) {
  return await OldTicketMessages.destroy({where: {message_id: id, config_id: variables.getConfigId()}});
}


module.exports = {
  findAll,
  findByMessageId,
  create,
  update,
  findAllByGuildId,
  remove
}