const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Statistics = database.define('statistics', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  channel_id: { type: Sequelize.STRING },
  channel_name: { type: Sequelize.INTEGER },
  type: { type: Sequelize.STRING }
});

module.exports = {
  Statistics,
};