// Code: AutoRoles - bin/repository/AutoRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file AutoRoles.js
 * @module AutoRoles
 * @description Contiene i metodi per richiamare la tabella AutoRoles
 */

const { Model } = require('sequelize');
const {AutoRoles, Role} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await AutoRoles.findAll();
}


/**
 * @param {string} roleId 
 * @returns {Promise<Model>}
 */
async function finByRoleId(roleId) {
  return await AutoRoles.findOne({where: {role_id: roleId},
    include: [{
      model: Role,
      required: true,
    }]
  });
}

/**
 * @param {string} roleId 
 * @returns {Promise<Model>}
 */
async function create(roleId) {
  return await AutoRoles.create({role_id: roleId});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await AutoRoles.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  finByRoleId,
  create,
  update
}