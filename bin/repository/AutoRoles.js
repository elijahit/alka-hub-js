const {AutoRoles, Role} = require('../models');


async function findAll() {
  return AutoRoles.findAll().then(v => v);
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
  }).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} roleId 
 */
async function create(roleId, guildId) {
  return AutoRoles.create({role_id: roleId}).then(v => v.get({plain: true}));
}

/**
 * 
 * @param {string} objToUpdate 
 * @param {string} objToCondition 
 */
async function update(objToUpdate, objToCondition) {
  return AutoRoles.update(objToUpdate, {where: objToCondition}).then(v => v);
}

module.exports = {
  findAll,
  finByRoleId,
  create,
  update
}