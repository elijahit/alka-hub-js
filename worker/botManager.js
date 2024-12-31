// Code: botManager - worker/botManager.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file botManager.js
 * @module botManager
 * @description Contiene i metodi per avviare e fermare un bot Discord.
 */

const { Collection, Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const mainEvents = require('../bin/functions/mainEvents');
const Variables = require('../bin/classes/GlobalVariables');
const { dispatchStopBot } = require('./dispatcher');


/**
 * Avvia un bot Discord.
 */
async function startBot(botConfig) {
  const client = new Client({
    intents: [
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
    ]
  });

  try {

    let variables = new Variables();

    variables.setBotName(botConfig.botName);
    variables.setBotFooter(botConfig.botFooter);
    variables.setBotFooterIcon(botConfig.botFooterIcon);
    variables.setIsActive(botConfig.isActive);
    variables.setPremium(botConfig.premium);
    variables.setToken(botConfig.token);
    variables.setClientId(botConfig.clientId);
    variables.setGuildMainId(botConfig.guildMainId);
    variables.setChannelError(botConfig.channelError);
    variables.setPresenceStatus(botConfig.presenceStatus);
    variables.setConfigId(botConfig.id);
    variables.setNameConfiguration(botConfig.botName);

    client.commands = new Collection();
    await mainEvents(client, variables);
    await client.login(botConfig.token);
    client.user.setPresence({
      activities: [{ name: "Loading...", state: "Loading...", type: ActivityType.Custom }],
      status: 'idle'
    });
    console.log(`[⚠] Bot ${botConfig.botName} (${botConfig.id}) avvio in corso...`);
  } catch (error) {
    console.error(`[❌] Errore nell'avvio del bot ${botConfig.botName}:`, error);
  }
}

/**
 * Arresta un bot Discord.
 */
async function stopBot(botId) {
  try {
    await dispatchStopBot(botId);
  } catch (error) {
    console.error(`[❌] Errore nel dispatching del comando di stop:`, error);
  }
}

module.exports = { startBot, stopBot };
