// Code: Log - bin/models/Log.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
  * @file Log.js
  * @module Log
  * @description Contiene il modello Log
  */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Log = database.define('logs', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  reason: { type: Sequelize.STRING }
});

module.exports = {
  Log,
};