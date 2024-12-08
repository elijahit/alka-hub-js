const { database } = require('../database');
const { Sequelize } = require('sequelize');

const LogsSystem = database.define('logs_system', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  voice_state_channel: { type: Sequelize.STRING },
  channel_state_channel: { type: Sequelize.STRING },
  guild_audit_channel: { type: Sequelize.STRING },
  emoji_state_channel: { type: Sequelize.STRING },
  ban_state_channel: { type: Sequelize.STRING },
  member_state_channel: { type: Sequelize.STRING },
  guild_state_channel: { type: Sequelize.STRING },
  invite_state_channel: { type: Sequelize.STRING },
  message_state_channel: { type: Sequelize.STRING },
  join_member_channel: { type: Sequelize.STRING },
  exit_member_channel: { type: Sequelize.STRING },

}, {tableName: 'logs_system'});


module.exports = {
  LogsSystem,
};