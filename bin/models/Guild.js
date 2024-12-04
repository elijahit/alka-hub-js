const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Guild = database.define('guilds', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  premium: { type: Sequelize.INTEGER },
  time_zone: { type: Sequelize.STRING }
});

module.exports = {
  Guild,
};