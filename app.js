const {Client, Events, GatewayIntentBits, Activity, ActivityType} = require('discord.js');
const {token, presenceStatusName, botState} = require('./config.json');


const client = new Client({intents: [GatewayIntentBits.Guilds]});

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
  })
});

client.login(token);