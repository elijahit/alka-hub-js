// Code: mainEvents - bin/functions/mainEvents.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file mainEvents.js
 * @module mainEvents
 * @description Contiene il metodo {mainEvents}
 */

const { Events, ActivityType } = require('discord.js');
const executeFolderModule = require('./executeFunctions');
const Variables = require('../classes/GlobalVariables');


const mainEvents = (client) => {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.guild) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[WARNING] Il comando ${interaction.commandName} lanciato da ${interaction.user.username} non è stato trovato.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Abbiamo riscontrato un errore eseguendo questo comando! Contatta un amministratore.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Abbiamo riscontrato un errore eseguendo questo comando! Contatta un amministratore.', ephemeral: true });
      }
    }
  });

  // ERROR LISTENER
  client.on(Events.ShardError, error => {
    console.log(error);
  })

  // EVENT LISTNER PER AVVIO DEL BOT

  client.once(Events.ClientReady, async readyClient => {
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
    console.log('\x1b[32m%s\x1b[0m', `Config: ${Variables.getBotName()}(${Variables.getConfigId()})`);
    console.log('\x1b[32m%s\x1b[0m', `Piano: ${Variables.getPremium() == 0 ? "Free" : "Premium"}`);
    console.log('\x1b[32m%s\x1b[0m', `ClientId: ${Variables.getClientId()}`);
    console.log('\x1b[32m%s\x1b[0m', 'Technology: JavaScript - Node - Discord.js');
    console.log('\x1b[32m%s\x1b[0m', 'Powered by alkanetwork.eu');
    console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
    console.log('\x1b[34m%s\x1b[0m', 'Bot is now online and ready to use!');
    console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
    // FUNZIONI
    executeFolderModule(client, 'utils');

    const presenceArray = Variables.getPresenceStatus();
    if(presenceArray.length == 1) {
      await client.user.setPresence({
        activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
        status: 'online'
      });
    } else {
      setInterval(async () => {
        const count = Variables.getPresenceCounter();
        await client.user.setPresence({
          activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
          status: 'online'
        });
        Variables.setPresenceCounter(count + 1)
        if (count == presenceArray.length-1) {
          Variables.setPresenceCounter(0);
        }
      }, 5000);
    }
  })
}

module.exports = mainEvents;