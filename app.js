// Code: APP - app.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file app.js
 * @module app
 * @description Start of the Alka Hub Bot application
 */

const pm2 = require('pm2');
const fs = require('fs');
const Redis = require('ioredis');

// Check or create the configuration file
const checkConfigApp = require('./bin/functions/checkConfigApp');
checkConfigApp();
// end of configuration file check

const { findAllConfig } = require('./bin/service/DatabaseService');
const { config } = require('./worker/config');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

const envStart = process.env.START || false;

if (!envStart) {
  console.error('[❌] Error: START not defined. Use npm run prod (for production) or npm run dev (for testing)');
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
console.log('\x1b[32m%s\x1b[0m', 'Environment:', envStart === 'prod' ? 'Production' : 'Test');
console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');
console.log('\x1b[34m%s\x1b[0m', `App starting... Creating main Worker.`);
console.log('\x1b[34m%s\x1b[0m', '-------------------------------------');

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.delete('all', (err) => {
    if (err) {
      console.error('[❌] Error while deleting processes');
    } else {
      console.log('[✅] All PM2 processes have been successfully deleted.');
    }
    pm2.start({
      script: './worker/worker.js',
      name: `${config.worker.workerId}`,
      exec_mode: '',
      env: {WORKER_ID: config.worker.workerId }
    }, function (err, apps) {
      pm2.disconnect();   // Disconnects from PM2
      if (err) {
        console.error('[❌] Error while creating the default worker:', err);
      } else {
        console.log('[✅] Default worker started.');
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
            console.error('[❌] Error while sending the command to bot_commands_queue:', err);
          } else {
            console.log('[✅] Command successfully sent to bot_commands_queue config:', configBot.id);
          }
        });
      } else if(envStart === "test") {
        redis.rpush(`worker_commands_queue:${config.worker.workerId}`, commandData, (err, result) => {
          if (err) {
            console.error('[❌] Error while sending the command to worker_commands_queue:', err);
          } else {
            console.log('[✅] Command successfully sent to worker_commands_queue config:', configBot.id);
          }
        });
      }
    }
  });
});