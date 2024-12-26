// Code: ReactionRole - bin/models/ReactionRole.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file ReactionRole.js
 * @module ReactionRole
 * @description Contiene il modello ReactionRole
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const ReactionRole = database.define('reaction_roles', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.INTEGER },
  role_id: { type: Sequelize.STRING },
  emoji: { type: Sequelize.STRING },
  message_id: { type: Sequelize.STRING }
});


module.exports = {
  ReactionRole,
};