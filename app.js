// Code: app.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file app.js
 * @module app
 * @description Questo file gestisce l'avvio del bot!
 */

const { Collection, Client, GatewayIntentBits, Partials } = require('discord.js');
const mainEvents = require('./bin/functions/mainEvents');
const { findConfigByName } = require('./bin/service/DatabaseService');
const LogClasses = require('./bin/classes/LogClasses');
const Redis = require('ioredis');
const Variables = require('./bin/classes/GlobalVariables');
const redis = new Redis('redis://alkanetwork.eu:6379', { password: 'Aarontosto20!' });


async function processBotQueue() {
  const runtimeConsole = process.env.NODE_ENV;
  console.clear();
  console.log('\x1b[34m%s\x1b[0m', '   __    __    _  _    __      ____  _____  ____ ');
  console.log('\x1b[34m%s\x1b[0m', '  /__\\  (  )  ( )/ )  /__\\    (  _ \\(  _  )(_  _)');
  console.log('\x1b[34m%s\x1b[0m', ' /(__)\\  )(__  )  (  /(__)\\    ) _ < )(_)(   )(  ');
  console.log('\x1b[34m%s\x1b[0m', '(__)(__)(____)(_)\_) (__)(__)  (____/(_____) (__) ');
  console.log('\x1b[36m%s\x1b[0m', 'ALKA HUB BOT v2.0.0 - ALKA NETWORK - WHITE LABEL');
  console.log('\x1b[32m%s\x1b[0m', 'Author: Elijah (Gabriele Mario Tosto) <g.tosto@flazio.com>');
  console.log('\x1b[32m%s\x1b[0m', 'Since: 02/2024');
  console.log('\x1b[32m%s\x1b[0m', `Runtime: ${runtimeConsole}`);
  console.log('\x1b[32m%s\x1b[0m', 'Technology: JavaScript - Node - Discord.js');
  console.log('\x1b[32m%s\x1b[0m', 'Powered by alkanetwork.eu');
  console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
  console.log('\x1b[34m%s\x1b[0m', 'Manager Bot is now online and ready to use!');
  console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');

  while (true) {
    const botData = await redis.rpop('bot_start_queue');
    if (botData) {
      const botConfig = JSON.parse(botData);

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
      
      client.commands = new Collection();
      mainEvents(client);
      client.login(botConfig.token);

      await redis.hmset(botConfig.id, botConfig);
      LogClasses.createLog('NULL', 'INFO', 'Avvio del bot in corso');
    } else {
      console.log('[INFO] Nessun bot da avviare, attesa...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

processBotQueue();



