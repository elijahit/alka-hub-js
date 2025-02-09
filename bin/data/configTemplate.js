// Code: bin/data/configTemplate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file configTemplate.js
 * @module configTemplate
 * @description Template di configurazione, con controllo in checkConfigApp.js con massimo 3 livelli di annidamento (key, subKey, subSubKey)
 */

const configTemplate = {
  database: {
    host: "INSERT_IP_HERE",
    port: 3306,
    user: "INSERT_USER_HERE",
    password: "INSERT_PASSWORD_HERE",
    database: "INSERT_DATABASE_HERE",
    dialect: "INSERT_DIALECT_HERE"
  },
  redis: {
    host: "INSERT_IP_HERE",
    port: 6379,
    password: "INSERT_PASSWORD_HERE"
  },
  worker: {
    maxBot: 10,
    retryDelay: 5000
  }
}

module.exports = { configTemplate }