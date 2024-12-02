const {User} = require('../models');


async function findAll() {
  return User.findAll();
}


/**
 * @param {string} userId 
 */
async function findByUserId(userId) {
  return User.findOne({where: {user_id: userId}}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} userId 
 * @param {string} username 
 */
async function create(userId, username) {
  return User.create({user_id: userId, name: username}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return User.update(objToUpdate, {where: objToCondition}).then(v => v);
}

module.exports = {
  findAll,
  findByUserId,
  create,
  update
}