const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const {token, presenceStatusName, botState} = require('./config.json');


const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

// FUNZIONE PER RECUPERARE LE CARTELLE DI ESEGUZIONE DEL CODICE
function executeFolder(mainDir) {

  const foldersPath = path.join(__dirname, mainDir);
  const commandsFolder = fs.readdirSync(foldersPath);

  for (const folder of commandsFolder) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      }
    }
  }
}

executeFolder('commands');

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