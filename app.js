const { Collection } = require('discord.js');
const { client } = require('./bin/client');
const Variables = require('./bin/classes/GlobalVariables');
const mainEvents = require('./bin/functions/mainEvents');
const {findConfigByName} = require('./bin/service/DatabaseService');

if(process.env.NODE_ENV) {
  findConfigByName(process.env.NODE_ENV).then(v => {
    if(v) {
      const config = v.get({plain: true});
      if(config.isActive == 1) {
        const configObj = JSON.parse(config.json);
        if(configObj?.botName == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro botName assente');
        if(configObj?.botFooter == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro botFooter assente');
        if(configObj?.token == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro token assente');
        if(configObj?.clientId == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro clientId assente');
        if(configObj?.guildMainId == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro guildMainId assente');
        if(configObj?.channelError == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro channelError assente');
        if(configObj?.presenceStatus == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro presenceStatus assente');
        if(configObj?.botFooterIcon == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro presenceStatus assente');
        client.commands = new Collection();
        mainEvents(client);

        // Imposto le variabili globali
        Variables.setNameConfiguration(process.env.NODE_ENV);
        Variables.setBotName(configObj.botName);
        Variables.setBotFooter(configObj.botFooter);
        Variables.setBotFooterIcon(configObj.botFooterIcon);
        Variables.setIsActive(1);
        Variables.setPremium(config.premium);
        Variables.setToken(configObj.token);
        Variables.setClientId(configObj.clientId);
        Variables.setGuildMainId(configObj.guildMainId);
        Variables.setChannelError(configObj.channelError);
        Variables.setPresenceStatus(configObj.presenceStatus);
        Variables.setConfigId(config.id);

        client.login(configObj.token);
      } else {
        console.error('[ERRORE] Impossibile avviare il bot il suo stato non è attivo.');
        process.exit(0);
      }
    } else {
      console.error('[ERRORE] Impossibile avviare il bot nessuna configurazione trovata.');
      process.exit(0);
    }
  });

} else {
  console.error('[ERRORE] Impossibile avviare il bot di env assente');
  process.exit(0);
}


