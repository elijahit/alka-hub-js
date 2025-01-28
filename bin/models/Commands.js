// Code: Commands - bin/models/Commands.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Commands.js
 * @module Commands
 * @description Contiene il modello Commands
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Commands = database.define('commands', {
  feature_id: { type: Sequelize.INTEGER },
  name: { type: Sequelize.STRING },
  feature_folder: { type: Sequelize.STRING },
  next_update: { type: Sequelize.INTEGER }
});

module.exports = {
  Commands,
};