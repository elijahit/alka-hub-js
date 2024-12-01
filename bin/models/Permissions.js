const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Permissions = database.define('permissions', {
  permission_name: { type: Sequelize.STRING }

}, {tableName: 'permissions'});


module.exports = {
  Permissions,
};