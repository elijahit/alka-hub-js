// Code: Hash - bin/models/Hash.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Hash.js
 * @module Hash
 * @description Contiene il modello Hash
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Hash = database.define('hash', {
  hash_name: { type: Sequelize.STRING }

}, {tableName: 'hash'});


module.exports = {
  Hash,
};