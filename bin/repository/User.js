const {User} = require('../models/User');


async function findAll() {
  return User.findAll();
}


/**
 * @param {string} userId 
 */
async function findByUserId(userId) {
  return User.findOne({where: {user_id: userId}});
}

/**
 * 
 * @param {string} userId 
 * @param {string} username 
 */
async function create(userId, username) {
  return User.create({user_id: userId, name: username})
}


module.exports = {
  findAll,
  findByUserId,
  create
}