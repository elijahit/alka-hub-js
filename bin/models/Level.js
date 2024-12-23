// Code: Level - bin/models/Level.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Level.js
 * @module Level
 * @description Contiene il modello Level
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Level = database.define('levels', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  user_id: { type: Sequelize.STRING },
  exp: { type: Sequelize.INTEGER },
  joined_time: { type: Sequelize.DATE },
  minute_vocal: { type: Sequelize.INTEGER },
  message_count: { type: Sequelize.INTEGER },
  level: { type: Sequelize.INTEGER }
});

module.exports = {
  Level,
};