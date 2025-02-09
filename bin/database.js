// Code: database - bin/database.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file database.js
 * @module database
 * @description Contiene la connessione al database
 */

const { Sequelize } = require('sequelize');
const configJson = fs.readFileSync('../config.json', 'utf8');
const configFile = JSON.parse(configJson);

const database = new Sequelize(configFile.database.database, configFile.database.user, 
  configFile.database.password, {
  host: configFile.database.host,
  dialect: configFile.database.dialect,
});

module.exports = {
  database,
};