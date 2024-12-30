// Code: worker - worker/worker.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file worker.js
 * @module worker
 * @description Worker per la gestione dei bot
 */

const Redis = require('ioredis');
const { startBot, stopBot } = require('./botManager');
const {config} = require('./config');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

const activeBots = new Map();

async function processQueue() {
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
  console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
  console.log('\x1b[34m%s\x1b[0m', `Worker ${config.worker.workerId} avviato. In ascolto sulla coda principale...`);
  console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');

  while (true) {
    try {
      // Comandi generici dalla coda globale
      const commandData = await redis.rpop('bot_commands_queue');

      // Comandi specifici per questo Worker
      const specificCommand = await redis.rpop(`worker_commands_queue:${config.worker.workerId}`);

      const data = commandData || specificCommand;

      if (data) {
        const { command, botId, botConfig } = JSON.parse(data);

        switch (command) {
          case 'start':
            if (activeBots.size >= config.worker.maxBot) {
              console.warn(`[⚠️] Limite massimo di bot (${config.worker.maxBots}) raggiunto.`);
              continue;
            }
            await startBot(botConfig);
            activeBots.set(botId, botConfig);
            await redis.hset(`bot_status:${botId}`, {
              status: 'running',
              worker: config.worker.workerId,
              uptime: new Date().toISOString(),
            });
            break;

          case 'stop':
            await stopBot(botId);
            activeBots.delete(botId);
            await redis.hdel(`bot_status:${botId}`);
            break;

          default:
            console.log(`[❓] Comando sconosciuto: ${command}`);
        }
      } else {
        // Attendi prima di rieseguire il ciclo
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`[❗] Errore nella gestione dei comandi:`, error);
      await new Promise((resolve) => setTimeout(resolve, config.worker.retryDelay));
    }
  }
}

async function monitorWorkerHealth() {
  setInterval(async () => {
    await redis.hset(`worker_status:${config.worker.workerId}`, {
      status: 'running',
      uptime: new Date().toISOString(),
      botCount: activeBots.size,
    });
  }, 10000); // Aggiorna ogni 10 secondi
}

monitorWorkerHealth();
processQueue();
