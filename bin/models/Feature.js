const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Feature = database.define('features', {
  feature_name: { type: Sequelize.STRING },
  id_disabled: { type: Sequelize.INTEGER }

}, {tableName: 'features'});


module.exports = {
  Feature,
};