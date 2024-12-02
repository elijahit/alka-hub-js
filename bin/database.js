const { Sequelize } = require('sequelize');


const database = new Sequelize('alka_bot', 'alka', 'I6STIUfJkfEoX0nl', {
  host: 'alkanetwork.eu',
  dialect: 'mysql',
  query: {
    raw: true,
    nest: true,
  }
});

module.exports = {
  database,
};