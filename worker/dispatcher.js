// Code: dispatcher - worker/dispatcher.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file dispatcher.js
 * @module dispatcher
 * @description Invia un comando al Worker corretto.
 */

const Redis = require('ioredis');
const {config} = require('./config');
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

/**
 * Invia un comando di stop al Worker corretto.
 */
async function dispatchStopBot(botId) {
  try {
    // Recupera le informazioni sul bot da Redis
    const botStatus = await redis.hgetall(`bot_status:${botId}`);

    if (!botStatus || !botStatus.worker) {
      console.log(`[❌] Nessuna informazione trovata per il bot con ID ${botId}`);
      return;
    }

    const workerId = botStatus.worker;
    console.log(`[🔄] Inoltro comando stop al Worker: ${workerId} per il bot: ${botId}`);

    // Inoltra il comando al Worker specifico
    await redis.lpush(`worker_commands_queue:${workerId}`, JSON.stringify({
      command: 'stop',
      botId: botId,
    }));

    console.log(`[✅] Comando stop inviato al Worker ${workerId}`);
  } catch (error) {
    console.error(`[❗] Errore nell'inoltro del comando stop:`, error);
  }
}

module.exports = {
  dispatchStopBot
};
