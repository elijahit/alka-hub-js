const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Feature = database.define('features', {
  feature_name: { type: Sequelize.STRING },
  is_premium: { type: Sequelize.INTEGER },
  is_disabled: { type: Sequelize.INTEGER }

}, {tableName: 'features'});


module.exports = {
  Feature,
};