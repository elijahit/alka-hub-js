// Code: Permissions - bin/models/Permissions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Permissions.js
 * @module Permissions
 * @description Contiene il modello Permissions
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Permissions = database.define('permissions', {
  permission_name: { type: Sequelize.STRING }

}, {tableName: 'permissions'});


module.exports = {
  Permissions,
};