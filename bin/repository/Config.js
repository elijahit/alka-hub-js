const {Config} = require('../models');


async function findAll() {
  return await Config.findAll();
}


/**
 * @param {string} name 
 */
async function findByName(name) {
  return await Config.findOne({where: {name: name}});
}

module.exports = {
  findByName,
}