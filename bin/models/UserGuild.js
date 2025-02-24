// Code: UserGuild - bin/models/UserGuild.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file UserGuild.js
 * @module UserGuild
 * @description Contiene il modello UserGuild
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');
const { Guild } = require('./Guild');
const { User } = require('./User');

const UserGuild = database.define('users_guilds', {
  user_id: { type: Sequelize.STRING },
  guild_id: { type: Sequelize.STRING }

}, {tableName: 'users_guilds'});


module.exports = {
  UserGuild,
};