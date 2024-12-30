const pm2 = require('pm2');
const Redis = require('ioredis');
const { config } = require('./worker/config');
const { findAllConfig } = require('./bin/service/DatabaseService');


const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

redis.flushall();

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.delete('all', (err) => {
    if (err) {
      console.error('[❌] Errore durante l’eliminazione dei processi:', err);
    } else {
      console.log('[✅] Tutti i processi PM2 sono stati eliminati con successo.');
    }
    pm2.start({
      script: './worker/worker.js',
      name: `worker-app-${Date.now()}`,
      exec_mode: '',
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

  configs.forEach((config) => {
    const botConfig = {
      botName: config.botName,
      botFooter: config.botFooter,
      botFooterIcon: config.botFooterIcon,
      isActive: config.isActive,
      premium: config.premium,
      token: config.token,
      clientId: config.clientId,
      guildMainId: config.guildMainId,
      channelError: config.channelError,
      presenceStatus: config.presenceStatus,
      id: config.id,
    };

    const commandData = JSON.stringify({ command: "start", botId: botConfig.id, botConfig: botConfig });

    redis.rpush('bot_commands_queue', commandData, (err, result) => {
      if (err) {
        console.error('[❌] Errore durante l’invio del comando a bot_commands_queue:', err);
      } else {
        console.log('[✅] Comando inviato a bot_commands_queue con successo:', result);
      }
    });
  });
});    