const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');

const AutoVoice = database.define('auto_voice', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  type: { type: Sequelize.INTEGER },
  channel_id: { type: Sequelize.STRING },
  nickname: { type: Sequelize.INTEGER },

}, {tableName: 'auto_voice'});

module.exports = {
  AutoVoice,
};