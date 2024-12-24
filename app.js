const fs = require('node:fs');
const path = require('node:path');
const { Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token, presenceStatusName, botState } = require('./config.json');
const { cleanerDatabase, reactionRoleCached, statisticsUpdate } = require('./bin/HandlingFunctions');
const { client } = require('./bin/client');
const { checkGiveawayTiming } = require('./utils/giveaway-system/giveawayTiming');

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

// ERROR LISTENER
client.on(Events.ShardError, error => {
  console.log(error);
})

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

  let count = 0;
  const presenceArray = ["👷‍♂️ by alkanetwork.eu", "🕵️‍♀️ Multibot and multilanguage",
    "🎫 Tickets - Logs and more", "💸 buy a custom bot now", "🤯 try me with /help",
    "😏 custom bot start 1.99€", "💨 2.0.0 in coming!"];

  if (presenceArray.length == 1) {
    client.user.setPresence({
      activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
      status: 'online'
    });
  } else {
    setInterval(async () => {
      
      client.user.setPresence({
        activities: [{ name: presenceArray[count], state: presenceArray[count], type: ActivityType.Custom }],
        status: 'online'
      });
      count = count + 1;
      if (count == count - 1) {
        count = 0;
      }
    }, 5000);
  }

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

  // FUNZIONE DI statsServer-system
  setInterval(async () => {
    await statisticsUpdate(client);
  }, 600000);

  // FUNZIONE DI giveaway-system
  setInterval(async () => {
    await checkGiveawayTiming();
  }, 60000);

  // FUNCTION OTHER SYSTEM
  require('./utils/twitch-system/twitch'); //Twitch System
  require('./utils/youtube-system/youtubeApi'); //Youtube System
});


//  --------- //

client.login(token);
