// Code: User - bin/repository/UserReports.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file UserReports.js
 * @module User
 * @description Contiene i metodi per richiamare la tabella User
 */

const { Model } = require('sequelize');
const {UserReports} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await UserReports.findAll();
}


/**
 * @param {string} userId 
 * @returns {Promise<Array<Model>>}
 */
async function findByUserId(userId) {
  return await UserReports.findAll({where: {user_id: userId}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} guildId
 * @param {number} reports
 * @param {string} reason
 * @param {number} isVerified
 * @returns {Promise<Model>} 
 */
async function create(userId, guildId, reports, reason, isVerified) {
  return await UserReports.create({user_id: userId, guild_id: guildId, reports: reports, reason: reason, isVerified: isVerified});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition
 * @returns {Promise<[number, Model[]]>} 
 */
async function update(objToUpdate, objToCondition) {
  return await UserReports.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByUserId,
  create,
  update
}