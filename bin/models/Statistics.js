// Code: Statistics - bin/models/Statistics.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Statistics.js
 * @module Statistics
 * @description Contiene il modello Statistics
 */

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