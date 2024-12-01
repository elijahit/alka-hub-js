const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');
const { Feature } = require('./Feature');

const GuildEnabledFeatures = database.define('guild_enabled_features', {
  guild_id: { type: Sequelize.STRING },
  feature_id: { type: Sequelize.INTEGER },
  is_enabled: { type: Sequelize.INTEGER }

}, {tableName: 'guild_enabled_features'});


Guild.belongsToMany(Feature, { through: GuildEnabledFeatures, foreignKey: 'guild_id', otherKey: 'feature_id'});
Feature.belongsToMany(Guild, { through: GuildEnabledFeatures,  foreignKey: 'id', otherKey: 'guild_id' });

module.exports = {
  GuildEnabledFeatures,
};