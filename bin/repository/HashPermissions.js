const {HashPermissions} = require('../models/HashPermissions');
const {Permissions} = require('../models/Permissions');
const {Hash} = require('../models/Hash');



async function findAll() {
  return HashPermissions.findAll();
}


/**
 * @param {string} permission_name 
 */
async function findPermissionName(permission_name) {
  return await Permissions.findOne({
    where: {permission_name: permission_name},
    include: [{
      model: Permissions,
      required: true,
    }]
  });
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return HashPermissions.findByPk(id);
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return HashPermissions.update(objToUpdate, {where: objToCondition})
}


module.exports = {
  findAll,
  findById,
  update,
  findByPermissionName
}