const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');
const { User } = require('./User');

const UserGuild = database.define('users_guilds', {
  user_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.INTEGER }

}, {tableName: 'users_guilds'});


module.exports = {
  UserGuild,
};