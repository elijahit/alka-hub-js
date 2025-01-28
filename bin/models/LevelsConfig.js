// Code: LevelsConfig - bin/models/LevelsConfig.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LevelsConfig.js
 * @module LevelsConfig
 * @description Contiene il modello LevelsConfig
 */


const { database } = require('../database');
const { Sequelize } = require('sequelize');

const LevelsConfig = database.define('levels_config', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  log_channel: { type: Sequelize.STRING }
}, {tableName: 'levels_config'});

module.exports = {
  LevelsConfig,
};