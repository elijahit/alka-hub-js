// Code: OldTickets - bin/models/OldTickets.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file OldTickets.js
 * @module OldTickets
 * @description Contiene il modello OldTickets
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const OldTickets = database.define('old_ticket_tickets', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  author_id: { type: Sequelize.STRING },
  channel_id: { type: Sequelize.STRING },
  message_id: { type: Sequelize.STRING },
  ticketPrefix: { type: Sequelize.STRING },
  ticketSystemMessage_id: { type: Sequelize.STRING },
  createdAt: { type: Sequelize.DATE },
  updatedAt: { type: Sequelize.DATE },
});


module.exports = {
  OldTickets,
};