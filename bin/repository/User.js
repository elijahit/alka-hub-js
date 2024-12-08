const {User} = require('../models');


async function findAll() {
  return await User.findAll();
}


/**
 * @param {string} userId 
 */
async function findByUserId(userId) {
  return await User.findOne({where: {user_id: userId}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} username 
 */
async function create(userId, username) {
  return await User.create({user_id: userId, name: username});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await User.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  findByUserId,
  create,
  update
}