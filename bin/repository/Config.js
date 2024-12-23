// Code: Config - bin/repository/Config.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Config.js
 * @module Config
 * @description Contiene i metodi per richiamare la tabella Config
 */

const {Config} = require('../models');


/**
 * 
 * @returns {Promise<Array<Config>>}
 */
async function findAll() {
  return await Config.findAll();
}


/**
 * @param {string} name 
 * @returns {Promise<Config>}
 */
async function findByName(name) {
  return await Config.findOne({where: {name: name}});
}

module.exports = {
  findByName,
  findAll
}