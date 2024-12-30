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
const LogClasses = require('../classes/LogClasses');


const mainEvents = (client) => {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.guild) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[WARNING] Il comando ${interaction.commandName} lanciato da ${interaction.user.username} non è stato trovato.`);
      LogClasses.createLog(interaction.guild.id, 'ERRORE', `Il comando ${interaction.commandName} lanciato da ${interaction.user.username} non è stato trovato.`);
      return;
    }

    try {
      await command.execute(interaction);
      LogClasses.createLog(interaction.guild.id, 'COMANDO', `Il comando ${interaction.commandName} è stato eseguito da ${interaction.user.username}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        LogClasses.createLog(interaction.guild.id, 'ERRORE', `Errore eseguendo il comando ${interaction.commandName} da ${interaction.user.username}`);
        await interaction.followUp({ content: 'Abbiamo riscontrato un errore eseguendo questo comando! Contatta un amministratore.', ephemeral: true });
      } else {
        LogClasses.createLog(interaction.guild.id, 'ERRORE', `Errore eseguendo il comando ${interaction.commandName} da ${interaction.user.username}`);
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