const { Sequelize } = require('sequelize');


const database = new Sequelize('alka_bot', 'alka', 'I6STIUfJkfEoX0nl', {
  host: 'alkanetwork.eu',
  dialect: 'mysql',
});

module.exports = {
  database,
};