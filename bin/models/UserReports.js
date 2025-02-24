// Code: bin/models/UserReports.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file UserReports.js
 * @module UserReports
 * @description Contiene il modello UserReports
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const UserReports = database.define('user_reports', {
  user_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.STRING },
  reports: { type: Sequelize.INTEGER },
  reason: { type: Sequelize.STRING },
  isVerified: { type: Sequelize.INTEGER },

}, {tableName: 'user_reports'});


module.exports = {
  UserReports,
};