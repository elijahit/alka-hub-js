// Code: Log - bin/repository/Log.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Log.js
 * @module Log
 * @description Contiene i metodi per richiamare la tabella Log
 */

const { Model } = require('sequelize');
const Variables = require('../classes/GlobalVariables');
const {Log} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Log.findAll();
}


/**
 * @param {string} id 
 * @returns {Promise<Model>}
 */
async function findById(id) {
  return await Log.findOne({where: {id: id}});
}

/**
 * @param {string} guildId 
 * @returns {Promise<Array<Model>>}
 */
async function findAllByGuildId(guildId) {
  return await Log.findAll({where: {guild_id: guildId, config_id: Variables.getConfigId()}});
}

/**
 * 
 * @param {string} guildId 
 * @param {string} type 
 * @param {string} reason 
 * @returns 
 */
async function create(guildId, type, reason) {
  return await Log.create({guild_id: guildId, config_id: Variables.getConfigId(), type: type, reason: reason});
}

module.exports = {
  findById,
  findAll,
  findAllByGuildId,
  create
}