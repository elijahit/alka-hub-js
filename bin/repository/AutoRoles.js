const {AutoRoles, Role} = require('../models');


async function findAll() {
  return await AutoRoles.findAll();
}


/**
 * @param {string} roleId 
 */
async function finByRoleId(roleId) {
  return await AutoRoles.findOne({where: {role_id: roleId},
    include: [{
      model: Role,
      required: true,
    }]
  });
}

/**
 * 
 * @param {string} roleId 
 */
async function create(roleId) {
  return await AutoRoles.create({role_id: roleId});
}

/**
 * 
 * @param {object} objToUpdate 
 * @param {object} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return await AutoRoles.update(objToUpdate, objToCondition);
}

module.exports = {
  findAll,
  finByRoleId,
  create,
  update
}