// Code: User - bin/models/User.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file User.js
 * @module User
 * @description Contiene il modello User
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const User = database.define('users', {
  user_id: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  state: { type: Sequelize.INTEGER },

}, {tableName: 'users'});


module.exports = {
  User,
};