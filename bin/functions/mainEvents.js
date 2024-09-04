const { Events, ActivityType } = require('discord.js');
const executeFolderModule = require('./executeFunctions');
const { presenceStatusName, botState } = require('../../config.json');

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
  
  client.once(Events.ClientReady, readyClient => {
    const runtimeConsole = process.env.NODE_ENV === 'production' ? "production" : process.env.NODE_ENV === 'development' ? "development" : "";
    console.clear();
    console.log('-------------------------------------');
    console.log('ALKA HUB BOT v2.0.0 REWORK / BETA');
    console.log('Author: Elijah (Gabriele Mario Tosto)');
    console.log('Contributors: Nico995 (Nicola Occelli)');
    console.log('Since: 2024');
    console.log(`Runtime: ${runtimeConsole}`);
    console.log('Technology: JavaScript - Node - Discord.js');
    console.log('Web: https://alkanetwork.eu');
    console.log('-------------------------------------');
    // FUNZIONI
    executeFolderModule(client, 'utils');
  
  
    client.user.setPresence({
      activities: [{ name: presenceStatusName, state: botState, type: ActivityType.Custom }],
      status: 'online'
    });
  })
}

module.exports = mainEvents;