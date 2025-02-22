// Code: bin/functions/checkConfigApp.js
// Author: Gabriele Mario Tosto <g.tosto@flazio.com> - Alka Hub 2024/25
/**
 * @file checkConfigApp.js
 * @module checkConfigApp
 * @description Check the configuration file with a maximum of 3 levels of nesting (key, subKey, subSubKey)
 */

const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');

const checkConfigApp = function () {
  const { configTemplate } = require('../data/configTemplate');
  // Check or create the configuration file
  console.log(fs.existsSync(configPath))
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));
    console.log('[✅] Configuration file created successfully. Edit the config.json file with your data.');
    process.exit(0);
  } else {
    console.log('[✅] Configuration file found.');
    console.log('[⚠] Checking the config.json file for any changes.');
    const configJson = require(configPath);
    // Check key and value of the configuration file
    // maximum 3 levels of nesting (key, subKey, subSubKey)
    for (const key in configTemplate) {
      if (!configJson.hasOwnProperty(key)) {
        console.error(`[❌] Error: the key ${key} was not found in the configuration file.`);
        process.exit(1);
      }
      else if (typeof configJson[key] !== typeof configTemplate[key]) {
        console.error(`[❌] Error: the data type for the key ${key} does not match.`);
        process.exit(1);
      }
      if (typeof configJson[key] === 'object') {
        // Check subKey and subValue of the configuration file
        for (const subKey in configTemplate[key]) {
          if (!configJson[key].hasOwnProperty(subKey)) {
            console.error(`[❌] Error: the key ${subKey} was not found in the configuration file.`);
            process.exit(1);
          }
          if (typeof configJson[key][subKey] !== typeof configTemplate[key][subKey]) {
            console.error(`[❌] Error: the data type for the key ${subKey} does not match.`);
            process.exit(1);
          }
          if (typeof configJson[key][subKey] === 'object') {
            // Check subSubKey and subSubValue of the configuration file
            for (const subSubKey in configTemplate[key][subKey]) {
              if (!configJson[key][subKey].hasOwnProperty(subSubKey)) {
                console.error(`[❌] Error: the key ${subSubKey} was not found in the configuration file.`);
                process.exit(1);
              }
              if (typeof configJson[key][subKey][subSubKey] !== typeof configTemplate[key][subKey][subSubKey]) {
                console.error(`[❌] Error: the data type for the key ${subSubKey} does not match.`);
                process.exit(1);
              }
            }
          }
        }
      }
    }
    console.log('[✅] Starting the startup process...');
  }
  // End of configuration file check
}

module.exports = checkConfigApp;