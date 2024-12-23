// Code: client - bin/client.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file client.js
 * @module client
 * @description Contiene il client di Discord
 */

const {Client, GatewayIntentBits, Partials} = require('discord.js');

/**
 * @constant {Client} client - Il client di Discord
 * @param {Object} intents - Gli intenti del client
 * @param {Object} partials - Le partials del client
 * @example
 * const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences], partials: [Partials.Reaction, Partials.User, Partials.Message, Partials.Channel]});
 * @returns {Client} Il client di Discord
 */
const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildVoiceStates, 
  GatewayIntentBits.GuildModeration, 
  GatewayIntentBits.GuildEmojisAndStickers, 
  GatewayIntentBits.GuildMembers, 
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildPresences,
],
partials: [Partials.Reaction,
  Partials.User,
  Partials.Message,
  Partials.Channel
]});

module.exports = {client}