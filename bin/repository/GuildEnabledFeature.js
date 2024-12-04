const Variables = require('../classes/GlobalVariables');
const {GuildEnabledFeature} = require('../models');



async function findAll() {
  return await GuildEnabledFeature.findAll();
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return await GuildEnabledFeature.findByPk(id);
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, {where: objToCondition}) {
  return await GuildEnabledFeature.update(objToUpdate, {where: objToCondition});
}


module.exports = {
  findAll,
  findById,
  update
}