const {Permissions} = require('../models');
const {Hash} = require('../models');


async function findAll() {
  return Permissions.findAll();
}


/**
 * @param {string} permission_name 
 * @TODO Da fixare, non funziona da capire il perchè
 */
async function findByPermissionName(permission_name) {
  return await Permissions.findOne({
    where: {permission_name: permission_name},
    include: [{
      model: Hash,
      required: true,
    }]
  }).then(v => v.get({plain: true}));
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return Permissions.findByPk(id).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} permission_name 
 */
async function create(permission_name) {
  return Permissions.create({permission_name}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return Permissions.update(objToUpdate, {where: objToCondition}).then(v => v);
}


module.exports = {
  findAll,
  findById,
  findByPermissionName,
  create,
  update
}