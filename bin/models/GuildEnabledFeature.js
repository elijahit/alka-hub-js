// Code: GuildEnabledFeature - bin/models/GuildEnabledFeature.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file GuildEnabledFeature.js
 * @module GuildEnabledFeature
 * @description Contiene il modello GuildEnabledFeature
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const GuildEnabledFeature = database.define('GuildEnabledFeatures', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  feature_id: { type: Sequelize.INTEGER },
  is_enabled: { type: Sequelize.INTEGER }

}, {tableName: 'guild_enabled_features'});


module.exports = {
  GuildEnabledFeature,
};