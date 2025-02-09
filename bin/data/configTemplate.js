// Code: bin/data/configTemplate.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file configTemplate.js
 * @module configTemplate
 * @description Template di configurazione, con controllo in checkConfigApp.js con massimo 3 livelli di annidamento (key, subKey, subSubKey)
 */

const configTemplate = {
  database: { // database configuration
    host: "INSERT_IP_HERE", // database host
    port: 3306, // database port
    user: "INSERT_USER_HERE", // database user
    password: "INSERT_PASSWORD_HERE", // database password
    database: "INSERT_DATABASE_HERE", // database name
    dialect: "INSERT_DIALECT_HERE" // database dialect
  },
  redis: { // redis configuration
    host: "INSERT_IP_HERE", // redis host
    port: 6379, // redis port
    password: "INSERT_PASSWORD_HERE" // redis password
  },
  worker: { // worker configuration
    maxBot: 10, // maximum number of bots
    retryDelay: 5000 // retry delay
  }
}

module.exports = { configTemplate }