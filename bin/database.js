// Code: database - bin/database.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file database.js
 * @module database
 * @description Contiene la connessione al database
 */

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');
const configJson = fs.readFileSync(configPath, 'utf8');
const configFile = JSON.parse(configJson);

const database = new Sequelize(configFile.database.database, configFile.database.user, 
  configFile.database.password, {
  host: configFile.database.host,
  dialect: configFile.database.dialect,
});

module.exports = {
  database,
};