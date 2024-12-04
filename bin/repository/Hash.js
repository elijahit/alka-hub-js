const {Hash} = require('../models');
const {Permissions} = require('../models');


async function findAll() {
  return await Hash.findAll();
}


/**
 * @param {string} hash_name 
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
 */
async function findById(id) {
  return await Hash.findByPk(id);
}

/**
 * 
 * @param {string} hash_name 
 */
async function create(hash_name) {
  return await Hash.create({hash_name});
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, {where: objToCondition}) {
  return await Hash.update(objToUpdate, {where: objToCondition});
}


module.exports = {
  findAll,
  findById,
  findByHashName,
  findAllCorrespondenceByHashName,
  create,
  update
}