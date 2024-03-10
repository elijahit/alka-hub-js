const {Client, GatewayIntentBits} = require('discord.js');

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
]});

module.exports = {client}