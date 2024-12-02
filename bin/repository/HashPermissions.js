const {HashPermissions} = require('../models');
const {Permissions} = require('../models');



async function findAll() {
  return HashPermissions.findAll();
}


/**
 * @param {string} permission_name 
 */
async function findByPermissionName(permission_name) {
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