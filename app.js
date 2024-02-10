const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const {token, presenceStatusName, botState} = require('./config.json');


const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

// FUNZIONE PER RECUPERARE LE CARTELLE DI ESEGUZIONE DEL CODICE
function executeFolderCommand(mainDir) {

  const foldersPath = path.join(__dirname, mainDir);
  const commandsFolder = fs.readdirSync(foldersPath);

  for (const folder of commandsFolder) {
    const commandsPath = path.join(foldersPath, folder);
    try {
      const commandFiles = fs.readdirSync(commandsPath+"/command").filter(file => file.endsWith('.js'));
      for(const file of commandFiles) {
        const filePath = path.join(commandsPath+"/command", file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        }
      }
    }
    catch {
      console.error(`${commandsPath} - nessun comando trovato.`);
    }
  }
}

executeFolderCommand('utils');

// EVENT LISTNER PER I COMANDI
// Questo EVENT LISTNER serve per ascoltare i comandi che vengono lanciati con (/) slashCommands dopo averli ascoltati li invierà all'esecutore che è presente nei file dei comandi.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Il comando ${interaction.commandName} non è stato trovato.`);
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

// EVENT LISTNER PER AVVIO DEL BOT

client.once(Events.ClientReady, readyClient => {
  console.clear();
  console.log('-------------------------------------');
  console.log('ALKA HUB BOT v1.0.0 BETA');
  console.log('Author: Elijah (Gabriele Mario Tosto)');
  console.log('Since: 2024');
  console.log('Technology: JavaScript - NodeJs');
  console.log('-------------------------------------');


  client.user.setPresence({
  activities: [{name: presenceStatusName, state: botState, type: ActivityType.Custom}],
  status: 'online'
  });
});


client.login(token);