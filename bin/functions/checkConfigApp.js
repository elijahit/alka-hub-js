const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config.json');

const checkConfigApp = function () {
  const { configTemplate } = require('../data/configTemplate');
  // Controllo o creazione del file di configurazione
  console.log(fs.existsSync(configPath))
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));
    console.log('[✅] File di configurazione creato con successo. Modifica il file config.json con i tuoi dati.');
    process.exit(0);
  } else {
    console.log('[✅] File di configurazione trovato.');
    console.log('[⚠] Controllo il file config.json per eventuali modifiche.');
    const configJson = require(configPath);
    // Controllo key e value del file di configurazione
    // massimo 3 livelli di annidamento (key, subKey, subSubKey)
    for (const key in configTemplate) {
      if (!configJson.hasOwnProperty(key)) {
        console.error(`[❌] Errore: la chiave ${key} non è stata trovata nel file di configurazione.`);
        process.exit(1);
      }
      else if (typeof configJson[key] !== typeof configTemplate[key]) {
        console.error(`[❌] Errore: il tipo di dati per la chiave ${key} non corrisponde.`);
        process.exit(1);
      }
      if (typeof configJson[key] === 'object') {
        // Controllo subKey e subValue del file di configurazione
        for (const subKey in configTemplate[key]) {
          if (!configJson[key].hasOwnProperty(subKey)) {
            console.error(`[❌] Errore: la chiave ${subKey} non è stata trovata nel file di configurazione.`);
            process.exit(1);
          }
          if (typeof configJson[key][subKey] !== typeof configTemplate[key][subKey]) {
            console.error(`[❌] Errore: il tipo di dati per la chiave ${subKey} non corrisponde.`);
            process.exit(1);
          }
          if (typeof configJson[key][subKey] === 'object') {
            // Controllo subSubKey e subSubValue del file di configurazione
            for (const subSubKey in configTemplate[key][subKey]) {
              if (!configJson[key][subKey].hasOwnProperty(subSubKey)) {
                console.error(`[❌] Errore: la chiave ${subSubKey} non è stata trovata nel file di configurazione.`);
                process.exit(1);
              }
              if (typeof configJson[key][subKey][subSubKey] !== typeof configTemplate[key][subKey][subSubKey]) {
                console.error(`[❌] Errore: il tipo di dati per la chiave ${subSubKey} non corrisponde.`);
                process.exit(1);
              }
            }
          }
        }
      }
    }
    console.log('[✅] Avvio del processo di avvio...');
  }
  // Fine controllo file di configurazione
}

module.exports = checkConfigApp;