const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Feature = database.define('features', {
  feature_name: { type: Sequelize.STRING }

}, {tableName: 'features'});


module.exports = {
  Feature,
};