// Code: User - bin/repository/User.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file User.js
 * @module User
 * @description Contiene i metodi per richiamare la tabella User
 */

const { Model } = require('sequelize');
const {User} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await User.findAll();
}


/**
 * @param {string} userId 
 * @returns {Promise<Model>}
 */
async function findByUserId(userId) {
  return await User.findOne({where: {user_id: userId}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} username 
 * @returns {Promise<Model>} 
 */
async function create(userId, username) {
  if(await User.findOne({where: {user_id: userId}})) return null;
  return await User.create({user_id: userId, name: username});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition
 * @returns {Promise<[number, Model[]]>} 
 */
async function update(objToUpdate, objToCondition) {
  return await User.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByUserId,
  create,
  update
}