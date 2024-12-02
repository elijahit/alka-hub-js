const {HashPermissions} = require('../models');
const {Permissions} = require('../models');



async function findAll() {
  return HashPermissions.findAll().then(v => v);
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
  }).then(v => v.get({plain: true}));
}

/**
 * @param {int} id 
 */
async function findById(id) {
  return HashPermissions.findByPk(id).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return HashPermissions.update(objToUpdate, {where: objToCondition}).then(v => v);
}


module.exports = {
  findAll,
  findById,
  update,
  findByPermissionName
}