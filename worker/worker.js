// Code: worker - worker/worker.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file worker.js
 * @module worker
 * @description Worker per la gestione dei bot
 */

const Redis = require('ioredis');
const { startBot, stopBot } = require('./botManager');
const { config } = require('./config');
const pm2 = require('pm2');
const { findConfigById } = require('../bin/service/DatabaseService');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});
const activeBots = new Map();
let workerStartAllow = true;
let generatedWorker = false;



const workerId = process.env.WORKER_ID || false;

if (!process.env.WORKER_ID) {
  console.error('[❌] Errore: WORKER_ID non definito.');
  process.exit(1);
}


async function getBotsForCurrentWorker() {
  try {
    // Ottieni tutte le chiavi che corrispondono a bot_status:*
    const keys = await redis.keys('bot_status:*');

    for (const key of keys) {
      const botStatus = await redis.hgetall(key);
      if (botStatus.worker === workerId && botStatus.status === 'running') {
        let configBot = await findConfigById(botStatus.botId);
        configBot = configBot?.get({ plain: true });
        if (!configBot) {
          console.error(`[❌] Configurazione non trovata per il bot ${botStatus.botId}.`);
          continue;
        }

        const configJson = JSON.parse(configBot.json)
        const botConfig = {
          botName: configJson.botName,
          botFooter: configJson.botFooter,
          botFooterIcon: configJson.botFooterIcon,
          isActive: configBot.isActive,
          premium: configBot.premium,
          token: configJson.token,
          clientId: configJson.clientId,
          guildMainId: configJson.guildMainId,
          channelError: configJson.channelError,
          presenceStatus: configJson.presenceStatus,
          id: configBot.id,
        };

        const commandData = JSON.stringify({ command: "start", botId: botConfig.id, botConfig: botConfig });

        redis.rpush(`worker_commands_queue:${workerId}`, commandData, async (err, result) => {
          if (err) {
            console.error(`[❌] Errore durante l’invio del comando a worker_commands_queue:${workerId}:`, err);
          } else {
            console.log(`[✅] Comando inviato a worker_commands_queue:${workerId} con successo bot ID:`, configBot.id);
          }
        });
      }
    }

  } catch (error) {
    console.error('Errore durante il recupero dei bot per il worker corrente:', error);
  }
}


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
  console.log('\x1b[34m%s\x1b[0m', `Worker ${workerId} avviato. In ascolto sulla coda principale...`);
  console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
  while (true) {
    try {
      // Comandi generici dalla coda globale
      let commandData
      if(workerStartAllow) commandData = await redis.rpop('bot_commands_queue');

      // Comandi specifici per questo Worker
      const specificCommand = await redis.rpop(`worker_commands_queue:${workerId}`);

      const data = commandData || specificCommand;
      if (data) {
        const { command, botId, botConfig } = JSON.parse(data);

        switch (command) {
          case 'start':
            // 0 = Inattivo, 1 = Attivo, 2 = Test Bot
            if (botConfig.isActive == 0) break;

            const status = await redis.hget(`bot_status:${botId}`, 'status');
            if (status === 'running' && botConfig.isActive !== 2) {
              console.warn(`[⚠️] Il bot ${botId} è già in esecuzione.`);
              break;
            }


            if (activeBots.size >= config.worker.maxBot && generatedWorker === false) {
              console.warn(`[⚠️] Limite massimo di bot (${config.worker.maxBot}) raggiunto.`);
              workerStartAllow = false;
              generatedWorker = true;
              redis.rpush('bot_commands_queue', data, (err, result) => {
                if (err) {
                  console.error('[❌] Errore durante l’invio del comando a bot_commands_queue:', err);
                } else {
                  console.log('[✅] Comando reinserito nella bot_commands_queue con successo:', result);
                }
              });
              pm2.connect(function (err) {
                if (err) {
                  console.error(err);
                  return;
                }

                pm2.start({
                  script: './worker/worker.js',
                  name: `${config.worker.workerId}`,
                  exec_mode: 'fork',
                  env: {WORKER_ID: config.worker.workerId }
                }, function (err, apps) {
                  pm2.disconnect();
                  if (err) {
                    console.error('[❌] Errore durante la creazione del worker default:', err);
                  } else {
                    console.log('[✅] Worker aggiuntivo avviato.');
                  }
                });
              });
              break;
            } 

            if (workerStartAllow) {
              startBot(botConfig);
              activeBots.set(botId, botConfig);
              await redis.hset(`bot_status:${botId}`, {
                status: 'running',
                botId: botId,
                worker: workerId,
                uptime: new Date().toISOString(),
              });
              break;
            }
            break;

          case 'stop':
            stopBot(botId);
            activeBots.delete(botId);
            workerStartAllow = true;
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
    await redis.hset(`worker_status:${workerId}`, {
      status: 'running',
      uptime: new Date().toISOString(),
      botCount: activeBots.size,
    });
  }, 10000); // Aggiorna ogni 10 secondi
}

monitorWorkerHealth();
getBotsForCurrentWorker()
processQueue();
