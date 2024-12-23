// Code: AutoRoles - bin/models/AutoRoles.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file AutoRoles.js
 * @module AutoRoles
 * @description Contiene il modello AutoRoles
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const AutoRoles = database.define('auto_roles', {
  role_id: { type: Sequelize.STRING }
});


module.exports = {
  AutoRoles,
};