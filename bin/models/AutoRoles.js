const { database } = require('../database');
const { Sequelize } = require('sequelize');

const AutoRoles = database.define('auto_roles', {
  role_id: { type: Sequelize.STRING }
});


module.exports = {
  AutoRoles,
};