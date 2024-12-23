// Code: Feature - bin/repository/Feature.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Feature.js
 * @module Feature
 * @description Contiene i metodi per richiamare la tabella Feature
 */

const Variables = require('../classes/GlobalVariables');
const {Feature} = require('../models');
const {Guild} = require('../models');


/**
 * @returns {Promise<Array<Feature>>} 
 */
async function findAll() {
  return await Feature.findAll();
}


/**
 * @param {string} guildId 
 * @param {string} featureId 
 * @returns {Promise<Feature>}
 */
async function getFeatureIsEnabled(guildId, featureId) {
  return await Feature.findOne({
    where: {id: featureId},
    include: [{
      model: Guild,
      required: true,
      where: {guild_id: guildId, config_id: Variables.getConfigId()},
      through: {attributes: ['guild_id', 'feature_id', 'is_enabled', 'config_id']},
    }]
  });
}

/**
 * @param {int} id 
 * @returns {Promise<Feature>}
 */
async function findById(id) {
  return await Feature.findByPk(id);
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Feature>}
 */
async function update(objToUpdate, objToCondition) {
  return await Feature.update(objToUpdate, objToCondition);
}


module.exports = {
  findAll,
  findById,
  update,
  getFeatureIsEnabled
}