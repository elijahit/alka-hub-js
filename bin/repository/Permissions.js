const {Permissions} = require('../models');
const {Hash} = require('../models');

/**
 * 
 * @returns {Promise<Array<Permissions>>}
 */
async function findAll() {
  return await Permissions.findAll();
}


/**
 * @param {string} permission_name 
 * @returns {Promise<Permissions>}
 */
async function findByPermissionName(permission_name) {
  return await Permissions.findOne({
    where: {permission_name: permission_name},
    include: [{
      model: Hash,
      required: true,
    }]
  });
}

/**
 * @param {int} id 
 * @returns {Promise<Permissions>}
 */
async function findById(id) {
  return await Permissions.findByPk(id);
}

/**
 * 
 * @param {string} permission_name 
 * @returns {Promise<Permissions>}
 */
async function create(permission_name) {
  return await Permissions.create({permission_name});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 * @returns {Promise<[number, Permissions[]]>}
 */
async function update(objToUpdate, objToCondition) {
  return await Permissions.update(objToUpdate, objToCondition);
}


module.exports = {
  findAll,
  findById,
  findByPermissionName,
  create,
  update
}