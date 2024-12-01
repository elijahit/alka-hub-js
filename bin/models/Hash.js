const { database } = require('../database');
const { Sequelize } = require('sequelize');

const Hash = database.define('hash', {
  hash_name: { type: Sequelize.STRING }

}, {tableName: 'hash'});


module.exports = {
  Hash,
};