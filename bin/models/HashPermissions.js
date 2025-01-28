// Code: HashPermissions - bin/models/HashPermissions.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file HashPermissions.js
 * @module HashPermissions
 * @description Contiene il modello HashPermissions
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const HashPermissions = database.define('hash_permissions', {
  permission_id: { type: Sequelize.INTEGER },
  hash_id: { type: Sequelize.INTEGER }

}, {tableName: 'hash_permissions'});


module.exports = {
  HashPermissions,
};