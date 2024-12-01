const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Guild = database.define('guilds', {
  guild_id: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  time_zone: { type: Sequelize.STRING }
});

module.exports = {
  Guild,
};