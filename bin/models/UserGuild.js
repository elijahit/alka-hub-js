const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');
const { User } = require('./User');

const UserGuild = database.define('users_guilds', {
  user_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.INTEGER }

}, {tableName: 'users_guilds'});


Guild.belongsToMany(User, { through: UserGuild, foreignKey: 'user_id', otherKey: 'user_id'});
User.belongsToMany(Guild, { through: UserGuild,  foreignKey: 'guild_id', otherKey: 'guild_id' });


module.exports = {
  UserGuild,
};