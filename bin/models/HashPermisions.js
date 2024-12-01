const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Hash } = require('./hash');
const { Permissions } = require('./permissions');

const HashPermisions = database.define('hash_permissions', {
  permission_id: { type: Sequelize.INTEGER },
  hash_id: { type: Sequelize.INTEGER }

}, {tableName: 'hash_permissions'});


Hash.belongsToMany(Permissions, { through: HashPermisions, foreignKey: 'id', otherKey: 'hash_id'});
Permissions.belongsToMany(Hash, { through: HashPermisions,  foreignKey: 'id', otherKey: 'permission_id' });


module.exports = {
  HashPermisions,
};