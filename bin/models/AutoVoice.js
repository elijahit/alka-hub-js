const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');

const AutoVoice = database.define('auto_voice', {
  auto_voice_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  type: { type: Sequelize.INTEGER },
  channel_id: { type: Sequelize.STRING },
  nickname: { type: Sequelize.INTEGER },

}, {tableName: 'auto_voice'});

Guild.hasMany(AutoVoice, { foreignKey: 'guild_id' });

module.exports = {
  AutoVoice,
};