const { Collection } = require('discord.js');
const { token, tokenDev } = require('./config.json');
const { client } = require('./bin/client');
const mainEvents = require('./bin/functions/mainEvents');

client.commands = new Collection();

mainEvents(client);

const filterToken = process.env.NODE_ENV === 'production' ? token : process.env.NODE_ENV === 'development' ? tokenDev : "";

client.login(filterToken);
