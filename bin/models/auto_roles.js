const { database } = require('../database');
const { Sequelize } = require('sequelize');

const AutoRoles = database.define('auto_roles', {
  auto_roles_id: { type: Sequelize.STRING },
  roles_id: { type: Sequelize.STRING }
});


module.exports = {
  AutoRoles,
};