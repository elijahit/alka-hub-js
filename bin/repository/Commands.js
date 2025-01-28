// Code: 
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Commands.js
 * @module Commands
 * @description Contiene i metodi per richiamare la tabella Commands
 */

const { Model } = require('sequelize');
const {Commands} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Commands.findAll();
}


/**
 * @param {string} name 
 * @returns {Promise<Model>}
 */
async function findByName(name) {
  return await Commands.findOne({where: {name: name}});
}

/**
 * @param {int} featureId
 * @returns {Promise<Model>}
 */
async function findAllByFeatureId(featureId) {
  return await Commands.findAll({where: {feature_id: featureId}});
}

/**
 * @param {string} id 
 * @returns {Promise<Model>}
 */
async function findById(id) {
  return await Commands.findOne({where: {id: id}});
}

module.exports = {
  findByName,
  findAll,
  findById,
  findAllByFeatureId
}