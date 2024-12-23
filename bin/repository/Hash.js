const {Hash} = require('../models');
const {Permissions} = require('../models');


/**
 * 
 * @returns {Promise<Array<Hash>>}
 */
async function findAll() {
  return await Hash.findAll();
}


/**
 * @param {string} hash_name 
 * @returns {Promise<Hash>}
 */
async function findByHashName(hash_name) {
  return await Hash.findOne({
    where: {hash_name: hash_name},
    include: [{
      model: Permissions,
      required: true,
    }]
  });
}

/**
 * @param {string} hash_name 
 * @returns {Promise<Hash>}
 */
async function findAllCorrespondenceByHashName(hash_name) {
  return await Hash.findOne({
    where: {hash_name},
    include: [{
      model: Permissions,
      required: true,
    }],
  });
}

/**
 * @param {int} id 
 * @returns {Promise<Hash>}
 */
async function findById(id) {
  return await Hash.findByPk(id);
}

/**
 * 
 * @param {string} hash_name 
 * @returns {Promise<Hash>}
 */
async function create(hash_name) {
  return await Hash.create({hash_name});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<Hash>}
 */
async function update(objToUpdate, objToCondition) {
  return await Hash.update(objToUpdate, objToCondition);
}


module.exports = {
  findAll,
  findById,
  findByHashName,
  findAllCorrespondenceByHashName,
  create,
  update
}