const {AutoRoles, Role} = require('../models');


async function findAll() {
  return AutoRoles.findAll();
}


/**
 * @param {string} roleId 
 */
async function finByRoleId(roleId) {
  return AutoRoles.findOne({where: {role_id: roleId},
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
async function create(roleId, guildId) {
  return AutoRoles.create({role_id: roleId});
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return AutoRoles.update(objToUpdate, {where: objToCondition});
}

module.exports = {
  findAll,
  finByRoleId,
  create,
  update
}