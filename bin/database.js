// Code: database - bin/database.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file database.js
 * @module database
 * @description Contiene la connessione al database
 */

const { Sequelize } = require('sequelize');


const database = new Sequelize('alka_bot', 'alka', '', {
  host: 'alkanetwork.eu',
  dialect: 'mysql',
});

module.exports = {
  database,
};