// Code: Permissions - bin/repository/Permissions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Permissions.js
 * @module Permissions
 * @description Contiene i metodi per richiamare la tabella Permissions
 */

const { Model } = require('sequelize');
const {Permissions} = require('../models');
const {Hash} = require('../models');

/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Permissions.findAll();
}


/**
 * @param {string} permission_name 
 * @returns {Promise<Model>}
 */
async function findByPermissionName(permission_name) {
  return await Permissions.findOne({
    where: {permission_name: permission_name},
    include: [{
      model: Hash,
      required: true,
    }]
  });
}

/**
 * @param {int} id 
 * @returns {Promise<Model>}
 */
async function findById(id) {
  return await Permissions.findByPk(id);
}

/**
 * 
 * @param {string} permission_name 
 * @returns {Promise<Model>}
 */
async function create(permission_name) {
  return await Permissions.create({permission_name});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Model[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Permissions.update(objToUpdate, objToCondition);
}


module.exports = {
  findAll,
  findById,
  findByPermissionName,
  create,
  update
}