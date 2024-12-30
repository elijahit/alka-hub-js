// Code: config - worker/config.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file config.js
 * @module config
 * @description Contiene la configurazione del worker e di redis
 */

const config = {
  redis: {
    host: 'alkanetwork.eu',
    port: 6379,
    password: 'Aarontosto20!', 
  },
  worker: {
    maxBot: 1,
    retryDelay: 5000,
    workerId: Math.floor(Math.random() * 10000),
  }
};

module.exports = {
  config
};