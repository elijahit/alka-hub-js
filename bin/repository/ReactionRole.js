// Code: ReactionRole - bin/repository/ReactionRole.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file ReactionRole.js
 * @module ReactionRole
 * @description Contiene i metodi per richiamare la tabella ReactionRole
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {ReactionRole} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await ReactionRole.findAll({where: {config_id: Variables.getConfigId()}});
}


/**
 * @param {string} guildId 
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId) {
  return await ReactionRole.findAll({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @returns {Promise<Model>}
 */
async function findByGuildId(guildId) {
  return await ReactionRole.findOne({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} messageId 
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndMessageId(guildId, messageId) {
  return await ReactionRole.findOne({where: {guild_id: guildId, message_id: messageId, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} messageId 
 * @param {string} emoji
 * @param {string} roleId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndMessageIdAndEmoji(guildId, messageId, emoji) {
  return await ReactionRole.findOne({where: {guild_id: guildId, message_id: messageId, emoji: emoji, config_id: Variables.getConfigId()}});
}

/**
 * @param {string} guildId 
 * @param {string} messageId 
 * @param {string} emoji
 * @param {string} roleId
 * @returns {Promise<Model>}
 */
async function findByGuildIdAndMessageIdAndEmojiAndRoleId(guildId, messageId, emoji, roleId) {
  return await ReactionRole.findOne({where: {guild_id: guildId, message_id: messageId, emoji: emoji, role_id: roleId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} roleId 
 * @param {string} guildId  
 * @param {string} emoji
 * @param {string} messageId
 * @returns {Promise<Model> | null}
 */
async function create(roleId, guildId, emoji, messageId) {
  if(await ReactionRole.findOne({where: {guild_id: guildId, role_id: roleId, emoji: emoji, message_id: messageId, config_id: Variables.getConfigId()}})) return null;
  return await ReactionRole.create({guild_id: guildId, role_id: roleId, emoji: emoji, message_id: messageId, config_id: Variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await ReactionRole.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByGuildId,
  findByGuildIdAndMessageId,
  findByGuildIdAndMessageIdAndEmojiAndRoleId,
  findByGuildIdAndMessageIdAndEmoji,
  findAllByGuildId,
  create,
  update
}