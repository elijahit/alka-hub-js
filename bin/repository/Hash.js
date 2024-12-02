const {Hash} = require('../models');
const {Permissions} = require('../models');


async function findAll() {
  return Hash.findAll();
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
  }).then(v => v.get({plain: true}));
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
  }).then(v => v);
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return Hash.findByPk(id).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} hash_name 
 */
async function create(hash_name) {
  return Hash.create({hash_name}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return Hash.update(objToUpdate, {where: objToCondition}).then(v => v);
}


module.exports = {
  findAll,
  findById,
  findByHashName,
  findAllCorrespondenceByHashName,
  create,
  update
}