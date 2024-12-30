const Redis = require('ioredis');
const { findConfigByName } = require('./bin/service/DatabaseService');
const Variables = require('./bin/classes/GlobalVariables');
const mainEvents = require('./bin/functions/mainEvents');
const LogClasses = require('./bin/classes/LogClasses');
const redis = new Redis('redis://alkanetwork.eu:6379', { password: 'Aarontosto20!' });

if (process.env.NODE_ENV == "test") {
  findConfigByName("alka-dev").then(v => {
    if (v) {
      const config = v.get({ plain: true });

      const configObj = JSON.parse(config.json);
      if (configObj?.botName == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro botName assente');
      if (configObj?.botFooter == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro botFooter assente');
      if (configObj?.token == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro token assente');
      if (configObj?.clientId == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro clientId assente');
      if (configObj?.guildMainId == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro guildMainId assente');
      if (configObj?.channelError == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro channelError assente');
      if (configObj?.presenceStatus == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro presenceStatus assente');
      if (configObj?.botFooterIcon == undefined) return console.error('[ERRORE] Configurazione JSON non esatta parametro presenceStatus assente');

      // Imposto le variabili globali
      if (config.isActive == 1) {
        redis.lpush('bot_start_queue', JSON.stringify({isActive: config.isActive, id: config.id, ...configObj}));
      } else {
        (async () => {
          await LogClasses.createLog('NULL', 'ERRORE-AVVIO', 'Impossibile avviare il bot il suo stato non è attivo.');
          console.error('[ERRORE] Impossibile avviare il bot il suo stato non è attivo.');
          process.exit(0);
        })();
      }
    } else {
      console.error('[ERRORE] Impossibile avviare il bot nessuna configurazione trovata.');
      process.exit(0);
    }
  });

} else {
  console.error('[ERRORE] Impossibile avviare il bot env assente.');
  process.exit(0);
}