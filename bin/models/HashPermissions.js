const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Hash } = require('./Hash');
const { Permissions } = require('./Permissions');

const HashPermissions = database.define('hash_permissions', {
  permission_id: { type: Sequelize.INTEGER },
  hash_id: { type: Sequelize.INTEGER }

}, {tableName: 'hash_permissions'});


Hash.belongsToMany(Permissions, { through: HashPermissions, foreignKey: 'hash_id', otherKey: 'permission_id' });
Permissions.belongsToMany(Hash, { through: HashPermissions, foreignKey: 'permission_id', otherKey: 'hash_id' });


module.exports = {
  HashPermissions,
};