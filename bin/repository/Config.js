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