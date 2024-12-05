const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Config = database.define('configs', {
  name: { type: Sequelize.STRING },
  owner_discord_id: { type: Sequelize.STRING },
  json: { type: Sequelize.STRING },
  isActive: { type: Sequelize.INTEGER },
  premium: { type: Sequelize.INTEGER }
});

module.exports = {
  Config,
};