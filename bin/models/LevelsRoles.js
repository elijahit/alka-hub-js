// Code: LevelsRoles - bin/models/LevelsRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file LevelsRoles.js
 * @module LevelsRoles
 * @description Contiene il modello per la tabella levels_roles
 */



const { database } = require('../database');
const { Sequelize } = require('sequelize');

const LevelsRoles = database.define('levels_roles', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  role_id: { type: Sequelize.STRING },
  level: { type: Sequelize.INTEGER }
}, {tableName: 'levels_roles'});

module.exports = {
  LevelsRoles,
};