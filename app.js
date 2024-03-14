const fs = require('node:fs');
const path = require('node:path');
const { Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token, presenceStatusName, botState } = require('./config.json');
const { cleanerDatabase, reactionRoleCached, statisticsUpdate } = require('./bin/HandlingFunctions');
const { client } = require('./bin/client');

client.commands = new Collection();

// FUNZIONE PER RECUPERARE LE CARTELLE DI ESEGUZIONE DEL CODICE DEI MODULI
function executeFolderModule(mainDir) {
  const foldersPath = path.join(__dirname, mainDir);
  const moduleFolder = fs.readdirSync(foldersPath);

  for (const folder of moduleFolder) {
    const modulePath = path.join(foldersPath, folder);
    const eventsPathResolve = `${modulePath}/events`;
    const commandsPathResolve = `${modulePath}/command`;
    const eventsFiles = fs.readdirSync(eventsPathResolve).filter(file => file.endsWith('.js'));
    const commandFiles = fs.readdirSync(commandsPathResolve).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      try {
        const filePath = path.join(commandsPathResolve, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        }
      }
      catch {
        console.error(`[!C] ${file} non caricato`);
      }
    }
    for (const file of eventsFiles) {
      try {
        const filePath = path.join(eventsPathResolve, file);
        const event = require(filePath);
        client.on(event.name, (...args) => event.execute(...args));
      }
      catch {
        console.error(`[!E] ${file} non caricato`);
      }
    }
  }
}

// EVENT LISTNER PER I COMANDI
// Questo EVENT LISTNER serve per ascoltare i comandi che vengono lanciati con (/) slashCommands dopo averli ascoltati li invierà all'esecutore che è presente nei file dei comandi.

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

// EVENT LISTNER PER AVVIO DEL BOT

client.once(Events.ClientReady, readyClient => {
  console.clear();
  console.log('-------------------------------------');
  console.log('ALKA HUB BOT v1.0.0 BETA');
  console.log('Author: Elijah (Gabriele Mario Tosto)');
  console.log('Since: 2024');
  console.log('Technology: JavaScript - NodeJs');
  console.log('-------------------------------------');
  // FUNZIONI
  executeFolderModule('utils');


  client.user.setPresence({
    activities: [{ name: presenceStatusName, state: botState, type: ActivityType.Custom }],
    status: 'online'
  });

  // FUNZIONI DI HandlingFunction
  
  // FUNZIONE DI CLEANER PER IL DATABASE
  setInterval(async () => {
    await cleanerDatabase(client);
  }, 21600000);
  
  // FUNZIONE DI reactionRole-system
  setTimeout(async () => {
    await reactionRoleCached(client);
    console.log('[REACTION ROLES] Cache caricata con successo!');
  }, 3000);

  // FUNZIONE DI temporanea per leggere le guild
  setTimeout(async () => {
    await reactionRoleCached(client);
    console.log('[TEMPORARY FUNCS] Lista guilds caricata!');
    const guilds = await client.guilds.fetch();
    for await (let value of guilds) {
      console.log(value[1].name, value[1].id)
    }
  }, 10000);
  
  // FUNZIONE DI statsServer-system
  setInterval(async () => {
    await statisticsUpdate(client);
  }, 600000);

  // FUNCTION OTHER SYSTEM
  require('./utils/twitch-system/twitch'); //Twitch System
  require('./utils/youtube-system/youtubeApi'); //Youtube System
});


//  --------- //

client.login(token);
