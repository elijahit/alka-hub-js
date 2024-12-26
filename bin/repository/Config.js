// Code: Config - bin/repository/Config.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Config.js
 * @module Config
 * @description Contiene i metodi per richiamare la tabella Config
 */

const { Model } = require('sequelize');
const {Config} = require('../models');


/**
 * 
 * @returns {Promise<Array<Model>>}
 */
async function findAll() {
  return await Config.findAll();
}


/**
 * @param {string} name 
 * @returns {Promise<Model>}
 */
async function findByName(name) {
  return await Config.findOne({where: {name: name}});
}

module.exports = {
  findByName,
  findAll
}