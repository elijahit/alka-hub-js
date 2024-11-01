const {Client, GatewayIntentBits, Partials} = require('discord.js');

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