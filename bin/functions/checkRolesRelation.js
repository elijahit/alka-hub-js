const { readDb, runDb } = require('../../bin/database');

const checkRolesRelation = async (roles, guilds) => {
  const checkRolesSql = `SELECT *
				FROM roles r
				WHERE r.roles_id = ? AND r.guilds_id = ?`;
  const resultRoles = await readDb(checkRolesSql, roles, guilds);
  if (!resultRoles) {
    let inserRolesSql = `INSERT INTO roles(roles_id, guilds_id) VALUES(?, ?)`;
    await runDb(inserRolesSql, roles, guilds);
  }
}

module.exports = checkRolesRelation;