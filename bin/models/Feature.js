// Code: Feature - bin/models/Feature.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file Feature.js
 * @module Feature
 * @description Contiene il modello Feature
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Feature = database.define('features', {
  feature_name: { type: Sequelize.STRING },
  is_premium: { type: Sequelize.INTEGER },
  is_disabled: { type: Sequelize.INTEGER },
  premium_limitation: { type: Sequelize.INTEGER }

}, {tableName: 'features'});


module.exports = {
  Feature,
};