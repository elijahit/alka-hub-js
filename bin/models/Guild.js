// Code: Guild - bin/models/Guild.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Guild.js
 * @module Guild
 * @description Contiene il modello Guild
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Guild = database.define('guilds', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  language: { type: Sequelize.STRING },
  premium: { type: Sequelize.INTEGER },
  time_zone: { type: Sequelize.STRING }
});

module.exports = {
  Guild,
};