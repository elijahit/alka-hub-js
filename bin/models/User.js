const { database } = require('../database');
const { Sequelize } = require('sequelize');

const User = database.define('users', {
  user_id: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING }

}, {tableName: 'users'});


module.exports = {
  User,
};