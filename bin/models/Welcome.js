// Code: Welcome - bin/models/Welcome.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Welcome.js
 * @module Welcome
 * @description Contiene il modello Welcome
 */


const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Welcome = database.define('welcome', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  channel_id: { type: Sequelize.STRING },
  color: { type: Sequelize.INTEGER },
  background_url: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING }
}, {tableName: 'welcome'});


module.exports = {
  Welcome,
};