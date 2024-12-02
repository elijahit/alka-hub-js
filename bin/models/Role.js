const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Role = database.define('roles', {
  role_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.STRING }
});


module.exports = {
  Role,
};