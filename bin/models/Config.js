// Code: Config - bin/models/Config.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Config.js
 * @module Config
 * @description Contiene il modello Config
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Config = database.define('configs', {
  name: { type: Sequelize.STRING },
  owner_discord_id: { type: Sequelize.STRING },
  json: { type: Sequelize.STRING },
  isActive: { type: Sequelize.INTEGER },
  premium: { type: Sequelize.INTEGER },
  command_deploy: { type: Sequelize.INTEGER },
});

module.exports = {
  Config,
};