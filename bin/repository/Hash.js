// Code: Hash - bin/repository/Hash.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Hash.js
 * @module Hash
 * @description Contiene i metodi per richiamare la tabella Hash
 */

const { Model } = require('sequelize');
const {Hash} = require('../models');
const {Permissions} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Hash.findAll();
}


/**
 * @param {string} hash_name 
 * @returns {Promise<Model>}
 */
async function findByHashName(hash_name) {
  return await Hash.findOne({
    where: {hash_name: hash_name},
    include: [{
      model: Permissions,
      required: true,
    }]
  });
}

/**
 * @param {string} hash_name 
 * @returns {Promise<Model>}
 */
async function findAllCorrespondenceByHashName(hash_name) {
  return await Hash.findOne({
    where: {hash_name},
    include: [{
      model: Permissions,
      required: true,
    }],
  });
}

/**
 * @param {int} id 
 * @returns {Promise<Model>}
 */
async function findById(id) {
  return await Hash.findByPk(id);
}

/**
 * 
 * @param {string} hash_name 
 * @returns {Promise<Model>}
 */
async function create(hash_name) {
  if(Hash.findOne({where: {hash_name}})) return null;
  return await Hash.create({hash_name});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Model>}
 */
async function update(objToUpdate, objToCondition) {
  return await Hash.update(objToUpdate, objToCondition);
}


module.exports = {
  findAll,
  findById,
  findByHashName,
  findAllCorrespondenceByHashName,
  create,
  update
}