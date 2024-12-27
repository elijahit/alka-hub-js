// Code: Statistics - bin/models/StatisticsCategory.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file StatisticsCategory.js
 * @module StatisticsCategory
 * @description Contiene il modello StatisticsCategory
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const StatisticsCategory = database.define('statistics_category', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  category_id: { type: Sequelize.STRING }
}, {tableName: 'statistics_category'});

module.exports = {
  StatisticsCategory,
};