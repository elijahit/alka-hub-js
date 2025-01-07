// Code: botManager - worker/botManager.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file botManager.js
 * @module botManager
 * @description Contiene i metodi per avviare e fermare un bot Discord.
 */

const { Collection, Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } = require('discord.js');
const mainEvents = require('../bin/functions/mainEvents');
const Variables = require('../bin/classes/GlobalVariables');
const { findConfigById, findGuildById } = require('../bin/service/DatabaseService');
const emoji = require('../bin/data/emoji');
const color = require('../bin/data/colors');


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
    variables.setCommandDeploy(botConfig.commandDeploy);

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
  return client;
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

/**
 * 
 * Invia un messaggio dal bot al server più vecchio (Dovrebbe essere il primo), tramite il Worker corretto.
 */
async function sendMessageBot(configId, client, message) {
  // USAGE TEST
  // RPUSH bot_commands_queue '{"command": "dispatcher", "botId": 3, "dataCommand": "Ciao proprietario del server, ti informiamo che il tuo piano premium ▒ in scadenza tutti i benefici saranno rimossi alla scadenza, ti invitiamo a rinnovare il tuo abbonamento!", "dispatcherCommand": "send_message" }'
  try {
    let config = await findConfigById(configId);
    config = config.get({ plain: true });

    // Se è presente un main_discord_id e non è -1
    if (config && config.main_discord_id !== null && config.main_discord_id !== -1) {
      client.guilds.fetch(config.main_discord_id).then(async guild => {
        const variables = { getConfigId: () => config.id };
        let guildTable = await findGuildById(config.main_discord_id, variables);
        guildTable = guildTable?.get({ plain: true });
        const language = guildTable.language || "en";

        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${message}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        const json = await res.json();
        let translatedText = "";
        for (const element of json[0]) {
          translatedText += element[0] + " ";
        }

        if (guild.publicUpdatesChannel) {
          const embed = new EmbedBuilder();
          embed.setDescription(translatedText);
          embed.setThumbnail(emoji.general.appIcon);
          embed.setFooter({ text: "Alka Hub - System Message" });
          embed.setColor(color.general.error);
          await guild.publicUpdatesChannel.send({ content: "@everyone", embeds: [embed] });
        }
      }).catch(err => {
        console.error(`[❌] Errore durante l'invio del messaggio al server:`, err);
      });

    } else { return false; };
  } catch (error) {
    console.error(`[❌] Errore nel dispatching del comando di send message:`, error);
  }
}

module.exports = { startBot, stopBot, sendMessageBot };
