const { Collection } = require('discord.js');
const { client } = require('./bin/client');
const Variables = require('./bin/classes/GlobalVariables');
const mainEvents = require('./bin/functions/mainEvents');
const {findConfigByName} = require('./bin/service/DatabaseService');

if(process.env.NODE_ENV) {
  findConfigByName(process.env.NODE_ENV).then(v => {
    if(v) {
      const config = v.get({plain: true});
      if(config.isActive == 1 && config.premium == 1) {
        client.commands = new Collection();
        mainEvents(client);
        const configObj = JSON.parse(config.json);
        
        // Imposto le variabili globali
        Variables.setIsActive(1);
        Variables.setPremium(1);
        Variables.setToken(configObj.token);
        Variables.setClientId(configObj.clientId);
        Variables.setGuildMainId(configObj.guildMainId);
        Variables.setChannelError(configObj.channelError);
        Variables.setPresenceStatus(configObj.presenceStatus);

        client.login(configObj.token);
      } else {
        console.error('[ERRORE] Impossibile avviare il bot il suo stato non è attivo.');
      }
    } else {
      console.error('[ERRORE] Impossibile avviare il bot nessuna configurazione trovata.');
    }
  });

} else {
  console.error('[ERRORE] Impossibile avviare il bot di env assente');
}


