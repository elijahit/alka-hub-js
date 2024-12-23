const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Level = database.define('levels', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  user_id: { type: Sequelize.STRING },
  exp: { type: Sequelize.INTEGER },
  joined_time: { type: Sequelize.DATE },
  minute_vocal: { type: Sequelize.INTEGER },
  message_count: { type: Sequelize.INTEGER },
  level: { type: Sequelize.INTEGER }
});

module.exports = {
  Level,
};