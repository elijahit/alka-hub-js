// Code: mainEvents - bin/functions/mainEvents.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file mainEvents.js
 * @module mainEvents
 * @description Contiene il metodo {mainEvents}
 */

const { Events, ActivityType } = require('discord.js');
const executeFolderModule = require('./executeFunctions');
const LogClasses = require('../classes/LogClasses');


const mainEvents = async (client, variables) => {
  await client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.guild) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[WARNING] Il comando ${interaction.commandName} lanciato da ${interaction.user.username} non è stato trovato.`);
      LogClasses.createLog(interaction.guild.id, 'ERRORE', `Il comando ${interaction.commandName} lanciato da ${interaction.user.username} non è stato trovato.`, variables);
      return;
    }

    try {
      await command.execute(interaction, variables);
      LogClasses.createLog(interaction.guild.id, 'COMANDO', `Il comando ${interaction.commandName} è stato eseguito da ${interaction.user.username}`, variables);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        LogClasses.createLog(interaction.guild.id, 'ERRORE', `Errore eseguendo il comando ${interaction.commandName} da ${interaction.user.username}`, variables);
        await interaction.followUp({ content: 'Abbiamo riscontrato un errore eseguendo questo comando! Contatta un amministratore.', ephemeral: true });
      } else {
        LogClasses.createLog(interaction.guild.id, 'ERRORE', `Errore eseguendo il comando ${interaction.commandName} da ${interaction.user.username}`, variables);
        await interaction.reply({ content: 'Abbiamo riscontrato un errore eseguendo questo comando! Contatta un amministratore.', ephemeral: true });
      }
    }
  });

  // ERROR LISTENER
  await client.on(Events.ShardError, error => {
    console.log(error);
  })

  // EVENT LISTNER PER AVVIO DEL BOT

  await client.once(Events.ClientReady, async readyClient => {
    // FUNZIONI
    await executeFolderModule(client, 'utils', variables);

    const presenceArray = variables.getPresenceStatus();
    if(presenceArray.length == 1) {
      await client.user.setPresence({
        activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
        status: 'online'
      });
    } else {
      setInterval(async () => {
        const count = variables.getPresenceCounter();
        await client.user.setPresence({
          activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
          status: 'online'
        });
        variables.setPresenceCounter(count + 1)
        if (count == presenceArray.length-1) {
          variables.setPresenceCounter(0);
        }
      }, 5000);
    }
  })
}

module.exports = mainEvents;