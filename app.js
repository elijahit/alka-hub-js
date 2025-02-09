const pm2 = require('pm2');
const fs = require('fs');
const Redis = require('ioredis');
const { config } = require('./worker/config');
const { configTemplate } = require('./bin/data/configTemplate');
const { findAllConfig } = require('./bin/service/DatabaseService');



// Controllo o creazione del file di configurazione
if (!fs.existsSync('./config.json')) {
  fs.writeFileSync('./config.json', JSON.stringify(configTemplate, null, 2));
  console.log('[✅] File di configurazione creato con successo. Modifica il file config.json con i tuoi dati.');
  process.exit(0);
}

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

const envStart = process.env.START || false;

if (!envStart) {
  console.error('[❌] Errore: START non definito. Usa npm run prod (per la produzione) o npm run dev (per il test)');
  process.exit(1);
}

if (envStart === "prod") redis.flushall();

console.clear();
console.log('\x1b[34m%s\x1b[0m', '   __    __    _  _    __      ____  _____  ____ ');
console.log('\x1b[34m%s\x1b[0m', '  /__\\  (  )  ( )/ )  /__\\    (  _ \\(  _  )(_  _)');
console.log('\x1b[34m%s\x1b[0m', ' /(__)\\  )(__  )  (  /(__)\\    ) _ < )(_)(   )(  ');
console.log('\x1b[34m%s\x1b[0m', '(__)(__)(____)(_)\_) (__)(__)  (____/(_____) (__) ');
console.log('\x1b[36m%s\x1b[0m', 'ALKA HUB BOT v2.0.0 - ALKA NETWORK - WHITE LABEL');
console.log('\x1b[32m%s\x1b[0m', 'Author: Elijah (Gabriele Mario Tosto) <g.tosto@flazio.com>');
console.log('\x1b[32m%s\x1b[0m', 'Since: 02/2024');
console.log('\x1b[32m%s\x1b[0m', 'Technology: JavaScript - Node - Discord.js');
console.log('\x1b[32m%s\x1b[0m', 'Powered by alkanetwork.eu');
console.log('\x1b[32m%s\x1b[0m', 'Environment:', envStart === 'prod' ? 'Produzione' : 'Test');
console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
console.log('\x1b[34m%s\x1b[0m', `App in avvio... Creazione Woker principale.`);
console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.delete('all', (err) => {
    if (err) {
      console.error('[❌] Errore durante l’eliminazione dei processi');
    } else {
      console.log('[✅] Tutti i processi PM2 sono stati eliminati con successo.');
    }
    pm2.start({
      script: './worker/worker.js',
      name: `${config.worker.workerId}`,
      exec_mode: '',
      env: {WORKER_ID: config.worker.workerId }
    }, function (err, apps) {
      pm2.disconnect();   // Disconnects from PM2
      if (err) {
        console.error('[❌] Errore durante la creazione del worker default:', err);
      } else {
        console.log('[✅] Worker default avviato.');
      }
    });
  });
});


findAllConfig().then((configs) => {
  configs.forEach((configBot) => {
    const start = envStart === 'prod' ? configBot.isActive == 1 : configBot.isActive == 2;
    if (start) {
      const configJson = JSON.parse(configBot.json)
      const botConfig = {
        botName: configJson.botName,
        botFooter: configJson.botFooter,
        botFooterIcon: configJson.botFooterIcon,
        isActive: configBot.isActive,
        premium: configBot.premium,
        token: configJson.token,
        clientId: configJson.clientId,
        presenceStatus: configJson.presenceStatus,
        commandDeploy: configBot.command_deploy,
        id: configBot.id,
      };

      const commandData = JSON.stringify({ command: "start", botId: botConfig.id, botConfig: botConfig });

      if (envStart === "prod") {
        redis.rpush('bot_commands_queue', commandData, (err, result) => {
          if (err) {
            console.error('[❌] Errore durante l’invio del comando a bot_commands_queue:', err);
          } else {
            console.log('[✅] Comando inviato a bot_commands_queue con successo config:', configBot.id);
          }
        });
      } else if(envStart === "test") {
        redis.rpush(`worker_commands_queue:${config.worker.workerId}`, commandData, (err, result) => {
          if (err) {
            console.error('[❌] Errore durante l’invio del comando a worker_commands_queue:', err);
          } else {
            console.log('[✅] Comando inviato a worker_commands_queue con successo config:', configBot.id);
          }
        });
      }
    }
  });
});    