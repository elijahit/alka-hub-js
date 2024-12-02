const { database } = require('../database');
const { Sequelize } = require('sequelize');

const GuildEnabledFeatures = database.define('GuildEnabledFeatures', {
  guild_id: { type: Sequelize.STRING },
  feature_id: { type: Sequelize.INTEGER },
  is_enabled: { type: Sequelize.INTEGER }

}, {tableName: 'guild_enabled_features'});


module.exports = {
  GuildEnabledFeatures,
};