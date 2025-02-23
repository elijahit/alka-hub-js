// Code: OldTickets - bin/repository/OldTickets.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file OldTickets.js
 * @module OldTickets
 * @description Contiene i metodi per richiamare la tabella OldTickets
 */

const { Model } = require('sequelize');
const { OldTickets } = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await OldTickets.findAll();
}

/**
 * @param {string} guildId
 * @param {object} variables
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId, variables) {
  return await OldTickets.findAll({where: {guild_id: guildId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} ticketId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function findByTicketId(ticketId, variables) {
  return await OldTickets.findOne({where: {ticket_id: ticketId, config_id: variables.getConfigId()}});
}

/**
 * @param {string} ticketId 
 * @param {string} guildId 
 * @param {object} variables
 * @returns {Promise<Model>}
 */
async function create(ticketId, guildId, variables) {
  if(await OldTickets.findOne({where: {ticket_id: ticketId, guild_id: guildId, config_id: variables.getConfigId()}})) return null;
  return await OldTickets.create({ticket_id: ticketId , guild_id: guildId, config_id: variables.getConfigId()});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await OldTickets.update(objToUpdate, objToCondition);
}

/**
 * @param {string} id
 * @param {object} variables
 * @returns {Promise<number>}
 */
async function remove(id, variables) {
  return await OldTickets.destroy({where: {ticket_id: id, config_id: variables.getConfigId()}});
}


module.exports = {
  findAll,
  findByTicketId,
  create,
  update,
  findAllByGuildId,
  remove
}