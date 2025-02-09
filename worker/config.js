// Code: config - worker/config.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file config.js
 * @module config
 * @description Contiene la configurazione del worker e di redis
 */

const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');
const configJson = fs.readFileSync(configPath, 'utf8');
const configFile = JSON.parse(configJson);

const config = {
  redis: {
    host: configFile.redis.host,
    port: configFile.redis.port,
    password: this.config.redis.password, 
  },
  worker: {
    maxBot: configFile.worker.maxBot,
    retryDelay: configFile.worker.retryDelay,
    workerId: Math.floor(Math.random() * 10000)
  }
};

module.exports = {
  config
};