// Code: OldTicketsMessage - bin/models/OldTicketsMessage.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file OldTicketsMessage.js
 * @module OldTicketsMessage
 * @description Contiene il modello OldTicketsMessage
 */

const { database } = require('../database');
const { Sequelize } = require('sequelize');

const OldTicketsMessage = database.define('old_ticket_messages', {
  config_id: { type: Sequelize.INTEGER },
  guild_id: { type: Sequelize.STRING },
  channel_id: { type: Sequelize.STRING },
  message_id: { type: Sequelize.STRING },
  category_id: { type: Sequelize.STRING },
  transcript_id: { type: Sequelize.STRING },
  initAuthorId: { type: Sequelize.STRING },
  initDescription: { type: Sequelize.STRING },
  initTitle: { type: Sequelize.STRING },
  initChannel: { type: Sequelize.STRING }
});


module.exports = {
  OldTicketsMessage,
};