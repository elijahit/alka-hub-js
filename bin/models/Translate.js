// Code: bin/models/Translate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Translate.js
 * @module Translate
 * @description Contiene il modello Translate
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Translate = database.define('translates', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  mode: { type: Sequelize.INTEGER }
});

module.exports = {
  Translate,
};