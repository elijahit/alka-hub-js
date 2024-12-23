// Code: Role - bin/models/Role.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Role.js
 * @module Role
 * @description Contiene il modello Role
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Role = database.define('roles', {
  role_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.STRING }
});


module.exports = {
  Role,
};